import React, { useEffect, useRef, useState } from "react";
import "./css/styles.css";
import RPWimg from "./images/openScreen.png";
import { imageTokens, theCards } from "./imageTokens";
import selectImage from "./images/player-tokens/selectImage.png";
import {
  copyObject,
  getPlayerPositions,
  defaultPlayerSetup,
  waitAMoment,
} from "./utilities";
import playersGold from "./images/gp.png";
import cardBack from "./images/card-images/_cardBack.png";

function App() {
  const [gameStatus, setGameStatus] = useState("start-screen");
  const [savedEvent, setSavedEvent] = useState("");
  const [modal, setModal] = useState("");
  const [aWinnerIsYou, setAWinnerIsYou] = useState("");
  const [cardPile, setCardPile] = useState(theCards);
  const [currentCards, setCurrentCards] = useState(null);
  const [discardPile, setDiscardPile] = useState([]);
  const [currentFirstPlayer, setCurrentFirstPlayer] = useState(0);
  const gameBoardContainer = useRef(null);
  const playerTokens = useRef(null);
  // const cardContainers = useRef(null);
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

  const animateTopCard = () => {
    // create at 0
  };

  /**
   * Check for triplicate cards
   */
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

  /**
   * Pull top card from deck
   */
  const pullFromDeck = async (cardContainersInit) => {
    // check if more than 2 of same type
    // if current length > than num of players - discard 1
    // if deck is empty, shuffle discard and set to card pile
    const visibleCards = currentCards ? currentCards : cardContainersInit;
    const copiedCardPile = copyObject(cardPile);
    let copiedDiscardPile = copyObject(discardPile);
    const maxNumOfCards =
      gameState.numOfPlayers === 6 ? 5 : gameState.numOfPlayers;

    const takeTopCard = async () => {
      if (copiedCardPile.length === 0) {
        const shuffledDiscardDeck = shuffleCards(copiedDiscardPile);
        copiedCardPile.push(...shuffledDiscardDeck);
        copiedDiscardPile = [];
      }

      if (visibleCards.numOfCards === maxNumOfCards) {
        // ANIMATE to  goToDiscardPile()
        // const lastCard = copiedCurrentCards.pop();
        const lastCard = visibleCards[maxNumOfCards].data;
        visibleCards[maxNumOfCards].data = "";
        visibleCards[maxNumOfCards].img = ""; // actually delete node?
        copiedDiscardPile.push(lastCard);
      }

      const topCard = copiedCardPile.pop();
      const triplicate = checkForTriplicates(visibleCards, topCard);

      if (triplicate) {
        copiedDiscardPile.push(topCard);
        takeTopCard();
      } else {
        // animate here
        // do without currentCard array? handle with visibleCards?
        // work in reverse?
        // visibleCards.unshift(topCard);
        // don't forget to add numOfCards

        let count = maxNumOfCards;

        while (count > 0) {
          // console.log("%cvisibleCards:", "color: red", visibleCards);

          // walk backwars check if data
          // no data and data before is empty, keep going back
          // back to zero = create new img

          if (!visibleCards[count].data && count - 1 === 0) {
            // create new card
            console.log("%ctopCard:", "color: cyan", topCard);
            const newCard = document.createElement("img");
            const parentWidth = visibleCards[0].container.offsetWidth;
            const parentHeight = visibleCards[0].container.offsetHeight;
            const marginLeft = (parentWidth - parentWidth * 0.8) / 2;
            const marginTop = (parentHeight - parentHeight * 0.8) / 2;

            newCard.src = topCard.cardImgUrl;
            newCard.classList.add("card");
            newCard.style.width = `${parentWidth * 0.8}px`;
            newCard.style.height = `${parentHeight * 0.8}px`;
            const { left, top } =
              visibleCards[0].container.getBoundingClientRect();
            newCard.style.left = `${left + marginLeft}px`;
            newCard.style.top = `${top + marginTop}px`;
            visibleCards[0].container.appendChild(newCard);
            await waitAMoment(1000);
            const newCoord = visibleCards[1].container.getBoundingClientRect();
            newCard.style.left = `${newCoord.left + marginLeft}px`;
          } else if (!visibleCards[count].data && visibleCards[count].data) {
            // shift cards
          }

          count--;
        }
      }
    };

    // repeat until current cards are full
    // if (!copiedCurrentCards[maxNumOfCards]?.data) {
    //   for (let i = copiedCurrentCards.length; i < gameState.numOfPlayers; i++) {
    //     takeTopCard();
    //   }
    // } else {
    takeTopCard();
    // }

    if (copiedCardPile.length === 0) {
      const shuffledDiscardDeck = shuffleCards(copiedDiscardPile);
      copiedCardPile.push(...shuffledDiscardDeck);
      copiedDiscardPile = [];
    }

    setCardPile(copiedCardPile);
    setDiscardPile(copiedDiscardPile);
    // setCurrentCards(copiedCurrentCards);
  };

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
      console.log("%ccardContainersInit:", "color: red", cardContainersInit);
      cardContainersInit.numOfCards = 0;
      setCurrentCards(cardContainersInit);
      pullFromDeck(cardContainersInit);
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
   *
   */
  const setNewGPandLocation = (copiedGameState) => {
    const playerPositions = getPlayerPositions();
    playerPositions.firstPlace.forEach(
      (player) => (copiedGameState.players[player].gp += 5)
    );
    playerPositions.secondPlace.forEach(
      (player) => (copiedGameState.players[player].gp += 3)
    );
    playerPositions.playerPositions.forEach((player) => {
      const newSquare = document.getElementById(player.newLocation);
      const oldSquare = document.getElementById(player.oldLocation);
      const { left, top } = newSquare.getBoundingClientRect();
      oldSquare.dataset.occupied = "";
      newSquare.dataset.occupied = player.playerId;
      playerTokens.current[player.playerId].style.left = `${left}px`;
      playerTokens.current[player.playerId].style.top = `${top}px`;
      copiedGameState.players[player.playerId].location = player.newLocation;
    });

    return copiedGameState;
  };

  /**
   * Reset game
   */
  const resetGame = () => {
    setPlayerSetup(defaultPlayerSetup);
    setGameStatus("start-screen");
    setGameState({ players: {}, numOfPlayers: 0 });
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
      setAWinnerIsYou(highest.players[0]);
      setGameStatus("someoneWon");
    }
  };

  /**
   * next round
   */
  const nextRound = () => {
    pullFromDeck();
    const copiedGameState = copyObject(gameState);
    // const oldGameState = copyObject(gameState);
    const newCurrentFP =
      currentFirstPlayer + 1 >= gameState.numOfPlayers
        ? 0
        : currentFirstPlayer + 1;
    copiedGameState.players[`${currentFirstPlayer}`].firstPlayer = false;
    copiedGameState.players[`${newCurrentFP}`].firstPlayer = true;
    const newGPandLocation = setNewGPandLocation(copiedGameState);
    setGameState(newGPandLocation);
    setCurrentFirstPlayer(newCurrentFP);
    // clearOldPositions(oldGameState.players);
    checkForWinner(copiedGameState);
  };

  /**
   *
   */
  // useEffect(() => {
  //   if (gameStatus === "gameOn") {
  //     pullFromDeck();
  //   }
  // }, [gameStatus]);

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
        const imgUrl = imageTokens[playerIcon].url;
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
              <button className="medievalsharp-regular" onClick={startGame}>
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
            <div className="endgame-container medievalsharp-regular">
              <div class="winner-container">
                <img
                  alt="winner"
                  className="winner-icon"
                  src={imageTokens[aWinnerIsYou.icon].url}
                />
                <div>{aWinnerIsYou.name} is the winner!</div>
              </div>
              <div class="endgame-button-container">
                <button className="medievalsharp-regular" onClick={resetGame}>
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
            {cardPile.length > 0 ? (
              <div
                className="card-container cardpile"
                id="card-container-0"
                data-cardtype="card-pile"
              >
                <img
                  onClick={() => wildMagic()}
                  alt="card pile"
                  src={cardBack}
                />
              </div>
            ) : (
              <div className="empty-card-pile"></div>
            )}
            {makeAnArray(
              gameState.numOfPlayers === 6 ? 5 : gameState.numOfPlayers
            ).map((card, index) => {
              return (
                <div
                  className="card-container"
                  key={`card-slot-${index}`}
                  id={`card-container-${index + 1}`}
                  data-cardtype="visible-card"
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
              <img alt="discard pile" src={cardBack} />
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
            <div className="gold-pile-container">
              <button
                className="next-round-btn medievalsharp-regular"
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
                const iconUrl = imageTokens[icon].url;

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
                      className="players-gold"
                      alt="players gold"
                      src={playersGold}
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
