import React, { useEffect, useRef, useState } from "react";
import "./css/styles.css";
import { imageTokens, theCards } from "./imageTokens";
import playersGold from "./images/gp.png";
import cardBack from "./images/card-images/_cardBack.png";
import Particles from "./components/particle-generator";
import {
  copyObject,
  defaultPlayerSetup,
  initializeCardContainer,
  initializePlayerTokens,
  shuffleCards,
  makeParticles,
  makeAnArray,
  pullFromDeck,
  nextRound,
  handleRowClick,
} from "./littleBlackBox";
import BackgroundContainer from "./components/background-container";
import StartScreen from "./components/start-screen";
import GameSetup from "./components/game-setup";
import WinnerScreen from "./components/winner-screen";

function App() {
  const [gameStatus, setGameStatus] = useState("start-screen");
  const [savedEvent, setSavedEvent] = useState("");
  const [particles, setParticles] = useState([]);
  const [modal, setModal] = useState("");
  const [aWinnerIsYou, setAWinnerIsYou] = useState("");
  const [cardPile, setCardPile] = useState(theCards);
  const currentCards = useRef(null);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [currentFirstPlayer, setCurrentFirstPlayer] = useState(0);
  const gameBoardContainer = useRef(null);
  const playerTokens = useRef(null);
  const backgroundContainer = useRef(null);
  const [disable, setDisable] = useState(false);
  const [gameState, setGameState] = useState({
    players: {},
    numOfPlayers: 0,
  });
  const [playerSetup, setPlayerSetup] = useState(defaultPlayerSetup);

  /**
   * Wild Magc
   */
  const wildMagic = () => {
    const copiedCardPile = copyObject(cardPile);
    let copiedDiscardPile = copyObject(discardPile);
    const topCard = copiedCardPile.pop();
    if (copiedCardPile.length === 0) {
      copiedCardPile.push(...copiedDiscardPile);
      copiedDiscardPile = [];
    }
    copiedDiscardPile.push(topCard);
    setModal(topCard.cardImgUrl);
    setCardPile(copiedCardPile);
    setDiscardPile(copiedDiscardPile);
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
    const copiedGameState = copyObject(playerSetup);
    if (data.name || data.name === null) {
      copiedGameState[player].name = data.name;
    }
    if (data.icon || data.icon === null) {
      copiedGameState[player].icon = data.icon;
    }
    if (data.gp || data.gp === null) {
      copiedGameState[player].gp = data.gp;
    }
    setPlayerSetup(copiedGameState);
  };

  /**
   * Handle Moneys
   */
  const handleMoneys = (playerKey, value) => {
    const copiedGameState = copyObject(gameState);
    copiedGameState.players[playerKey].gp = Number(value);
    setGameState(copiedGameState);
  };

  /**
   *  Initial
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

      {gameStatus === "start-screen" && (
        <StartScreen setGameStatus={setGameStatus} />
      )}

      {gameStatus === "setup" && (
        <GameSetup
          playerSetup={playerSetup}
          handlePlayerInput={handlePlayerInput}
          gameState={gameState}
          setGameState={setGameState}
          setGameStatus={setGameStatus}
        />
      )}

      {gameStatus === "someoneWon" && (
        <WinnerScreen aWinnerIsYou={aWinnerIsYou} resetGame={resetGame} />
      )}

      {/* /**
       * regions
       */}
      {gameStatus === "gameOn" && (
        <div className="game-layout-container">
          {modal && (
            <div className="card-modal" onClick={() => setModal("")}>
              <img alt="modal" src={modal} />
            </div>
          )}
          {/*
           * Cards region
           */}
          <div className="cards-region">
            <div
              className="card-container cardpile"
              id="card-container-0"
              data-cardtype="card-pile"
            >
              <img
                onClick={() => wildMagic()}
                alt="card pile"
                src={cardBack}
                id="draw-pile-img"
              />

              <img alt="card pile" src={cardBack} id="draw-pile-img-backer" />
            </div>

            {makeAnArray(
              gameState.numOfPlayers === 6 ? 5 : gameState.numOfPlayers
            ).map((card, index) => {
              return (
                <div
                  className="card-container"
                  key={`card-slot-${index}`}
                  id={`card-container-${index + 1}`}
                  data-cardtype="visible-card"
                  onClick={handleModalClick}
                ></div>
              );
            })}

            <div
              className="card-container"
              id={`card-container-${gameState.numOfPlayers + 1}`}
              data-cardtype="discard-pile"
            >
              <img alt="discard pile" src={cardBack} id="discard-pile-img" />
              <img
                alt="discard pile backer"
                src={cardBack}
                id="discard-pile-img-backer"
              />
            </div>
          </div>
          {/*
              GameBoard
            */}
          <div className="gameboard-region">
            <div className="game-board-container" ref={gameBoardContainer}>
              {makeAnArray(11).map((columnNum) => {
                const gameBoardColumnId = `game-board-column-${columnNum}`;
                return (
                  <div
                    className="game-board-column"
                    key={gameBoardColumnId}
                    id={gameBoardColumnId}
                  >
                    {makeAnArray(6).map((rowNum) => {
                      const gameBoardRowId = `game-board-row-${rowNum}`;
                      return (
                        <div
                          className="game-board-row"
                          key={gameBoardRowId}
                          id={gameBoardRowId}
                        >
                          <div
                            onClick={(e) =>
                              handleRowClick(
                                e,
                                savedEvent,
                                gameState,
                                playerTokens,
                                setSavedEvent,
                                setGameState
                              )
                            }
                            className="game-board-row-marker"
                            id={`${columnNum}-${rowNum}`}
                            data-occupied={""}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {/*
                Gold pile and new round button
            */}
            <div className="gold-pile-container" id="gold-pile-container">
              <div className="gold-pile-wrapper">
                <img
                  className="gold-pile"
                  id="gold-pile"
                  alt="players gold"
                  src={playersGold}
                />
              </div>
              <button
                className="next-round-btn"
                onClick={(e) => handleNextRound(e)}
                disabled={disable}
              >
                Next round
              </button>
            </div>
          </div>

          {/*
              Players
          */}
          <div className="players-region">
            {Object.keys(gameState.players).map((playerKey, i) => {
              if (playerKey) {
                const { icon, name, firstPlayer } =
                  gameState.players[playerKey];
                const iconUrl = imageTokens[icon]?.url || "";

                return (
                  <div
                    key={`playercontainer-${i}`}
                    className={`player-container`}
                  >
                    <div className="bottom-image-and-name">
                      <img
                        alt={`bottom player ${name}`}
                        className={`bottom-player-token ${
                          firstPlayer ? " first-player" : ""
                        }`}
                        src={iconUrl}
                      />
                      {name}
                    </div>
                    <img
                      className={`players-gold`}
                      alt="players gold"
                      src={playersGold}
                      data-player-name={name}
                      id={`player-${playerKey}-gp`}
                    />
                    X
                    <input
                      type="number"
                      value={gameState.players[playerKey].gp}
                      onChange={(e) => handleMoneys(playerKey, e.target.value)}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
