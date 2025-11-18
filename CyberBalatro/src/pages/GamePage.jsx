// src/Pages/GamePage.jsx

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
import DeckPreview from '../components/DeckPreview.jsx';
import TutorialGuide from '../components/TutorialGuide.jsx';

// Data & Logic
import createDeck, { shuffleDeck, RANK_THEME } from '../data/deck.js';
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
  const [showDeckPreview, setShowDeckPreview] = useState(false);
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [discoveredRanks, setDiscoveredRanks] = useState([]);

  const TUTORIAL_STEPS = {
    1: { targetClass: 'boss-display' }, 2: { targetClass: 'boss-display' },
    3: { targetClass: 'rules-area' }, 4: { targetClass: 'hand-display' },
    5: { targetClass: 'hand-display' }, 6: { targetClass: 'action-buttons' },
    7: { targetClass: 'player-stats' }, 8: { targetClass: 'joker-inventory' },
    9: { targetClass: '' },
  };

  const currentBoss = rounds.find((r) => r.round === roundNum)?.boss;

  useEffect(() => {
    const hasCompletedTutorial = localStorage.getItem('cybersecurityJokerTutorialCompleted');
    if (hasCompletedTutorial) {
      startNewGame(false);
    } else {
      startNewGame(true);
      setIsTutorialActive(true);
      setTutorialStep(1);
    }
  }, []);

  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING && selectedCards.length > 0) {
      const handType = evaluateHand(selectedCards);
      const result = calculateScore(selectedCards, handType, myJokers, currentBoss);
      setPreviewInfo({ ...result, handName: handType.name, themeName: handType.themeName });
    } else {
      setPreviewInfo(null);
    }
  }, [selectedCards, myJokers, gameState, currentBoss]);

  const handleNextTutorialStep = () => setTutorialStep(prev => prev + 1);

  const handleEndTutorial = () => {
    setIsTutorialActive(false);
    setTutorialStep(0);
    localStorage.setItem('cybersecurityJokerTutorialCompleted', 'true');
    startNewGame(false);
  };

  const drawCards = (numToDraw, currentDeck, currentDiscard) => {
    let newCards = [], deck = [...currentDeck], discard = [...currentDiscard];
    for (let i = 0; i < numToDraw; i++) {
      if (deck.length === 0) {
        if (discard.length === 0) break;
        deck = shuffleDeck(discard);
        discard = [];
      }
      newCards.push(deck.pop());
    }
    return { newCards, updatedDeck: deck, updatedDiscard: discard };
  };

  const startNewGame = (isTutorial = false) => {
    const fullDeck = createDeck();
    let initialHand, initialDeck;
    if (isTutorial) {
      let deckForTutorial = [...fullDeck];
      initialHand = [];
      const ranksToFind = ['7', 'K', 'A', '5', '7', 'K', '2', 'J'];
      ranksToFind.slice(0, MAX_HAND_SIZE).forEach(rankToFind => {
        const cardIndex = deckForTutorial.findIndex(card => card.rank === rankToFind);
        if (cardIndex !== -1) {
          initialHand.push(deckForTutorial[cardIndex]);
          deckForTutorial.splice(cardIndex, 1);
        }
      });
      initialDeck = shuffleDeck(deckForTutorial);
    } else {
      const shuffled = shuffleDeck(fullDeck);
      initialHand = shuffled.slice(0, MAX_HAND_SIZE);
      initialDeck = shuffled.slice(MAX_HAND_SIZE);
    }
    setHand(initialHand);
    setDeck(initialDeck);
    setDiscardPile([]);
    setSelectedCards([]);
    setMyJokers([]);
    setMoney(10);
    setScore(0);
    setHandsRemaining(4);
    setDiscardsRemaining(3);
    setRoundNum(1);
    setDiscoveredRanks([]); // Reset discovered ranks for a new game
    setGameState(GAME_STATES.PLAYING);
  };

  const handlePlayHand = () => {
    if (isTutorialActive && tutorialStep === 6) setTutorialStep(7);
    if (selectedCards.length === 0 || gameState !== GAME_STATES.PLAYING) return;

    const playedRanks = new Set(selectedCards.map(card => card.rank));
    const newlyDiscovered = [];
    (currentBoss?.weaknesses || []).forEach(rank => {
      if (playedRanks.has(rank) && !discoveredRanks.includes(rank)) newlyDiscovered.push(rank);
    });
    (currentBoss?.resistances || []).forEach(rank => {
      if (playedRanks.has(rank) && !discoveredRanks.includes(rank)) newlyDiscovered.push(rank);
    });
    if (newlyDiscovered.length > 0) {
      setDiscoveredRanks(prev => [...prev, ...newlyDiscovered]);
    }

    const handType = evaluateHand(selectedCards);
    const { finalResult, sequence } = calculateScoreWithSequence(selectedCards, handType, myJokers, currentBoss);
    setAnimationSequence(sequence);
    setFinalAnimatedResult(finalResult);
    setGameState(GAME_STATES.ANIMATING);
  };

  const handleAnimationComplete = () => {
    if (isTutorialActive && tutorialStep === 7) setTutorialStep(8);
    const newScore = score + finalAnimatedResult.score;
    const newHandsRemaining = handsRemaining - 1;
    setScore(newScore);
    setHandsRemaining(newHandsRemaining);
    const updatedDiscardPile = [...discardPile, ...selectedCards];
    setDiscardPile(updatedDiscardPile);
    const remainingHand = hand.filter((card) => !selectedCards.some((sc) => sc.id === card.id));
    const { newCards, updatedDeck, updatedDiscard } = drawCards(MAX_HAND_SIZE - remainingHand.length, deck, updatedDiscardPile);
    setHand([...remainingHand, ...newCards]);
    setDeck(updatedDeck);
    setDiscardPile(updatedDiscard);
    setSelectedCards([]);
    if (newScore >= currentBoss.scoreToBeat) {
      goToShop();
    } else if (newHandsRemaining <= 0) {
      setGameState(GAME_STATES.GAME_OVER);
    } else {
      setGameState(GAME_STATES.PLAYING);
    }
  };

  const handleDiscardHand = () => {
    if (discardsRemaining <= 0 || selectedCards.length === 0 || gameState !== GAME_STATES.PLAYING) return;
    setDiscardsRemaining((prev) => prev - 1);
    const updatedDiscardPile = [...discardPile, ...selectedCards];
    setDiscardPile(updatedDiscardPile);
    const remainingHand = hand.filter((card) => !selectedCards.some((sc) => sc.id === card.id));
    const { newCards, updatedDeck, updatedDiscard } = drawCards(MAX_HAND_SIZE - remainingHand.length, deck, updatedDiscardPile);
    setHand([...remainingHand, ...newCards]);
    setDeck(updatedDeck);
    setDiscardPile(updatedDiscard);
    setSelectedCards([]);
  };

  const goToShop = () => {
    setMoney((prev) => prev + (currentBoss?.reward || 0) + handsRemaining);
    const available = allJokers.filter((j) => !myJokers.some((mj) => mj.id === j.id));
    setShopJokers(shuffleDeck(available).slice(0, 2));
    setGameState(GAME_STATES.SHOP);
  };

  const handleBuyJoker = (joker) => {
    if (money >= 10 && myJokers.length < 5) {
      setMoney((prev) => prev - 10);
      setMyJokers((prev) => [...prev, joker]);
      setShopJokers((prev) => prev.filter((j) => j.id !== joker.id));
    }
  };

  const startNextRound = () => {
    const nextRoundNum = roundNum + 1;
    if (rounds.find((r) => r.round === nextRoundNum)) {
      setRoundNum(nextRoundNum);
      setScore(0);
      setHandsRemaining(4);
      setDiscardsRemaining(3);
      setSelectedCards([]);
      setDiscoveredRanks([]); // Reset discovered ranks for the new boss
      const newFullDeck = shuffleDeck(createDeck());
      setHand(newFullDeck.slice(0, MAX_HAND_SIZE));
      setDeck(newFullDeck.slice(MAX_HAND_SIZE));
      setDiscardPile([]);
      setGameState(GAME_STATES.PLAYING);
    } else {
      alert('Congratulations! You have breached all systems!');
      startNewGame(false);
    }
  };

  const handleCardClick = (clickedCard) => {
    if (isTutorialActive && tutorialStep !== 5) return;
    if (gameState !== GAME_STATES.PLAYING) return;
    const isAlreadySelected = selectedCards.some((card) => card.id === clickedCard.id);
    let updatedSelectedCards;
    if (isAlreadySelected) {
      updatedSelectedCards = selectedCards.filter((card) => card.id !== clickedCard.id);
    } else if (selectedCards.length < MAX_SELECT_SIZE) {
      updatedSelectedCards = [...selectedCards, clickedCard];
    } else { return; }
    setSelectedCards(updatedSelectedCards);
    if (isTutorialActive && tutorialStep === 5) {
      if (updatedSelectedCards.length === 4) {
        const handType = evaluateHand(updatedSelectedCards);
        if (handType.name === 'Two Pair') setTutorialStep(6);
      }
    }
  };

  const isCardSelected = (card) => selectedCards.some((selected) => selected.id === card.id);

  return (
    <div className="app">
      {isTutorialActive && <TutorialGuide step={tutorialStep} onNextStep={handleNextTutorialStep} onEndTutorial={handleEndTutorial} targetClass={TUTORIAL_STEPS[tutorialStep]?.targetClass || ''} />}
      {gameState === GAME_STATES.ANIMATING && <ScoreAnimation sequence={animationSequence} onComplete={handleAnimationComplete} />}
      <div className="game-board">
        {gameState === GAME_STATES.GAME_OVER && (
          <div className="game-over-screen">
            <h1>Attack Failed</h1>
            <p>Failed to breach {currentBoss?.name}.</p>
            <button onClick={() => startNewGame(false)}>Restart</button>
          </div>
        )}
        {gameState === GAME_STATES.SHOP && <Shop money={money} onBuyJoker={handleBuyJoker} onProceed={startNextRound} availableJokers={shopJokers} />}
        <div className="rules-area">
          <HandRules />
          <Legend />
          <div onMouseEnter={() => setShowDeckPreview(true)} onMouseLeave={() => setShowDeckPreview(false)}>
            <DeckTracker deckCount={deck.length} discardCount={discardPile.length} />
            {showDeckPreview && <DeckPreview deck={deck} hand={hand} discardPile={discardPile} />}
          </div>
        </div>
        <div className="main-area">
          <div className="info-area">
            <div className="boss-display">
              <div className="boss-icon" dangerouslySetInnerHTML={{ __html: getBossIconSvg(currentBoss?.icon) }} />
              <div className="boss-info">
                <h3>Target: {currentBoss?.name}</h3>
                <h4>Required Score: {currentBoss?.scoreToBeat}</h4>
                <div className="boss-details-container">
                  <div className="boss-affinities">
                    {currentBoss?.weaknesses?.length > 0 && (
                      <div className="affinity weakness">
                        <strong>Weakness:</strong>
                        <div className="card-ranks-container">
                          {currentBoss.weaknesses.map(rank =>
                            discoveredRanks.includes(rank) ? (
                              <div key={rank} className="affinity-item revealed">
                                <span title={RANK_THEME[rank]?.name} className="card-rank-icon">{rank}</span>
                                <span className="attack-name">{RANK_THEME[rank]?.name}</span>
                              </div>
                            ) : (
                              <div key={rank} className="affinity-item hidden">
                                <span className="card-rank-icon">?</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    {currentBoss?.resistances?.length > 0 && (
                      <div className="affinity resistance">
                        <strong>Resistance:</strong>
                        <div className="card-ranks-container">
                          {currentBoss.resistances.map(rank =>
                            discoveredRanks.includes(rank) ? (
                              <div key={rank} className="affinity-item revealed">
                                <span title={RANK_THEME[rank]?.name} className="card-rank-icon">{rank}</span>
                                <span className="attack-name">{RANK_THEME[rank]?.name}</span>
                              </div>
                            ) : (
                              <div key={rank} className="affinity-item hidden">
                                <span className="card-rank-icon">?</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {currentBoss?.rationale && (
                      <div className="boss-rationale">
                          {currentBoss.rationale}
                      </div>
                  )}
                </div>
              </div>
            </div>
            <div className="player-stats">
              <h3>Current Score: {score}</h3>
              <h4>Hands Remaining: {handsRemaining}</h4>
              <h4>Discards Remaining: {discardsRemaining}</h4>
              <h4>Money: ${money}</h4>
            </div>
          </div>
          <div className="play-area">
            <div className="action-buttons">
              <button onClick={handlePlayHand} disabled={selectedCards.length === 0 || (isTutorialActive && tutorialStep !== 6)}>Play Attack ({handsRemaining})</button>
              <button onClick={handleDiscardHand} disabled={selectedCards.length === 0 || discardsRemaining <= 0 || isTutorialActive}>Discard ({discardsRemaining})</button>
            </div>
            <ScorePreview handInfo={previewInfo} />
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