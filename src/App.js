import React, { useEffect, useRef, useState } from "react";
import "./css/styles.css";
import RPWimg from "./images/openScreen.png";
import { imageTokens, theCards } from "./imageTokens";
import selectImage from "./images/player-tokens/selectImage.png";
import {
  copyObject,
  getPlayerPositions,
  defaultPlayerSetup,
  checkForTriplicates,
  animateCards,
  animateGold,
  setNewGPandLocation,
} from "./utilities";
import playersGold from "./images/gp.png";
import cardBack from "./images/card-images/_cardBack.png";

function App() {
  // todo : bugfix - new game cards not auto-cycling
  // todo: bugfix - cards not cycling with 5/6 players cards
  const [gameStatus, setGameStatus] = useState("start-screen");
  const [savedEvent, setSavedEvent] = useState("");
  const [modal, setModal] = useState("");
  const [aWinnerIsYou, setAWinnerIsYou] = useState("");
  const [cardPile, setCardPile] = useState(theCards);
  const currentCards = useRef(null);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [currentFirstPlayer, setCurrentFirstPlayer] = useState(0);
  const gameBoardContainer = useRef(null);
  const playerTokens = useRef(null);
  const [tokenContainerStatus, setTokenContainerStatus] = useState({
    isOpen: false,
    openedBy: "",
  });

  const [gameState, setGameState] = useState({
    players: {},
    numOfPlayers: 0,
  });

  const [playerSetup, setPlayerSetup] = useState(defaultPlayerSetup);

  const shuffleCards = (arr) => {
    const copiedCards = copyObject(arr);
    const shuffledDeck = [];
    while (copiedCards.length) {
      const randInt = Math.floor(Math.random() * copiedCards.length);
      const randCard = copiedCards.splice(randInt, 1);
      shuffledDeck.push(...randCard);
    }
    return shuffledDeck;
  };

  /**
   * Pull top card from deck
   */
  const pullFromDeck = async () => {
    // check if more than 2 of same type
    // if current length > than num of players - discard 1
    // if deck is empty, shuffle discard and set to card pile
    const displayCards_copy = copyObject(displayedCards);
    const cardPile_copy = copyObject(cardPile);
    let discardPile_copy = copyObject(discardPile);
    const numOfCards =
      gameState.numOfPlayers === 6 ? 5 : gameState.numOfPlayers;

    // check if deck needs to be reshuffled when pile is empty
    const reshuffle = () => {
      if (cardPile_copy.length === 0) {
        const shuffledDiscardDeck = shuffleCards(discardPile_copy);
        cardPile_copy.push(...shuffledDiscardDeck);
        discardPile_copy = [];
      }
    };

    const takeTopCard = async () => {
      reshuffle();
      // discards if last card
      if (displayCards_copy.length === numOfCards) {
        const lastCard = displayCards_copy.pop();
        discardPile_copy.push(lastCard);
      }

      const topCard = cardPile_copy.pop();
      const isTriplicate = checkForTriplicates(displayCards_copy, topCard);

      if (isTriplicate) {
        discardPile_copy.push(topCard);
        await takeTopCard();
      } else {
        displayCards_copy.unshift(topCard);
        await animateCards(
          currentCards,
          topCard,
          gameState.numOfPlayers,
          cardBack,
        );
      }
    };

    if (displayCards_copy.length < numOfCards) {
      for (let i = displayCards_copy.length; i < numOfCards; i++) {
        await takeTopCard();
      }
    } else {
      await takeTopCard();
    }

    reshuffle();

    setCardPile(cardPile_copy);
    setDiscardPile(discardPile_copy);
    setDisplayedCards(displayCards_copy);
  };

  /**
   *
   */
  useEffect(() => {
    if (gameStatus === "gameOn") {
      const cardContainersInit = {};
      const cardContainerNodes = document.querySelectorAll(".card-container");
      cardContainerNodes.forEach((cardElement) => {
        const idNum = Number(cardElement.id.replace(/^\D+/g, ""));
        if (cardElement.dataset.cardtype === "discard-pile") {
          cardContainersInit.discard = {};
          cardContainersInit.discard.container = cardElement;
        } else {
          cardContainersInit[idNum] = {};
          cardContainersInit[idNum].container = cardElement;
          cardContainersInit[idNum].image = "";
          cardContainersInit[idNum].data = "";
        }
      });

      cardContainersInit.numOfCards = 0;
      currentCards.current = cardContainersInit;
      pullFromDeck();
    }
  }, [gameStatus]);

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
    setTokenContainerStatus({ isOpen: false, openedBy: ""})
    setAWinnerIsYou("")
    setCurrentFirstPlayer(0)
    setCardPile(theCards)
    setDiscardPile([])
    setDisplayedCards([])
    currentCards.current = {};
  };

  /**
   * Check for winner
   */
  const checkForWinner = (copiedGameState) => {
    const highest = { num: 0, players: [] };
    Object.keys(copiedGameState.players).forEach((key) => {
      const player = copiedGameState.players[key];
      if (player.gp >= 25) {
        if (player.gp === highest.num) {
          highest.players.push(player);
        }

        if (player.gp > highest.num) {
          highest.num = player.gp;
          highest.players = [player];
        }
      } else {
        return;
      }
    });

    if (highest.num >= 25 && highest.players.length === 1) {
      setTimeout(() => {
        setAWinnerIsYou(highest.players[0]);
        setGameStatus("someoneWon");
      }, 2000);
      return true
    }
    return false
  };

  /**
   * next round
   */
  const nextRound = async () => {
    const copiedGameState = copyObject(gameState);
    const newCurrentFP =
    currentFirstPlayer + 1 >= gameState.numOfPlayers
    ? 0
    : currentFirstPlayer + 1;
    console.log('Copy Game State: ', copiedGameState)
    console.log('First Player: ', currentFirstPlayer)
    copiedGameState.players[`${currentFirstPlayer}`].firstPlayer = false;
    copiedGameState.players[`${newCurrentFP}`].firstPlayer = true;
    const newGPandLocation = await setNewGPandLocation(copiedGameState, playerTokens);
    const isWinner = checkForWinner(copiedGameState);
    if(!isWinner){
      pullFromDeck()
    }
    setTimeout(() => {
      setGameState(newGPandLocation);
      setCurrentFirstPlayer(newCurrentFP);
    }, 2000);

  };

  /**
   * Initial shuffle of cards
   */
  useEffect(() => {
    setCardPile(shuffleCards(theCards));
  }, []);

  /**
   * Make an Array
   */
  const makeAnArray = (num) => {
    const arr = [];
    for (let i = 0; i < num; i++) {
      arr.push(i);
    }
    return arr;
  };

  /**
   *  Handle Player input
   * @param {*} e
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
   *  Handle row click
   * @param {*} e
   */
  const handleRowClick = (e) => {
    const { left, top } = e.target.getBoundingClientRect();
    const isPlayerHere = e.target.dataset?.occupied;
    const playerNum = savedEvent?.target?.dataset?.occupied;
    const copiedGameState = copyObject(gameState);

    if (!isPlayerHere && savedEvent) {
      e.target.dataset.occupied = playerNum;
      savedEvent.target.dataset.occupied = "";
      savedEvent.target.classList.remove("move-it");
      playerTokens.current[playerNum].style.left = `${left}px`;
      playerTokens.current[playerNum].style.top = `${top}px`;
      copiedGameState.players[playerNum].location = e.target.id;
      setSavedEvent("");
      setGameState(copiedGameState);
    } else if (isPlayerHere) {
      if (savedEvent?.target?.classList) {
        savedEvent.target.classList.remove("move-it");
      }
      setSavedEvent(e);
      e.target.classList.add("move-it");
    }
  };

  /**
   * Start the game
   */
  const startGame = () => {
    const copiedGameState = copyObject(gameState);
    const players = Object.keys(playerSetup).filter(
      (player) => playerSetup[player].name
    );

    // check if engough players
    if (players.length < 3) {
      alert("Not enough players dude");
      return;
    }

    // check if all players have an icon
    for (let i = 0; i < players.length; i++) {
      if (playerSetup[players[i]]?.name && !playerSetup[players[i]]?.icon) {
        alert(
          `${players[i]} is missing a pretty face. I mean, not like in a creepy way where the face is gone and there's just this red gooey mess of a bloody skull left. More like no token was selected.`
        );
        return;
      }
    }
    copiedGameState.numOfPlayers = players.length;
    let count = 0;

    // randomly place players in game state and set first entry to first player
    while (count < 6) {
      if (players.length) {
        const randomPlayerNum = Math.floor(Math.random() * players.length);
        const randomPlayer = players.splice(randomPlayerNum, 1);
        const copiedRandomPlayer = copyObject(playerSetup[randomPlayer]);
        copiedRandomPlayer.location = `5-${count}`;
        copiedRandomPlayer.playerId = count
        if (count === 0) {
          copiedRandomPlayer.firstPlayer = true;
        }
        copiedGameState.players[count] = copiedRandomPlayer;
      }
      count++;
    }
    setGameState(copiedGameState);
    setGameStatus("gameOn");
  };

  /**
   * Handle Moneys
   * @param {*} playerKey
   * @param {*} value
   */
  const handleMoneys = (playerKey, value) => {
    const copiedGameState = copyObject(gameState);
    copiedGameState.players[playerKey].gp = Number(value);
    setGameState(copiedGameState);
  };

  useEffect(() => {
    if (gameStatus === "gameOn") {
      const playerTokensInit = {};
      Object.keys(gameState.players).forEach((key) => {
        const playerIcon = gameState.players[key].icon;
        const imgUrl = imageTokens[playerIcon]?.url || "";
        const playerSquare = document.getElementById(`5-${key}`);
        const { left, top } = playerSquare?.getBoundingClientRect();
        const player = playerSquare.appendChild(document.createElement("img"));
        player.classList.add("player-img");
        player.id = `player-${key}`;
        player.src = imgUrl;
        player.style.left = `${left}px`;
        player.style.top = `${top}px`;
        playerSquare.dataset.occupied = key;
        playerTokensInit[key] = player;
      });
      playerTokens.current = playerTokensInit;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus]);


  const handleModalClick = (e) => {
    const key = e.target.id[15]
    const wat = currentCards.current[key]?.image
setModal(wat.src)
}

  /**
   * Return
   */
  return (
    <div className="main-container">
      {/* /**
       * Background container
       */}
      <div className="background-container">
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
              <button onClick={startGame}>
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
                <button  onClick={resetGame}>
                  New Game?
                </button>
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
                >
                  {/* <img
                    onClick={() => setModal(card.cardImgUrl)}
                    alt="current card pile"
                    src={card.cardImgUrl}
                  /> */}
                </div>
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
                            onClick={handleRowClick}
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
            <img
                      className="gold-pile"
                      id="gold-pile"
                      alt="players gold"
                      src={playersGold}
                    />
              <button
                className="next-round-btn"
                onClick={() => nextRound()}
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
                const { gp, icon, name, firstPlayer, location } =
                  gameState.players[playerKey];
                const iconUrl = imageTokens[icon]?.url || "";

                // setLocation(gameState.players[playerKey], playerKey);

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
