import React from 'react';

const jokerIconModules = import.meta.glob('../assets/jokers/*.svg', { as: 'raw', eager: true });
const getJokerIconSvg = (iconFilename) => {
    if (!iconFilename) return '<svg></svg>';
    const path = `../assets/jokers/${iconFilename}`;
    return jokerIconModules[path] || '<svg></svg>';
};

// --- CSS Styles ---
const jokerCardStyles = `
  /* This is the new parent container */
  .joker-slot {
    position: relative; /* This will be the new positioning context for the tooltip */
  }

  .joker-card-container {
    width: 90px;
    height: 120px;
    background-color: #3a3a3a;
    border: 2px solid #666;
    border-radius: 8px;
    padding: 8px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
    cursor: help;
    overflow: hidden; /* This is fine, it only applies to the icon inside */
    transition: border-color 0.2s;
  }
  .joker-slot:hover .joker-card-container { 
    border-color: #ffde59; 
  }

  .joker-icon {
    width: 85%;
    height: 85%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .joker-icon svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: invert(90%) sepia(10%) saturate(100%) hue-rotate(180deg);
  }

  .joker-tooltip {
    position: absolute;
    bottom: 100%; /* Position it ABOVE the card */
    left: 50%;
    transform: translateX(-50%) translateY(10px); /* Initially slightly down */
    margin-bottom: 10px; /* Space between card and tooltip */

    width: 180px; /* Wider for more text */
    background: #111;
    color: #fff;
    padding: 10px;
    border: 1px solid #ffde59;
    border-radius: 5px;
    font-size: 12px;
    text-align: center;
    
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    pointer-events: none;
    z-index: 20;
  }
  
  /* When hovering the SLOT, the tooltip appears */
  .joker-slot:hover .joker-tooltip { 
    opacity: 1; 
    visibility: visible;
    transform: translateX(-50%) translateY(0); /* Move it to its final position */
  }
  .tooltip-name { font-weight: bold; color: #ffde59; margin: 0 0 5px 0; }
  .tooltip-desc { margin: 0; }
`;

export default function JokerCard({ joker }) {
  if (!joker) return null;

  const iconSvgString = getJokerIconSvg(joker.icon);

  return (
    <>
      <style>{jokerCardStyles}</style>
      {/* 【关键改动】: We wrap everything in a new parent div */}
      <div className="joker-slot">
        <div className="joker-card-container">
          <div className="joker-icon" dangerouslySetInnerHTML={{ __html: iconSvgString }} />
        </div>
        <div className="joker-tooltip">
          <h4 className="tooltip-name">{joker.name}</h4>
          <p className="tooltip-desc">{joker.description}</p>
        </div>
      </div>
    </>
  );
}