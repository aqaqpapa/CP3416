import React, { useState, useEffect } from 'react';

// 一个自定义Hook，用于创建数字跳动动画
const useCountUp = (endValue, duration = 500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const current = Math.min(Math.floor((progress / duration) * endValue), endValue);
      setCount(current);
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [endValue, duration]);

  return count;
};

const styles = {
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: '30px',
    borderRadius: '10px',
    border: '2px solid #ffde59',
    width: '400px',
    textAlign: 'center',
    zIndex: 100, // Make sure it's on top of everything
  },
  line: {
    margin: '10px 0',
    fontSize: '24px',
    height: '30px', // Fixed height to prevent layout shift
  },
  finalScore: {
    marginTop: '20px',
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#ffde59',
  }
};

export default function ScoreAnimation({ sequence, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // When a new sequence starts, reset the index
  useEffect(() => {
    setCurrentIndex(0);
  }, [sequence]);

  // This effect drives the animation sequence
  useEffect(() => {
    if (currentIndex >= sequence.length) {
      // Sequence is finished, wait a bit then call onComplete
      setTimeout(onComplete, 1500);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 800); // 800ms delay between each step of the animation

    return () => clearTimeout(timer);
  }, [currentIndex, sequence, onComplete]);

  // Display only the steps of the sequence that have been revealed
  const revealedSequence = sequence.slice(0, currentIndex + 1);
  const lastItem = revealedSequence[revealedSequence.length - 1] || {};

  const animatedChips = useCountUp(lastItem.chips || 0);
  const animatedMult = useCountUp(lastItem.mult || 0);
  const animatedScore = useCountUp(lastItem.score || 0);

  return (
    <div style={styles.container}>
      {revealedSequence.map((item, index) => (
        <div key={index} style={styles.line}>
          {item.text}
        </div>
      ))}
      <div style={styles.finalScore}>
        {animatedChips} x {animatedMult} = {animatedScore}
      </div>
    </div>
  );
}