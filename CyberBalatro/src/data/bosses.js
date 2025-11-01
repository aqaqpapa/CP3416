// This file defines the progression of bosses (Blinds) the player will face.

export const rounds = [
    {
      round: 1,
      boss: {
        name: 'Small Business Website',
        scoreToBeat: 300,
        reward: 10, // Base money reward
        icon: 'shop.svg',
        specialAbility: null, // The first boss has no special defense
      }
    },
    {
      round: 2,
      boss: {
        name: 'Corporate Email Server',
        scoreToBeat: 800,
        reward: 15,
        icon: 'envelope.svg',
        specialAbility: {
          name: 'Spam Filter',
          description: 'All ♦️ (Social Engineering) cards have -20 base chips.',
          // We will implement this effect later
        },
      }
    },
    {
      round: 3,
      boss: {
        name: 'University Database',
        scoreToBeat: 2000,
        reward: 20,
        icon: 'database.svg',
        specialAbility: {
          name: 'Data Encryption',
          description: 'All your cards will be face-down this round.',
        },
      }
    },
    // More rounds can be added here...
  ];
  