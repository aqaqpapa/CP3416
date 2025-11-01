import React from 'react';
import { RANK_THEME } from '../data/deck.js';

const iconModules = import.meta.glob('../assets/icons/*.svg', { as: 'raw', eager: true });
const getIconSvg = (rank) => iconModules[`../assets/icons/${rank}.svg`] || '<svg></svg>';

// ---------------------------------------------------
const cardStyles = `
  /* --- 主卡片样式 (无改动) --- */
  .card {
    width: 100px;
    height: 150px;
    background-color: #f8f8f8; color: #111; border: 1px solid #aaa;
    border-radius: 8px; font-size: 28px; font-weight: bold;
    display: flex; flex-direction: column; padding: 8px;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3); box-sizing: border-box;
    transition: all 0.2s ease; user-select: none; cursor: pointer;
    position: relative;
  }
  .card:hover { transform: translateY(-10px) scale(1.05); }
  .card.selected { transform: translateY(-20px) scale(1.1); border-color: #ffde59; box-shadow: 0 0 15px #ffde59; }
  
  /* --- 卡牌角落 (无改动) --- */
  .card-corner { display: flex; flex-direction: column; align-items: center; line-height: 1; }
  .card-rank { font-size: 22px; }
  .card-suit { font-size: 18px; }
  .card-header { align-self: flex-start; }
  .card-footer { align-self: flex-end; transform: rotate(180deg); }

  /* --- 【关键修复】: 调整卡牌中央内容区的位置和大小 --- */
 /* ... */
  .card-center-content {
    position: absolute;
    top: 50%;
    left: 50%;
    /* 
      【关键修复】
      Y轴偏移量从负数（向上）改为正数（向下），
      并使用一个更温和的值，比如 -45%。
      -50% 是完美居中，-45% 意味着比完美居中稍微向下移动5%。
    */
    transform: translate(-50%, -35%); 
    
    width: 80%;
    height: 55%; 
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }
  /* ... */

  .card-center-icon {
    width: 100%;
    height: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .card-center-icon svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: opacity(0.7) grayscale(30%);
    fill: currentColor;
  }

  .card-icon-name {
    font-size: 10px;
    font-weight: 600;
    color: #555;
    text-align: center;
  }
  
  /* --- 花色颜色和悬停提示 (无改动) --- */
  .suit-hearts, .suit-diamonds { color: #d92d2d; }
  .suit-spades, .suit-clubs { color: #111111; }
  .card-name-tooltip {
    position: absolute; bottom: -35px; left: 50%; transform: translateX(-50%);
    background: #222; color: #fff; padding: 5px 10px; border-radius: 4px;
    font-size: 12px; font-weight: normal; white-space: nowrap; opacity: 0;
    visibility: hidden; transition: opacity 0.2s 0.1s, visibility 0.2s 0.1s;
    pointer-events: none; z-index: 10;
  }
  .card:hover .card-name-tooltip { opacity: 1; visibility: visible; }
`;
// ---------------------------------------------------


export default function Card({ cardData, isSelected, onClick }) {
  const { rank, suit } = cardData;

  const handleClick = () => {
    onClick(cardData);
  };
  
  const className = `card suit-${suit} ${isSelected ? 'selected' : ''}`;
  
  const iconSvgString = getIconSvg(rank);
  const cyberName = RANK_THEME[rank]?.name || '';

  return (
    <>
      <style>{cardStyles}</style>
      <div className={className} onClick={handleClick}>
        
        {/* 左上角 */}
        <div className="card-header card-corner">
          <span className="card-rank">{rank}</span>
          <span className="card-suit">{suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : suit === 'spades' ? '♠' : '♣'}</span>
        </div>
        
        {/* 【结构调整】中央区域现在是一个包含图标和文字的容器 */}
        <div className="card-center-content">
          <div 
            className="card-center-icon" 
            dangerouslySetInnerHTML={{ __html: iconSvgString }}
          />
          {/* 【要求2: 新增】显示网络安全概念名称的小字 */}
          <div className="card-icon-name">
            {cyberName}
          </div>
        </div>
        
        {/* 右下角 */}
        <div className="card-footer card-corner">
          <span className="card-rank">{rank}</span>
          <span className="card-suit">{suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : suit === 'spades' ? '♠' : '♣'}</span>
        </div>
        
        {/* 悬停提示的功能保持不变，提供一个更清晰的阅读方式 */}
        <div className="card-name-tooltip">{cyberName}</div>
      </div>
    </>
  );
}