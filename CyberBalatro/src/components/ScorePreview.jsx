import React from 'react';

const previewStyles = {
  container: {
    textAlign: 'center',
    minHeight: '80px', // Prevents layout shifts
  },
  themeName: { // Renamed from handName for clarity
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffde59',
    margin: 0, // No bottom margin
    lineHeight: '1.2',
  },
  pokerName: { // NEW style for the poker hand name
    fontSize: '16px',
    color: '#aaa',
    fontStyle: 'italic',
    margin: '4px 0 10px 0', // Add some space above and below
  },
  scoreText: {
    fontSize: '18px',
    margin: 0,
  }
};

export default function ScorePreview({ handInfo }) {
  if (!handInfo) {
    return <div style={previewStyles.container}></div>;
  }
  
  // Get both names from the handInfo object
  const themeName = handInfo.themeName || '...';
  const pokerName = handInfo.handName || '...';

  return (
    <div style={previewStyles.container}>
      {/* 1. Display the Cybersecurity Theme Name */}
      <h2 style={previewStyles.themeName}>{themeName}</h2>

      {/* 2. 【关键修复】: Display the Poker Hand Name in parentheses below */}
      {/* We only show the poker name if it's different from the theme name */}
      {themeName !== pokerName && (
        <p style={previewStyles.pokerName}>({pokerName})</p>
      )}

      {/* 3. Display the score calculation */}
      <p style={previewStyles.scoreText}>
        {handInfo.chips} Chips x {handInfo.mult} Mult = {handInfo.score}
      </p>
    </div>
  );
}