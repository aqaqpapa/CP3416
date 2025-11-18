import React from 'react';

const styles = {
  container: {
    padding: '10px 15px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    marginTop: '20px',
    textAlign: 'center',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    color: '#ffde59',
  },
  counts: {
    display: 'flex',
    justifyContent: 'space-around',
    fontSize: '16px',
  },
  countItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  countNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
};

export default function DeckTracker({ deckCount, discardCount }) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Deck Info</h3>
      <div style={styles.counts}>
        <div style={styles.countItem}>
          <span style={styles.countNumber}>{deckCount}</span>
          <span>Left (Deck)</span>
        </div>
        <div style={styles.countItem}>
          <span style={styles.countNumber}>{discardCount}</span>
          <span>(Discard)</span>
        </div>
      </div>
    </div>
  );
}