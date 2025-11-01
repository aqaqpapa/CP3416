const RANK_VALUES = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
const CARD_CHIP_VALUES = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11 };

// --- 【关键修复】: 完全替换 HAND_TYPES 为纯英文主题版本 ---
export const HAND_TYPES = {
  HIGH_CARD: { 
    name: 'High Card', 
    themeName: 'Brute Force', // 高牌现在是暴力破解
    baseChips: 5, 
    baseMult: 1 
  },
  PAIR: { 
    name: 'Pair', 
    themeName: 'Phishing + Malware',
    baseChips: 10, 
    baseMult: 2 
  },
  TWO_PAIR: { 
    name: 'Two Pair', 
    themeName: 'Dual-Vector Attack',
    baseChips: 20, 
    baseMult: 2 
  },
  THREE_OF_A_KIND: { 
    name: 'Three of a Kind', 
    themeName: 'DDoS Attack',
    baseChips: 30, 
    baseMult: 3 
  },
  STRAIGHT: { 
    name: 'Straight', 
    themeName: 'Cyber Kill Chain',
    baseChips: 30, 
    baseMult: 4 
  },
  FLUSH: { 
    name: 'Flush', 
    themeName: 'Coordinated Social Engineering',
    baseChips: 35, 
    baseMult: 4 
  },
  FULL_HOUSE: { 
    name: 'Full House', 
    themeName: 'Hybrid Threat',
    baseChips: 40, 
    baseMult: 4 
  },
  FOUR_OF_A_KIND: { 
    name: 'Four of a Kind', 
    themeName: 'Zero-Day Exploitation',
    baseChips: 60, 
    baseMult: 7 
  },
  STRAIGHT_FLUSH: { 
    name: 'Straight Flush', 
    themeName: 'Advanced Persistent Threat (APT)',
    baseChips: 100, 
    baseMult: 8 
  },
};
// --- 修复结束 ---

// The rest of the file (evaluateHand, getScoringCards, calculateScore, etc.)
// is already correct and does not need any changes.

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
    const hasFourOfAKind = counts.includes(4);
    const hasThreeOfAKind = counts.includes(3);
    const pairs = counts.filter(c => c === 2).length;
    const hasPair = pairs > 0;
    const hasTwoPair = pairs === 2;
    const hasFullHouse = hasThreeOfAKind && hasPair;
    const isFiveCards = hand.length === 5;
    if (isFiveCards && isStraight(hand) && isFlush(hand)) return HAND_TYPES.STRAIGHT_FLUSH;
    if (hasFourOfAKind) return HAND_TYPES.FOUR_OF_A_KIND;
    if (hasFullHouse) return HAND_TYPES.FULL_HOUSE;
    if (isFiveCards && isFlush(hand)) return HAND_TYPES.FLUSH;
    if (isFiveCards && isStraight(hand)) return HAND_TYPES.STRAIGHT;
    if (hasThreeOfAKind) return HAND_TYPES.THREE_OF_A_KIND;
    if (hasTwoPair) return HAND_TYPES.TWO_PAIR;
    if (hasPair) return HAND_TYPES.PAIR;
    return HAND_TYPES.HIGH_CARD;
};

const getScoringCards = (hand, handType) => {
    const rankCounts = hand.reduce((counts, card) => { counts[card.rank] = (counts[card.rank] || 0) + 1; return counts; }, {});
    switch (handType.name) {
        case 'High Card':
            const highestCard = hand.reduce((highest, card) => RANK_VALUES[card.rank] > RANK_VALUES[highest.rank] ? card : highest, hand[0]);
            return [highestCard];
        case 'Pair': case 'Three of a Kind': case 'Four of a Kind':
            const targetCount = handType.name === 'Pair' ? 2 : handType.name === 'Three of a Kind' ? 3 : 4;
            const rankToKeep = Object.keys(rankCounts).find(rank => rankCounts[rank] === targetCount);
            return hand.filter(card => card.rank === rankToKeep);
        case 'Two Pair':
            const pairRanks = Object.keys(rankCounts).filter(rank => rankCounts[rank] === 2);
            return hand.filter(card => pairRanks.includes(card.rank));
        default: return hand;
    }
}

const calculateScoreInternal = (hand, handType, jokers = []) => {
    if (!hand || !handType) return { chips: 0, mult: 0, score: 0 };
    let chips = handType.baseChips;
    let mult = handType.baseMult;
    const scoringCards = getScoringCards(hand, handType);
    scoringCards.forEach(card => { chips += CARD_CHIP_VALUES[card.rank]; });
    const context = { hand, handType, scoringCards };
    jokers.forEach(joker => {
        if (joker.applyEffect && typeof joker.applyEffect === 'function') {
            const result = joker.applyEffect({ chips, mult }, context);
            chips = result.chips;
            mult = result.mult;
        }
    });
    return { chips, mult, score: chips * mult };
}

export const calculateScore = (hand, handType, jokers = []) => {
    return calculateScoreInternal(hand, handType, jokers);
}

export const calculateScoreWithSequence = (hand, handType, jokers = []) => {
    if (!hand || !handType) return { finalResult: { chips: 0, mult: 0, score: 0 }, sequence: [] };
    let chips = 0;
    let mult = 0;
    const sequence = [];
    chips += handType.baseChips;
    mult += handType.baseMult;
    sequence.push({ text: `${handType.themeName || handType.name}`, chips, mult, score: chips * mult }); // Use themeName in animation
    const scoringCards = getScoringCards(hand, handType);
    scoringCards.forEach(card => {
        const cardChips = CARD_CHIP_VALUES[card.rank];
        chips += cardChips;
        sequence.push({ text: `${card.rank} (+${cardChips} Chips)`, chips, mult, score: chips * mult });
    });
    const context = { hand, handType, scoringCards };
    jokers.forEach(joker => {
        const oldState = { chips, mult };
        const newState = joker.applyEffect ? joker.applyEffect(oldState, context) : oldState;
        if (newState.chips !== oldState.chips || newState.mult !== oldState.mult) {
            const chipChange = newState.chips - oldState.chips;
            const multChange = newState.mult - oldState.mult;
            let effectText = `${joker.name} (`;
            if (chipChange !== 0) effectText += `${chipChange > 0 ? '+' : ''}${chipChange} Chips`;
            if (multChange !== 0) effectText += `${chipChange !== 0 ? ', ' : ''}${multChange > 0 ? '+' : ''}${multChange} Mult`;
            if (newState.mult > oldState.mult && oldState.mult > 0 && (newState.mult / oldState.mult) > 1.1) {
                effectText = `${joker.name} (x${(newState.mult / oldState.mult).toFixed(1)} Mult)`;
            }
            effectText += `)`;
            sequence.push({ text: effectText, chips: newState.chips, mult: newState.mult, score: newState.chips * newState.mult });
            chips = newState.chips;
            mult = newState.mult;
        }
    });
    const finalResult = { chips, mult, score: chips * mult };
    return { finalResult, sequence };
};