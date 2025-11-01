import React from 'react';
import JokerCard from './JokerCard.jsx';

const styles = {
  shopContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
  },
  title: {
    fontSize: '48px',
    color: '#ffde59',
    textShadow: '0 0 10px #ffde59',
  },
  itemSlots: {
    display: 'flex',
    gap: '15px',
  },
  buyButton: {
    padding: '8px 16px',
    fontSize: '14px',
    marginTop: '10px',
  },
  proceedButton: {
    padding: '20px 40px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  itemContainer: {
    textAlign: 'center',
  }
};

export default function Shop({ money, onBuyJoker, onProceed, availableJokers }) {
  return (
    <div style={styles.shopContainer}>
      <h1 style={styles.title}>Dark Web Market</h1>
      <div style={styles.itemSlots}>
        {availableJokers.map(joker => (
          <div key={joker.id} style={styles.itemContainer}>
            <JokerCard joker={joker} />
            <button 
              style={styles.buyButton} 
              onClick={() => onBuyJoker(joker)}
              disabled={money < 10} // Assuming all jokers cost $10 for now
            >
              Buy ($10)
            </button>
          </div>
        ))}
      </div>
      <button style={styles.proceedButton} onClick={onProceed}>
        Next!
      </button>
    </div>
  );
}