// This file now includes the cybersecurity theme mapping and EXPORTS them.

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['diamonds', 'clubs', 'hearts', 'spades'];

// --- 【关键修复】: 确保这两个对象前面都有 'export' 关键字 ---
export const SUIT_THEME = {
  diamonds: { name: 'Social Engineering', icon: '♦️' },
  clubs:    { name: 'Malware', icon: '♣️' },
  hearts:   { name: 'Network Attack', icon: '♥️' },
  spades:   { name: 'Vulnerability', icon: '♠️' },
};

export const RANK_THEME = {
  'A': { name: 'Zero-Day Exploit' },
  'K': { name: 'Ransomware' },
  'Q': { name: 'Phishing' },
  'J': { name: 'SQL Injection' },
  '10': { name: 'Malware' },
  '9': { name: 'Man-in-the-Middle' },
  '8': { name: 'Cross-site Scripting' },
  '7': { name: 'DDoS' },
  '6': { name: 'Brute Force' },
  '5': { name: 'Credential Stuffing' },
  '4': { name: 'Port Scanning' },
  '3': { name: 'Social Engineering' },
  '2': { name: 'Spam' },
};
// --- 修复结束 ---

const createDeck = () => {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${rank}-${suit}`,
        rank: rank,
        suit: suit,
        // The name from RANK_THEME is added to each card object
        name: RANK_THEME[rank].name, 
      });
    }
  }
  return deck;
};

export const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default createDeck;