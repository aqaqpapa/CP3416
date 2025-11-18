// This file defines all possible Jokers (Hacker Skills) in the game.
// Each Joker's effect is thematically linked to a cybersecurity concept.

// Reminder of the mapping between Poker suits and cybersecurity domains:
// ♦️ diamonds: Social Engineering
// ♣️ clubs:    Malware
// ♥️ hearts:   Network Attack
// ♠️ spades:   Vulnerability

export const allJokers = [
    {
      id: 'joker_master_phisher',
      name: 'Master Phisher',
      description: 'Whenever you play a hand containing ♦️ (Social Engineering) cards, final multiplier +2.',
      icon: 'boat-fishing.svg',
      // Corresponds to the DIAMONDS suit
      applyEffect: ({ chips, mult }, context) => {
        const hasSocialEngineeringCard = context.hand.some(card => card.suit === 'diamonds');
        if (hasSocialEngineeringCard) {
          mult += 2;
        }
        return { chips, mult };
      }
    },
    {
      id: 'joker_ransomware_operator',
      name: 'Ransomware Operator',
      description: 'K (Ransomware) cards gain +100 base chips each.',
      icon: 'rope-coil.svg',
      // Corresponds to the KING rank
      applyEffect: ({ chips, mult }, context) => {
        const kingCount = context.hand.filter(card => card.rank === 'K').length;
        if (kingCount > 0) {
          chips += (100 * kingCount);
        }
        return { chips, mult };
      }
    },
    {
      id: 'joker_botnet_herder',
      name: 'Botnet Herder',
      description: 'Each ♥️ (Network Attack) card you play adds +20 chips.',
      icon: 'shambling-zombie.svg',
      // Corresponds to the HEARTS suit
      applyEffect: ({ chips, mult }, context) => {
        const networkAttackCardCount = context.hand.filter(card => card.suit === 'hearts').length;
        if (networkAttackCardCount > 0) {
          chips += (20 * networkAttackCardCount);
        }
        return { chips, mult };
      }
    },
    {
      id: 'joker_exploit_developer',
      name: 'Exploit Developer',
      description: 'All "Straight" hands (Kill Chain Sequences) have their base multiplier doubled (x2).',
      icon: 'hole.svg',
      // Corresponds to the STRAIGHT hand type
      applyEffect: ({ chips, mult }, context) => {
        if (context.handType.name === 'Straight') {
          mult *= 2;
        }
        return { chips, mult };
      }
    },
    {
      id: 'joker_sql_injector',
      name: 'SQL Injector',
      description: 'Each J (SQL Injection) card grants +20 chips and +2 multiplier.',
      icon: 'plague-doctor-profile.svg',
      // Simplified version of a complex effect (treating J as the highest card)
      applyEffect: ({ chips, mult }, context) => {
        const jackCount = context.hand.filter(card => card.rank === 'J').length;
        if (jackCount > 0) {
          chips += (20 * jackCount);
          mult += (2 * jackCount);
        }
        return { chips, mult };
      }
    },
  ];
  