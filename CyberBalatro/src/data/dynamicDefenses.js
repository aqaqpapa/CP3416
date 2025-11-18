// src/data/dynamicDefenses.js

export const defensePool = [
  {
    name: "Security Patch Installed",
    description: "Intel: An emergency security patch has been rolled out, neutralizing all common vulnerability exploits (♠️ cards).",
    // 效果：让所有黑桃（漏洞利用）牌的基础分数变为 0
    effect: { type: 'DEBUFF_SUIT', suit: 'spades', modifier: 0 } 
  },
  {
    name: "Advanced Phishing Filters",
    description: "Notice: Enhanced phishing filters are online. All Social Engineering attacks (♦️ cards) are only half as effective.",
    // 效果：让所有方块（社交工程）牌的基础分数减半
    effect: { type: 'DEBUFF_SUIT', suit: 'diamonds', modifier: 0.5 }
  },
  {
    name: "Honeypot Deployed",
    description: "Warning: A Honeypot is active. Using low-level attack tools ('2', '3', '4') will trigger an alert, halving the score of this hand.",
    // 效果：如果出牌中包含 2, 3, 4，最终得分减半
    effect: { type: 'PENALIZE_ON_LOW_CARDS', ranks: ['2', '3', '4'], modifier: 0.5 }
  },
  {
    name: "Rate Limiting Enabled",
    description: "System Alert: Network rate limiting is active. Any brute-force attempts (hands with 3 or more cards of the same rank) will have their final score halved.",
    // 效果：如果打出三条或四条，最终得分减半
    effect: { type: 'PENALIZE_HIGH_RANK_COUNT', count: 3, modifier: 0.5 }
  }
];