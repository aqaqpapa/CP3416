// src/components/TutorialGuide.jsx

import React, { useLayoutEffect, useState } from 'react';
import './TutorialGuide.css';

export default function TutorialGuide({ step, onNextStep, onEndTutorial, targetClass }) {
  const [highlightStyle, setHighlightStyle] = useState({});
  const [tooltipStyle, setTooltipStyle] = useState({});

  // --- MODIFICATION: Expanded to 9 steps with all new text ---
  const TUTORIAL_TEXTS = {
    1: 'Welcome! Your goal is to achieve the "Required Score" to breach the target system.',
    2: 'Pay attention to the Target\'s Weaknesses and Resistances. Attacking a Weakness doubles your score, while hitting a Resistance cuts it in half!',
    3: 'On the left are the Scoring Rules. Different card combinations give different base "Chips" (score) and "Mult" (multipliers). Aim for stronger hands!',
    4: 'This is your hand. You can select up to 5 cards to form an attack.',
    5: 'Let\'s try a powerful attack: "Two Pair". Select two cards of one rank, and two of another (e.g., both \'7\'s and both \'K\'s).',
    6: 'Great! You\'ve formed a "Two Pair" hand. Now, press "Play Attack" to launch it.',
    7: 'Excellent! Your score has increased. You must reach the target score before you run out of "Hands Remaining".',
    8: 'Finally, these are your Hacker Skills. They provide game-changing abilities. This is the core of the game, so explore them as you win rounds!',
    9: 'You\'ve learned the basics. Good luck, hacker!',
  };
  // --- END OF MODIFICATION ---

  useLayoutEffect(() => {
    if (!targetClass) {
      setHighlightStyle({ display: 'none' });
      setTooltipStyle({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
      return;
    }

    const targetElement = document.querySelector(`.${targetClass}`);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const newHighlightStyle = {
        position: 'fixed',
        top: `${rect.top}px`, left: `${rect.left}px`,
        width: `${rect.width}px`, height: `${rect.height}px`,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
        pointerEvents: 'none',
      };

      const tooltipHeight = 180; // Increased estimated height for potentially longer text
      const newTooltipStyle = {
        top: `${rect.bottom + 10}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)',
      };

      if (rect.bottom + tooltipHeight > window.innerHeight) {
        newTooltipStyle.top = `${rect.top - tooltipHeight}px`;
      }
      if (rect.top - tooltipHeight < 0 && rect.bottom + 10 < window.innerHeight) {
        newTooltipStyle.top = `${rect.bottom + 10}px`;
      }

      setHighlightStyle(newHighlightStyle);
      setTooltipStyle(newTooltipStyle);
    }
  }, [step, targetClass]);

  const text = TUTORIAL_TEXTS[step];
  if (!text) return null;

  const isFinalStep = step === 9; // Final step is now 9
  // MODIFICATION: Updated step numbers that require a user action
  const requiresAction = step === 5 || step === 6 || step === 7;

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-highlight" style={highlightStyle}></div>
      <div className="tutorial-tooltip" style={tooltipStyle}>
        <p>{text}</p>

        {isFinalStep ? (
          <button onClick={onEndTutorial}>Start Game</button>
        ) : (
          !requiresAction && <button onClick={onNextStep}>Next</button>
        )}
      </div>
    </div>
  );
}