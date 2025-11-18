// src/logic/gameLogic.js

const RANK_VALUES = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
const CARD_CHIP_VALUES = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11 };
const WEAKNESS_MODIFIER = 2;
const RESISTANCE_MODIFIER = 0.5;

// --- Hand Types (无变化) ---
export const HAND_TYPES = {
  HIGH_CARD: { name: 'High Card', themeName: 'Brute Force', baseChips: 5, baseMult: 1 },
  PAIR: { name: 'Pair', themeName: 'Phishing + Malware', baseChips: 10, baseMult: 2 },
  TWO_PAIR: { name: 'Two Pair', themeName: 'Dual-Vector Attack', baseChips: 20, baseMult: 2 },
  THREE_OF_A_KIND: { name: 'Three of a Kind', themeName: 'DDoS Attack', baseChips: 30, baseMult: 3 },
  STRAIGHT: { name: 'Straight', themeName: 'Cyber Kill Chain', baseChips: 30, baseMult: 4 },
  FLUSH: { name: 'Flush', themeName: 'Coordinated Social Engineering', baseChips: 35, baseMult: 4 },
  FULL_HOUSE: { name: 'Full House', themeName: 'Hybrid Threat', baseChips: 40, baseMult: 4 },
  FOUR_OF_A_KIND: { name: 'Four of a Kind', themeName: 'Zero-Day Exploitation', baseChips: 60, baseMult: 7 },
  STRAIGHT_FLUSH: { name: 'Straight Flush', themeName: 'Advanced Persistent Threat (APT)', baseChips: 100, baseMult: 8 },
};

// --- Helper Functions (无变化) ---
export const evaluateHand = (hand) => {
    if (!hand || hand.length === 0) return HAND_TYPES.HIGH_CARD;
    const isFlush = (h) => h.every(card => card.suit === h[0].suit);
    const isStraight = (h) => {
        if (h.length < 5) return false;
        const sortedValues = [...new Set(h.map(c => RANK_VALUES[c.rank]))].sort((a, b) => a - b);
        if (sortedValues.length !== 5) return false;
        const isAceLow = sortedValues.join(',') === '2,3,4,5,14';
        if (isAceLow) return true;
        for (let i = 0; i < sortedValues.length - 1; i++) if (sortedValues[i+1] - sortedValues[i] !== 1) return false;
        return true;
    };
    const rankCounts = hand.reduce((counts, card) => { counts[card.rank] = (counts[card.rank] || 0) + 1; return counts; }, {});
    const counts = Object.values(rankCounts);
    if (hand.length === 5 && isStraight(hand) && isFlush(hand)) return HAND_TYPES.STRAIGHT_FLUSH;
    if (counts.includes(4)) return HAND_TYPES.FOUR_OF_A_KIND;
    if (counts.includes(3) && counts.includes(2)) return HAND_TYPES.FULL_HOUSE;
    if (hand.length === 5 && isFlush(hand)) return HAND_TYPES.FLUSH;
    if (hand.length === 5 && isStraight(hand)) return HAND_TYPES.STRAIGHT;
    if (counts.includes(3)) return HAND_TYPES.THREE_OF_A_KIND;
    if (counts.filter(c => c === 2).length === 2) return HAND_TYPES.TWO_PAIR;
    if (counts.includes(2)) return HAND_TYPES.PAIR;
    return HAND_TYPES.HIGH_CARD;
};

const getScoringCards = (hand, handType) => {
    const rankCounts = hand.reduce((counts, card) => { counts[card.rank] = (counts[card.rank] || 0) + 1; return counts; }, {});
    switch (handType.name) {
        case 'High Card': return [hand.reduce((h, c) => RANK_VALUES[c.rank] > RANK_VALUES[h.rank] ? c : h, hand[0])];
        case 'Pair': case 'Three of a Kind': case 'Four of a Kind':
            const count = {'Pair': 2, 'Three of a Kind': 3, 'Four of a Kind': 4}[handType.name];
            const rank = Object.keys(rankCounts).find(r => rankCounts[r] === count);
            return hand.filter(c => c.rank === rank);
        case 'Two Pair':
            const ranks = Object.keys(rankCounts).filter(r => rankCounts[r] === 2);
            return hand.filter(c => ranks.includes(c.rank));
        default: return hand;
    }
}

// --- 【核心修改】: 全面重构计分函数 ---

// 【修改】: 更新函数签名以接收 activeDefense
// 这个函数现在是 calculateScoreWithSequence 的一个简化包装，用于得分预览
export const calculateScore = (hand, handType, jokers = [], currentBoss = null, activeDefense = null) => {
    if (!hand || !handType) return { chips: 0, mult: 0, score: 0 };
    const { finalResult } = calculateScoreWithSequence(hand, handType, jokers, currentBoss, activeDefense);
    return finalResult;
}

// 【修改】: 主计分函数，现在集成了所有逻辑
export const calculateScoreWithSequence = (hand, handType, jokers = [], currentBoss = null, activeDefense = null) => {
    if (!hand || hand.length === 0 || !handType) {
        return { finalResult: { chips: 0, mult: 0, score: 0 }, sequence: [] };
    }
    
    let chips = handType.baseChips;
    let mult = handType.baseMult;
    const sequence = [{ text: `${handType.themeName || handType.name}`, chips, mult, score: chips * mult }];

    // 步骤 1: 计算卡牌基础分 (Chips)，应用 Boss 弱点/抗性 和 动态防御 (卡牌层面)
    const scoringCards = getScoringCards(hand, handType);
    scoringCards.forEach(card => {
        let cardChips = CARD_CHIP_VALUES[card.rank];
        let effectText = '';

        if (currentBoss?.weaknesses?.includes(card.rank)) {
            cardChips *= WEAKNESS_MODIFIER;
            effectText += ` (Weakness x${WEAKNESS_MODIFIER})`;
        }
        if (currentBoss?.resistances?.includes(card.rank)) {
            cardChips *= RESISTANCE_MODIFIER;
            effectText += ` (Resistance x${RESISTANCE_MODIFIER})`;
        }
        if (activeDefense?.effect.type === 'DEBUFF_SUIT' && card.suit === activeDefense.effect.suit) {
            cardChips *= activeDefense.effect.modifier;
            effectText += ` (${activeDefense.name} x${activeDefense.effect.modifier})`;
        }
        
        const roundedChips = Math.round(cardChips);
        chips += roundedChips;
        sequence.push({ text: `${card.rank} (+${roundedChips})${effectText}`, chips, mult, score: chips * mult });
    });

    // 步骤 2: 应用 Joker/Hacker Skills 的效果
    const context = { hand, handType, scoringCards };
    jokers.forEach(joker => {
        const oldState = { chips, mult };
        const newState = joker.applyEffect ? joker.applyEffect(oldState, context) : oldState;
        if (newState.chips !== oldState.chips || newState.mult !== oldState.mult) {
            const chipChange = newState.chips - oldState.chips;
            const multChange = newState.mult - oldState.mult;
            let jokerEffectText = `${joker.name} (`;
            if (chipChange !== 0) jokerEffectText += `${chipChange > 0 ? '+' : ''}${chipChange} Chips`;
            if (multChange !== 0) jokerEffectText += `${chipChange !== 0 ? ', ' : ''}${multChange > 0 ? '+' : ''}${multChange} Mult`;
            jokerEffectText += `)`;
            sequence.push({ text: jokerEffectText, chips: newState.chips, mult: newState.mult, score: newState.chips * mult });
            chips = newState.chips;
            mult = newState.mult;
        }
    });

    // 步骤 3: 计算初步总分，并应用动态防御 (总分层面)
    let score = chips * mult;
    let defensePenaltyText = null;

    if (activeDefense) {
        const effect = activeDefense.effect;
        const handRanks = hand.map(c => c.rank);
        const rankCounts = hand.reduce((acc, card) => { acc[card.rank] = (acc[card.rank] || 0) + 1; return acc; }, {});

        if (effect.type === 'PENALIZE_ON_LOW_CARDS' && handRanks.some(rank => effect.ranks.includes(rank))) {
            score *= effect.modifier;
            defensePenaltyText = `${activeDefense.name} (Score x${effect.modifier})`;
        }
        if (effect.type === 'PENALIZE_HIGH_RANK_COUNT' && Object.values(rankCounts).some(count => count >= effect.count)) {
            score *= effect.modifier;
            defensePenaltyText = `${activeDefense.name} (Score x${effect.modifier})`;
        }
    }

    score = Math.round(score);

    // 步骤 4: 如果有总分惩罚，将其添加到动画序列的最后一步
    if (defensePenaltyText) {
        sequence.push({ text: defensePenaltyText, chips, mult, score });
    }

    const finalResult = { chips, mult, score };
    return { finalResult, sequence };
};