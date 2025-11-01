import React, { useState, useEffect } from 'react';
// Components
import Card from '../components/Card.jsx';
import HandRules from '../components/HandRules.jsx';
import ScorePreview from '../components/ScorePreview.jsx';
import JokerCard from '../components/JokerCard.jsx';
import Legend from '../components/Legend.jsx';
import Shop from '../components/Shop.jsx';
import DeckTracker from '../components/DeckTracker.jsx';
import ScoreAnimation from '../components/ScoreAnimation.jsx';
import DeckPreview from '../components/DeckPreview.jsx'; // <-- 1. 导入新组件
// Data & Logic
import createDeck, { shuffleDeck } from '../data/deck.js';
import { evaluateHand, calculateScore, calculateScoreWithSequence } from '../logic/gameLogic.js';
import { allJokers } from '../data/jokers.js';
import { rounds } from '../data/bosses.js';

// Boss icon loading logic
const bossIconModules = import.meta.glob('../assets/bosses/*.svg', { as: 'raw', eager: true });
const getBossIconSvg = (iconFilename) => {
  if (!iconFilename) return '<svg></svg>';
  const path = `../assets/bosses/${iconFilename}`;
  return bossIconModules[path] || '<svg></svg>';
};

const GAME_STATES = { PLAYING: 'PLAYING', ANIMATING: 'ANIMATING', SHOP: 'SHOP', GAME_OVER: 'GAME_OVER' };
const MAX_HAND_SIZE = 8;
const MAX_SELECT_SIZE = 5;

export default function GamePage() {
  const [gameState, setGameState] = useState(GAME_STATES.PLAYING);
  const [roundNum, setRoundNum] = useState(1);
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [myJokers, setMyJokers] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [money, setMoney] = useState(10);
  const [handsRemaining, setHandsRemaining] = useState(4);
  const [discardsRemaining, setDiscardsRemaining] = useState(3);
  const [previewInfo, setPreviewInfo] = useState(null);
  const [shopJokers, setShopJokers] = useState([]);
  const [animationSequence, setAnimationSequence] = useState([]);
  const [finalAnimatedResult, setFinalAnimatedResult] = useState(null);

  // --- 【新增】: State to control the preview visibility ---
  const [showDeckPreview, setShowDeckPreview] = useState(false);

  const currentBoss = rounds.find((r) => r.round === roundNum)?.boss;

  useEffect(() => { startNewGame(); }, []);
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING && selectedCards.length > 0) {
      const handType = evaluateHand(selectedCards);
      const result = calculateScore(selectedCards, handType, myJokers);
      setPreviewInfo({ ...result, handName: handType.name, themeName: handType.themeName });
    } else { setPreviewInfo(null); }
  }, [selectedCards, myJokers, gameState]);
  
  // All your functions are correct and remain the same.
  const drawCards = (numToDraw, currentDeck, currentDiscard) => { let newCards = [], deck = [...currentDeck], discard = [...currentDiscard]; for (let i = 0; i < numToDraw; i++) { if (deck.length === 0) { if (discard.length === 0) break; deck = shuffleDeck(discard); discard = []; } newCards.push(deck.pop()); } return { newCards, updatedDeck: deck, updatedDiscard: discard }; };
  const startNewGame = () => { const fullDeck = shuffleDeck(createDeck()); setDeck(fullDeck.slice(MAX_HAND_SIZE)); setHand(fullDeck.slice(0, MAX_HAND_SIZE)); setDiscardPile([]); setSelectedCards([]); setMyJokers([]); setScore(0); setMoney(10); setHandsRemaining(4); setDiscardsRemaining(3); setRoundNum(1); setGameState(GAME_STATES.PLAYING); };
  const handlePlayHand = () => { if (selectedCards.length === 0 || gameState !== GAME_STATES.PLAYING) return; const handType = evaluateHand(selectedCards); const { finalResult, sequence } = calculateScoreWithSequence(selectedCards, handType, myJokers); setAnimationSequence(sequence); setFinalAnimatedResult(finalResult); setGameState(GAME_STATES.ANIMATING); };
  const handleAnimationComplete = () => { const newScore = score + finalAnimatedResult.score; const newHandsRemaining = handsRemaining - 1; setScore(newScore); setHandsRemaining(newHandsRemaining); const updatedDiscardPile = [...discardPile, ...selectedCards]; setDiscardPile(updatedDiscardPile); const remainingHand = hand.filter((card) => !selectedCards.some((sc) => sc.id === card.id)); const { newCards, updatedDeck, updatedDiscard } = drawCards( MAX_HAND_SIZE - remainingHand.length, deck, updatedDiscardPile ); setHand([...remainingHand, ...newCards]); setDeck(updatedDeck); setDiscardPile(updatedDiscard); setSelectedCards([]); if (newScore >= currentBoss.scoreToBeat) goToShop(); else if (newHandsRemaining <= 0) setGameState(GAME_STATES.GAME_OVER); else setGameState(GAME_STATES.PLAYING); };
  const handleDiscardHand = () => { if (discardsRemaining <= 0 || selectedCards.length === 0 || gameState !== GAME_STATES.PLAYING) return; setDiscardsRemaining((prev) => prev - 1); const updatedDiscardPile = [...discardPile, ...selectedCards]; setDiscardPile(updatedDiscardPile); const remainingHand = hand.filter((card) => !selectedCards.some((sc) => sc.id === card.id)); const { newCards, updatedDeck, updatedDiscard } = drawCards( MAX_HAND_SIZE - remainingHand.length, deck, updatedDiscardPile ); setHand([...remainingHand, ...newCards]); setDeck(updatedDeck); setDiscardPile(updatedDiscard); setSelectedCards([]); };
  const goToShop = () => { setMoney((prev) => prev + (currentBoss?.reward || 0) + handsRemaining); const available = allJokers.filter((j) => !myJokers.some((mj) => mj.id === j.id)); setShopJokers(shuffleDeck(available).slice(0, 2)); setGameState(GAME_STATES.SHOP); };
  const handleBuyJoker = (joker) => { if (money >= 10 && myJokers.length < 5) { setMoney((prev) => prev - 10); setMyJokers((prev) => [...prev, joker]); setShopJokers((prev) => prev.filter((j) => j.id !== joker.id)); } };
  const startNextRound = () => { const nextRoundNum = roundNum + 1; if (rounds.find((r) => r.round === nextRoundNum)) { setRoundNum(nextRoundNum); setScore(0); setHandsRemaining(4); setDiscardsRemaining(3); const newFullDeck = shuffleDeck(createDeck()); setHand(newFullDeck.slice(0, MAX_HAND_SIZE)); setDeck(newFullDeck.slice(MAX_HAND_SIZE)); setDiscardPile([]); setGameState(GAME_STATES.PLAYING); } else { alert('Congratulations! You have breached all systems!'); startNewGame(); } };
  const handleCardClick = (clickedCard) => { if (gameState !== GAME_STATES.PLAYING) return; const isAlreadySelected = selectedCards.some((card) => card.id === clickedCard.id); if (isAlreadySelected) { setSelectedCards((prev) => prev.filter((card) => card.id !== clickedCard.id)); } else if (selectedCards.length < MAX_SELECT_SIZE) { setSelectedCards((prev) => [...prev, clickedCard]); } };
  const isCardSelected = (card) => selectedCards.some((selected) => selected.id === card.id);

  // --- Render ---
  return (
    <div className="app">
      {gameState === GAME_STATES.ANIMATING && (<ScoreAnimation sequence={animationSequence} onComplete={handleAnimationComplete} />)}
      <div className="game-board">
        {gameState === GAME_STATES.GAME_OVER && (<div className="game-over-screen"><h1>Attack Failed</h1><p>Failed to breach {currentBoss?.name}.</p><button onClick={startNewGame}>Restart</button></div>)}
        {gameState === GAME_STATES.SHOP && (<Shop money={money} onBuyJoker={handleBuyJoker} onProceed={startNextRound} availableJokers={shopJokers} />)}

        {/* 主要游戏界面 */}
        <div className="rules-area">
          <HandRules />
          <Legend />
          
          {/* --- 【关键改动】: Wrap DeckTracker to handle hover events --- */}
          <div 
            onMouseEnter={() => setShowDeckPreview(true)}
            onMouseLeave={() => setShowDeckPreview(false)}
          >
            <DeckTracker deckCount={deck.length} discardCount={discardPile.length} />
            
            {/* Conditionally render the preview */}
            {showDeckPreview && (
              <DeckPreview 
                deck={deck} 
                hand={hand} 
                discardPile={discardPile} 
              />
            )}
          </div>
        </div>

        <div className="main-area">
          <div className="info-area">
            <div className="boss-display">
              <div className="boss-icon" dangerouslySetInnerHTML={{ __html: getBossIconSvg(currentBoss?.icon) }} />
              <div className="boss-info"><h3>Target: {currentBoss?.name}</h3><h4>Required Score: {currentBoss?.scoreToBeat}</h4></div>
            </div>
            <div className="player-stats">
              <h3>Current Score: {score}</h3>
              <h4>Hands Remaining: {handsRemaining}</h4>
              <h4>Discards Remaining: {discardsRemaining}</h4>
              <h4>Money: ${money}</h4>
            </div>
          </div>
          <div className="play-area">
            <ScorePreview handInfo={previewInfo} />
            <div className="action-buttons">
              <button onClick={handlePlayHand} disabled={selectedCards.length === 0}>Play Attack ({handsRemaining})</button>
              <button onClick={handleDiscardHand} disabled={selectedCards.length === 0 || discardsRemaining <= 0}>Discard ({discardsRemaining})</button>
            </div>
          </div>
        </div>

        <div className="bottom-area">
          <div className="joker-inventory">
            <div className="inventory-header">Hacker Skills</div>
            <div className="joker-slots">{myJokers.map((joker) => (<JokerCard key={joker.id} joker={joker} />))}</div>
          </div>
          <div className="hand-display">
            <div className="inventory-header">Attack Tools</div>
            <div className="card-slots">{hand.map((card) => (<Card key={card.id} cardData={card} isSelected={isCardSelected(card)} onClick={handleCardClick} />))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}