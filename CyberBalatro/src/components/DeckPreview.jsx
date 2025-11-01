import React from 'react';
import createDeck from '../data/deck.js';

// MiniCard component: I've made the cards slightly larger and increased font size
const MiniCard = ({ card, status }) => {
  const suitSymbol = card.suit === 'hearts' ? '♥' : card.suit === 'diamonds' ? '♦' : card.suit === 'spades' ? '♠' : '♣';
  const color = (status === 'in-deck' && (card.suit === 'hearts' || card.suit === 'diamonds')) ? '#d92d2d' : 
                (status === 'in-deck') ? '#111111' : '#888';
  
  const styles = {
    card: {
      fontSize: '12px', // 【放大】
      fontWeight: 'bold',
      border: '1px solid #999',
      borderRadius: '3px', // 【放大】
      width: '30px', // 【放大】
      height: '42px', // 【放大】
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: status === 'in-deck' ? '#fff' : '#aaa',
      color: color,
      filter: status === 'used' ? 'grayscale(80%)' : 'none',
    }
  };
  return <div style={styles.card}><span>{card.rank}</span><span>{suitSymbol}</span></div>;
};


export default function DeckPreview({ deck, hand, discardPile }) {
  const masterDeck = createDeck().sort((a,b) => a.id.localeCompare(b.id));
  const cardsInDeck = new Set(deck.map(c => c.id));

  const styles = {
    container: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      
      width: '480px', // 【放大】从 380px 增加到 480px
      backgroundColor: 'rgba(20, 20, 20, 0.98)',
      border: '2px solid #ffde59',
      borderRadius: '10px', // 【放大】
      padding: '20px', // 【放大】
      boxShadow: '0 0 30px rgba(0,0,0,0.7)',
      zIndex: 9999,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(13, 1fr)',
      gap: '6px', // 【放大】
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {masterDeck.map(card => {
          const status = cardsInDeck.has(card.id) ? 'in-deck' : 'used';
          return <MiniCard key={card.id} card={card} status={status} />;
        })}
      </div>
    </div>
  );
}