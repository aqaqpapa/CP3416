// src/data/bosses.js

export const rounds = [
  {
    round: 1,
    boss: {
      name: 'Small Business Website',
      scoreToBeat: 300,
      reward: 10,
      icon: 'shop.svg',
      // 【改动】弱点改为基于卡牌等级 (Rank)
      weaknesses: ['Q', '6'], // Phishing, Brute Force
      // 【改动】抗性也基于 Rank
      resistances: ['A'], // Zero-Day Exploit
      // 【新增】解释为什么会有此强弱点
      rationale: "A small business often lacks robust security training and uses simple passwords, making it highly vulnerable to Phishing and Brute Force attacks. However, it's an unlikely target for a valuable and rare Zero-Day Exploit.",
      specialAbility: null,
    }
  },
  {
    round: 2,
    boss: {
      name: 'Corporate Email Server',
      scoreToBeat: 800,
      reward: 15,
      icon: 'envelope.svg',
      // 【改动】
      weaknesses: ['Q', '5'], // Phishing, Credential Stuffing
      resistances: ['7'], // DDoS
      rationale: "Corporate email systems are prime targets for Phishing. If employee credentials are stolen from other sites, they are also susceptible to Credential Stuffing. They usually have strong infrastructure to resist basic DDoS attacks.",
      specialAbility: null, // 我们暂时移除旧的特殊能力，让强弱点更突出
    }
  },
  {
    round: 3,
    boss: {
      name: 'University Database',
      scoreToBeat: 2000,
      reward: 20,
      icon: 'database.svg',
      // 【改动】
      weaknesses: ['J', '8'], // SQL Injection, Cross-site Scripting
      resistances: ['3'], // Social Engineering
      rationale: "Databases are classic targets for SQL Injection to steal data. University web portals can also be complex and prone to Cross-Site Scripting. However, direct access to the database server is often restricted, limiting attacks that require human interaction like Social Engineering.",
      specialAbility: {
        name: 'Data Encryption',
        description: 'All your cards will be face-down this round.',
      },
    }
  },
  // 【新增】一个更具挑战性的 Boss
  {
    round: 4,
    boss: {
      name: 'National Power Grid',
      scoreToBeat: 6000,
      reward: 25,
      icon: 'database.svg', // 你可以稍后更换一个更合适的图标
      weaknesses: ['A', '9'], // Zero-Day Exploit, Man-in-the-Middle
      resistances: ['2', '4', '6'], // Spam, Port Scanning, Brute Force
      rationale: "Attacking critical infrastructure requires sophisticated methods. A Zero-Day Exploit in industrial control systems or a Man-in-the-Middle attack on network traffic are major threats. Basic, noisy attacks like Port Scanning or Brute Force would be easily detected and blocked.",
      specialAbility: {
          name: 'Redundant Systems',
          description: 'The first hand played each round has its score halved.',
      },
    }
  }
];