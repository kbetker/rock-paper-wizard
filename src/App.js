import React, { useEffect, useState } from "react";
import "./css/styles.css";
import RPWimg from "./images/openScreen.png";
import { imageTokens, theCards } from "./imageTokens";
import selectImage from "./images/player-tokens/selectImage.png";
import { copyObject } from "./utilities";
import playersGold from "./images/gp.png";
import cardBack from "./images/card-images/_cardBack.png";
// import { theCards } from "./theCards";

// import Player from "./Player";
// load screen - input screen - play screen

// more than 2 of same type - discard
// pass first player clockwise
// players reset right/left - exit/hoard zone (4th from cave or dragon)
// player closest to gold - 5gp  - second 3gp
// 25gp wins game

function App() {
  const [gameStatus, setGameStatus] = useState("start-screen");
  //name this better?
  const [wat, setWat] = useState("");
  const [modal, setModal] = useState("");
  const [cardPile, setCardPile] = useState(theCards);
  const [currentCards, setCurrentCards] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [currentFirstPlayer, setCurrentFirstPlayer] = useState(0);
  const [tokenContainerStatus, setTokenContainerStatus] = useState({
    isOpen: false,
    openedBy: "",
  });

  const [gameState, setGameState] = useState({
    players: {},
    numOfPlayers: 0,
  });

  const [playerSetup, setPlayerSetup] = useState({
    player1: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-0" },
    player2: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-1" },
    player3: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-2" },
    player4: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-3" },
    player5: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-4" },
    player6: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-5" },
  });

  // console.log("%ccurrentCards:", "color: red", currentCards);
  // console.log("%cdiscardPile:", "color: orange", discardPile);
  // console.log("%ccardPile:", "color: yellow", cardPile);
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
  const pullFromDeck = () => {
    // check if more than 2 of same type
    // if current length > than num of players - discard 1
    // if deck is empty, shuffle discard and set to card pile
    const copiedCurrentCards = copyObject(currentCards);
    const copiedCardPile = copyObject(cardPile);
    let copiedDiscardPile = copyObject(discardPile);
    const numOfCards =
      gameState.numOfPlayers === 6 ? 5 : gameState.numOfPlayers;

    const checkForTriplicates = (cards, topCard) => {
      const cardTypes = { red: 0, blue: 0, green: 0 };
      for (let i = 0; i < cards.length; i++) {
        const { cardType } = cards[i];
        cardTypes[cardType]++;
      }
      cardTypes[topCard.cardType]++;
      if (cardTypes[topCard.cardType] >= 3) {
        return true;
      }
      return false;
    };

    const takeTopCard = () => {
      if (copiedCardPile.length === 0) {
        const shuffledDiscardDeck = shuffleCards(copiedDiscardPile);
        copiedCardPile.push(...shuffledDiscardDeck);
        copiedDiscardPile = [];
      }
      if (copiedCurrentCards.length === numOfCards) {
        const lastCard = copiedCurrentCards.pop();
        copiedDiscardPile.push(lastCard);
      }

      const topCard = copiedCardPile.pop();
      const triplicate = checkForTriplicates(copiedCurrentCards, topCard);

      if (triplicate) {
        copiedDiscardPile.push(topCard);
        takeTopCard();
      } else {
        copiedCurrentCards.unshift(topCard);
      }
    };

    if (copiedCurrentCards.length < numOfCards) {
      for (let i = copiedCurrentCards.length; i < gameState.numOfPlayers; i++) {
        takeTopCard();
      }
    } else {
      takeTopCard();
    }

    if (copiedCardPile.length === 0) {
      const shuffledDiscardDeck = shuffleCards(copiedDiscardPile);
      copiedCardPile.push(...shuffledDiscardDeck);
      copiedDiscardPile = [];
    }

    setCardPile(copiedCardPile);
    setDiscardPile(copiedDiscardPile);
    setCurrentCards(copiedCurrentCards);
  };

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
   *
   */
  const nextRound = () => {
    pullFromDeck();
    //todo change players turn
    const copiedGameState = copyObject(gameState);
    const newCurrentFP =
      currentFirstPlayer + 1 >= gameState.numOfPlayers
        ? 0
        : currentFirstPlayer + 1;
    copiedGameState.players[`${currentFirstPlayer}`].firstPlayer = false;
    copiedGameState.players[`${newCurrentFP}`].firstPlayer = true;
    setGameState(copiedGameState);
    setCurrentFirstPlayer(newCurrentFP);
  };
  console.log("%cgameState:", "color: red", gameState);
  /**
   *
   */
  useEffect(() => {
    if (gameStatus === "gameOn") {
      pullFromDeck();
    }
  }, [gameStatus]);

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
    const copiedGameState = copyObject(gameState);
    if (!e.target.dataset.occupied && wat) {
      const playerNum = wat.target.dataset.occupied;
      wat.target.style.backgroundImage = "";
      wat.target.dataset.occupied = "";
      wat.target.classList.remove("move-it");
      setWat("");
      copiedGameState.players[playerNum].location = e.target.id;
      setGameState(copiedGameState);
    } else if (e.target.dataset.occupied) {
      if (wat?.target?.classList) {
        wat.target.classList.remove("move-it");
      }
      setWat(e);
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
        alert(`${players[i]} is missing a pretty face`);
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
        let copiedRandomPlayer = copyObject(playerSetup[randomPlayer]);
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
    copiedGameState.players[playerKey].gp = value;
    setGameState(copiedGameState);
  };

  const setLocation = (player, playerNum) => {
    const copiedPlayer = copyObject(player);
    const { location, icon } = copiedPlayer;

    setTimeout(() => {
      const marker = document.getElementById(location);
      const backgroundImg = imageTokens[icon].url;
      marker.style.backgroundImage = `url(${backgroundImg})`;
      marker.dataset.occupied = playerNum;
    }, 10);
  };

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
            className="start-button medievalsharp-regular"
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
              <button onClick={startGame}>Start game</button>* if name is blank,
              it will be ignored
            </div>
            <div className="token-selection">
              {tokenContainerStatus.isOpen &&
                Object.keys(imageTokens).map((token, index) => {
                  const { url, name } = imageTokens[token];
                  const iconSelected = Object.keys(playerSetup).filter(
                    (wat) => playerSetup[wat]?.icon === name
                  );

                  if (iconSelected.length === 0) {
                    return (
                      <img
                        alt={`token ${name}`}
                        src={url}
                        key={`token-img-${index}`}
                        className="token-img"
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
            {cardPile.length > 0 ? (
              <div className="card-container cardpile">
                <img
                  onClick={() => wildMagic()}
                  alt="card pile"
                  src={cardBack}
                />
              </div>
            ) : (
              <div className="card-container empty-card-pile"></div>
            )}
            {currentCards.map((card, index) => {
              return (
                <div className="card-container">
                  <img
                    onClick={() => setModal(card.cardImgUrl)}
                    alt="card pile"
                    src={card.cardImgUrl}
                  />
                </div>
              );
            })}
            {discardPile.length > 0 && (
              <div className="card-container discardpile">
                <img alt="discard pile" src={cardBack} />
              </div>
            )}
          </div>
          {/* 
              GameBoard
            */}
          <div className="gameboard-region">
            <div className="game-board-container">
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
            <div className="gold-pile-container">
              <button className="next-round-btn" onClick={() => nextRound()}>
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
                const iconUrl = imageTokens[icon].url;

                setLocation(gameState.players[playerKey], playerKey);

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
                      className="players-gold"
                      alt="players gold"
                      src={playersGold}
                    />
                    X
                    <input
                      type="number"
                      value={gameState.players[playerKey].gp}
                      onChange={() => handleMoneys(playerKey)}
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
