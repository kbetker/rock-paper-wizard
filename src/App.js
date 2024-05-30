import React, { useEffect, useRef, useState } from "react";
import "./css/styles.css";
import RPWimg from "./images/openScreen.png";
import { imageTokens, theCards } from "./imageTokens";
import selectImage from "./images/player-tokens/selectImage.png";
import playersGold from "./images/gp.png";
import cardBack from "./images/card-images/_cardBack.png";
import {
  copyObject,
  defaultPlayerSetup,
  initializeCardContainer,
  initializePlayerTokens,
  shuffleCards,
  makeParticles,
  makeAnArray,
  startGame,
  pullFromDeck,
  nextRound,
  handleRowClick,
} from "./littleBlackBox";

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
  const [tokenContainerStatus, setTokenContainerStatus] = useState({
    isOpen: false,
    openedBy: "",
  });
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
    setTokenContainerStatus({ isOpen: false, openedBy: "" });
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
  const handleNextRound = (e) => {
    setDisable(true);
    e.target.classList.add("disabled");
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
      e
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
      {/**
       * Particl wrapper
       */}
      <div className="particle-wrapper">
        <div className="particle-and-foreground-container">
          <div className="particles-container">
            {particles.map((el) => {
              return el;
            })}
          </div>
        </div>
      </div>

      {/* /**
       * Background container
       */}
      <div className="background-container" ref={backgroundContainer}>
        <div className="blue-gradient"></div>
        <div className="orange-gradient"></div>
      </div>

      {/* /**
       * Start screen
       */}
      {gameStatus === "start-screen" && (
        <div className="start-screen">
          <img alt="Rock Paper Wizard Logo" src={RPWimg} draggable="false" />
          <button
            onClick={() => setGameStatus("setup")}
            className="start-button"
          >
            Start new game
          </button>
        </div>
      )}

      {/* /**
       * setup
       */}
      {gameStatus === "setup" && (
        <div className="setup-container">
          <div className="form-container">
            <div className="form-fields">
              {makeAnArray(6).map((num) => {
                const tokenIcon = playerSetup[`player${num + 1}`].icon;
                const tokenImg = imageTokens[tokenIcon]?.url;

                return (
                  <div key={`form-field-${num}`} className="form-field">
                    <label htmlFor="player-1">Player {num + 1}</label>
                    <input
                      onChange={(e) =>
                        handlePlayerInput(`player${num + 1}`, {
                          name: e.target.value,
                        })
                      }
                    ></input>
                    <img
                      id={`player-${num + 1}`}
                      alt="selected-token-img"
                      className="selected-token"
                      src={tokenImg ? tokenImg : selectImage}
                      draggable="false"
                      onClick={() => [
                        handlePlayerInput(`player${num + 1}`, { icon: null }),
                        setTokenContainerStatus({
                          isOpen: true,
                          openedBy: `player${num + 1}`,
                        }),
                      ]}
                    />
                  </div>
                );
              })}
              <button
                onClick={() =>
                  startGame(gameState, playerSetup, setGameState, setGameStatus)
                }
              >
                Start game
              </button>
              * if name is blank, it will be ignored
            </div>
            <div className="token-selection">
              {tokenContainerStatus.isOpen &&
                Object.keys(imageTokens).map((token, index) => {
                  const { url, name } = imageTokens[token];
                  const iconSelected = Object.keys(playerSetup).filter(
                    (playerId) => playerSetup[playerId]?.icon === name
                  );

                  if (iconSelected.length === 0) {
                    return (
                      <img
                        alt={`token ${name}`}
                        src={url}
                        key={`token-img-${index}`}
                        className="token-img"
                        draggable="false"
                        onClick={() => [
                          handlePlayerInput(tokenContainerStatus.openedBy, {
                            icon: name,
                          }),
                          setTokenContainerStatus({
                            isOpen: false,
                            openedBy: "",
                          }),
                        ]}
                      />
                    );
                  }
                  return null;
                })}
            </div>
          </div>
        </div>
      )}

      {gameStatus === "someoneWon" && (
        <div className="card-modal">
          {aWinnerIsYou && (
            <div className="endgame-container">
              <div className="winner-container">
                <img
                  alt="winner"
                  className="winner-icon"
                  src={imageTokens[aWinnerIsYou.icon].url}
                />
                <div>{aWinnerIsYou.name} is the winner!</div>
              </div>
              <div className="endgame-button-container">
                <button onClick={resetGame}>New Game?</button>
              </div>
            </div>
          )}
        </div>
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
