import React, { useEffect, useRef, useState } from "react";
import "./css/styles.css";
import { imageTokens, theCards } from "./imageTokens";
import cardBack from "./images/card-images/_cardBack.png";
import Particles from "./components/particle-generator";
import {
  copyObject,
  defaultPlayerSetup,
  initializeCardContainer,
  initializePlayerTokens,
  shuffleCards,
  makeParticles,
  pullFromDeck,
  nextRound,
} from "./littleBlackBox";
// components
import BackgroundContainer from "./components/background-container";
import StartScreen from "./components/start-screen";
import GameSetup from "./components/game-setup";
import WinnerScreen from "./components/winner-screen";
import CardModal from "./components/modal";
import TheCards from "./components/the-cards";
import GameBoard from "./components/game-board";
import GoldPile from "./components/gold-pile";
import PlayerRegion from "./components/player-region";

function App() {
  const [gameStatus, setGameStatus] = useState("start-screen");
  const [savedEvent, setSavedEvent] = useState("");
  const [particles, setParticles] = useState([]);
  const [modal, setModal] = useState("");
  const [aWinnerIsYou, setAWinnerIsYou] = useState("");
  const [cardPile, setCardPile] = useState(theCards);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [currentFirstPlayer, setCurrentFirstPlayer] = useState(0);
  const [disable, setDisable] = useState(false);
  const [gameState, setGameState] = useState({ players: {}, numOfPlayers: 0 });
  const [playerSetup, setPlayerSetup] = useState(defaultPlayerSetup);
  const currentCards = useRef(null);
  const playerTokens = useRef(null);
  const backgroundContainer = useRef(null);

  /**
   * Wild Magc
   */
  const wildMagic = () => {
    const cardPileCopy = copyObject(cardPile);
    let discardPileCopy = copyObject(discardPile);
    const topCard = cardPileCopy.pop();
    if (cardPileCopy.length === 0) {
      cardPileCopy.push(...discardPileCopy);
      discardPileCopy = [];
    }
    discardPileCopy.push(topCard);
    setModal(topCard.cardImgUrl);
    setCardPile(cardPileCopy);
    setDiscardPile(discardPileCopy);
  };

  /**
   * Reset game
   */
  const resetGame = () => {
    setPlayerSetup(defaultPlayerSetup);
    setGameStatus("start-screen");
    setGameState({ players: {}, numOfPlayers: 0 });
    setAWinnerIsYou("");
    setCurrentFirstPlayer(0);
    setCardPile(theCards);
    setDiscardPile([]);
    setDisplayedCards([]);
    currentCards.current = {};
  };

  /**
   * Handles next round button click
   */
  const handleNextRound = (button) => {
    setDisable(true);
    button.target.classList.add("disabled");
    nextRound(
      gameState,
      setAWinnerIsYou,
      setGameStatus,
      currentFirstPlayer,
      playerTokens,
      displayedCards,
      cardPile,
      discardPile,
      currentCards,
      cardBack,
      setCardPile,
      setDiscardPile,
      setDisplayedCards,
      setGameState,
      setCurrentFirstPlayer,
      setDisable,
      button
    );
  };

  /**
   * Initial shuffle of cards and creation of particles
   */
  useEffect(() => {
    setCardPile(shuffleCards(theCards));
    makeParticles(setParticles);
  }, []);

  /**
   *  Handle Player's name input
   */
  const handlePlayerInput = (player, data) => {
    const playerSetupCopy = copyObject(playerSetup);
    if (data.name || data.name === null) {
      playerSetupCopy[player].name = data.name;
    }
    if (data.icon || data.icon === null) {
      playerSetupCopy[player].icon = data.icon;
    }
    if (data.gp || data.gp === null) {
      playerSetupCopy[player].gp = data.gp;
    }
    setPlayerSetup(playerSetupCopy);
  };

  /**
   * Handle Moneys
   */
  const handleMoneys = (playerKey, value) => {
    const gameStateCopy = copyObject(gameState);
    gameStateCopy.players[playerKey].gp = Number(value);
    setGameState(gameStateCopy);
  };

  /**
   *  Initialize stuffs
   */
  useEffect(() => {
    if (gameStatus === "gameOn") {
      initializePlayerTokens(gameState, imageTokens, playerTokens);
      initializeCardContainer(currentCards);
      pullFromDeck(
        displayedCards,
        cardPile,
        discardPile,
        gameState,
        currentCards,
        cardBack,
        setCardPile,
        setDiscardPile,
        setDisplayedCards
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus]);

  /**
   * Sets card selection to modal
   */
  const handleModalClick = (e) => {
    const key = e.target.id[15];
    const cardImg = currentCards.current[key]?.image;
    setModal(cardImg.src);
  };

  /**
   * Return
   */
  return (
    <div className="main-container">
      <Particles particles={particles} />

      <BackgroundContainer backgroundContainer={backgroundContainer} />

      <StartScreen setGameStatus={setGameStatus} gameStatus={gameStatus} />

      <GameSetup
        playerSetup={playerSetup}
        handlePlayerInput={handlePlayerInput}
        gameState={gameState}
        gameStatus={gameStatus}
        setGameState={setGameState}
        setGameStatus={setGameStatus}
      />
      <WinnerScreen
        aWinnerIsYou={aWinnerIsYou}
        resetGame={resetGame}
        gameStatus={gameStatus}
      />

      {gameStatus === "gameOn" && (
        <div className="game-layout-container">
          <CardModal modal={modal} setModal={setModal} />

          <TheCards
            wildMagic={wildMagic}
            gameState={gameState}
            handleModalClick={handleModalClick}
          />

          <div className="gameboard-region">
            <GameBoard
              savedEvent={savedEvent}
              gameState={gameState}
              playerTokens={playerTokens}
              setSavedEvent={setSavedEvent}
              setGameState={setGameState}
            />

            <GoldPile handleNextRound={handleNextRound} disable={disable} />
          </div>

          <PlayerRegion gameState={gameState} handleMoneys={handleMoneys} />
        </div>
      )}
    </div>
  );
}

export default App;
