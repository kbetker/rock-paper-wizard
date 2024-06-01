// import goldPileSrc from "./images/gp.png";
import newGpSrc from "./images/newGp.png";

/**
 * Make a deep copy
 */
export const copyObject = (inObject) => {
  let outObject;
  let value;
  let key;

  if (typeof inObject !== "object" || inObject === null) {
    return inObject; // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {};

  for (key in inObject) {
    value = inObject[key];

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = copyObject(value);
  }

  return outObject;
};

/**
 *  Get player positions
 */
export const getPlayerPositions = () => {
  const playerStatus = {
    firstPlace: [],
    secondPlace: [],
    playerPositions: [],
  };

  let firstPlaceClaimed = false;
  let secondPlaceClaimed = false;
  for (let column = 10; column >= 0; column--) {
    for (let row = 5; row >= 0; row--) {
      const square = document.getElementById(`${column}-${row}`);
      const player = square.dataset.occupied;

      // check
      if (firstPlaceClaimed && !secondPlaceClaimed && player) {
        playerStatus.secondPlace.push(player);
      }

      if (player && !firstPlaceClaimed) {
        playerStatus.firstPlace.push(player);
      }

      if (row === 0 && playerStatus.firstPlace.length > 0) {
        firstPlaceClaimed = true;
      }

      if (row === 0 && playerStatus.secondPlace.length > 0) {
        secondPlaceClaimed = true;
      }

      if (player) {
        if (column >= 8) {
          playerStatus.playerPositions.push({
            playerId: player,
            newLocation: `7-${player}`,
            oldLocation: square.id,
          });
        } else if (column <= 2) {
          playerStatus.playerPositions.push({
            playerId: player,
            newLocation: `3-${player}`,
            oldLocation: square.id,
          });
        } else {
          playerStatus.playerPositions.push({
            playerId: player,
            newLocation: `${column}-${player}`,
            oldLocation: square.id,
          });
        }
      }
    }
  }
  return playerStatus;
};

/**
 *  inital player setup
 */
export const defaultPlayerSetup = {
  player1: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-0" },
  player2: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-1" },
  player3: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-2" },
  player4: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-3" },
  player5: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-4" },
  player6: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-5" },
};

/**
 * Delays animation
 */
export const waitAMoment = (time) => {
  return new Promise((res) => {
    setTimeout(() => {
      res("resolved");
    }, time);
  });
};

/**
 *  Checks if there are already two of the same cards on display
 */
export const checkForTriplicates = (cards, topCard) => {
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
 * Animates the cards
 */
export const animateCards = async (currentCards, topCard, numOfPlayers) => {
  const maxNumOfCards = numOfPlayers === 6 ? 5 : numOfPlayers;
  let count = maxNumOfCards;
  const drawPileImg = document.getElementById("draw-pile-img");
  const discardPileImg = document.getElementById("discard-pile-img");

  while (count > 0) {
    // create new card at index 0
    if (!currentCards.current[count].data && count - 1 === 0) {
      const parentWidth = currentCards.current[0].container.offsetWidth;
      const parentHeight = currentCards.current[0].container.offsetHeight;
      const marginLeft = (parentWidth - parentWidth * 0.8) / 2;
      const marginTop = (parentHeight - parentHeight * 0.8) / 2;

      const newCard = document.createElement("img");
      drawPileImg.style.opacity = "1";
      newCard.src = topCard.cardImgUrl;

      newCard.classList.add("card");
      newCard.classList.add("card-rotate-front");

      newCard.style.width = `${parentWidth * 0.8}px`;
      newCard.style.height = `${parentHeight * 0.8}px`;
      const { left, top } =
        currentCards.current[0].container.getBoundingClientRect();

      newCard.style.left = `${left + marginLeft}px`;
      newCard.style.top = `${top + marginTop}px`;

      currentCards.current[0].container.appendChild(newCard);
      currentCards.current[0].data = topCard;
      currentCards.current[0].image = newCard;

      await waitAMoment(10);
      drawPileImg.classList.add("card-rotate-back");
      await waitAMoment(300);
      newCard.classList.remove("card-rotate-front");
      await waitAMoment(10);
      drawPileImg.style.opacity = "0";
      drawPileImg.classList.remove("card-rotate-back");
      await waitAMoment(300);
      drawPileImg.style.opacity = "1";
    }

    /**
     * shift card to the right
     */
    if (
      !currentCards.current[count].data &&
      currentCards.current[count - 1].data
    ) {
      drawPileImg.style.opacity = "1";
      const parentWidth = currentCards.current[count].container.offsetWidth;
      const parentHeight = currentCards.current[count].container.offsetHeight;
      const marginLeft = (parentWidth - parentWidth * 0.8) / 2;
      const marginTop = (parentHeight - parentHeight * 0.8) / 2;
      const { left, top } =
        currentCards.current[count].container.getBoundingClientRect();
      currentCards.current[count - 1].image.style.left = `${
        left + marginLeft
      }px`;
      currentCards.current[count - 1].image.style.top = `${top + marginTop}px`;
      //add data and image to container
      currentCards.current[count].image = currentCards.current[count - 1].image;
      currentCards.current[count].data = currentCards.current[count - 1].data;
      //remove data and image from container -1
      currentCards.current[count - 1].image = "";
      currentCards.current[count - 1].data = "";
    } else if (currentCards.current[count].data && count === maxNumOfCards) {
      /**
       *  discard: move card and discard
       */
      const parentWidth = currentCards.current["discard"].container.offsetWidth;
      const parentHeight =
        currentCards.current["discard"].container.offsetHeight;
      const marginLeft = (parentWidth - parentWidth * 0.8) / 2;
      const marginTop = (parentHeight - parentHeight * 0.8) / 2;
      const { left, top } =
        currentCards.current["discard"].container.getBoundingClientRect();
      currentCards.current[count].image.style.left = `${left + marginLeft}px`;
      currentCards.current[count].image.style.top = `${top + marginTop}px`;

      discardPileImg.style.opacity = "0";
      discardPileImg.classList.add("card-rotate-back");

      await waitAMoment(10);
      currentCards.current[count].image.classList.add("card-rotate-front");
      await waitAMoment(300);
      discardPileImg.style.opacity = "1";
      discardPileImg.classList.remove("card-rotate-back");
      await waitAMoment(300);
      discardPileImg.classList.add("card-rotate-back");
      discardPileImg.style.opacity = "0";
      currentCards.current[count].image.remove();
      currentCards.current[count].image = "";
      currentCards.current[count].data = "";

      await animateCards(currentCards, topCard, maxNumOfCards, numOfPlayers);
    }

    count--;
  }
};

/**
 *
 *  Animate Gold
 */
export const animateGold = async (winner, goldQty) => {
  const golds = document.querySelectorAll(".players-gold");
  const goldPileContainer = document.getElementById("gold-pile-container");
  const goldPile = document.getElementById("gold-pile");
  const { left: goldPileLeft, top: goldPileTop } =
    goldPile.getBoundingClientRect();

  await golds.forEach(async (playerGP) => {
    if (playerGP.dataset.playerName === winner.name) {
      for (let i = 0; i < goldQty; i++) {
        const newGp = document.createElement("img");
        const playerGp = document.getElementById(
          `player-${winner.playerId}-gp`
        );
        const { left: playerGpLeft, top: playerGpTop } =
          playerGp.getBoundingClientRect();
        newGp.src = newGpSrc;
        newGp.classList.add("new-gp");
        newGp.style.left = `${goldPileLeft}px`;
        newGp.style.top = `${goldPileTop}px`;
        await waitAMoment(50);
        goldPileContainer.appendChild(newGp);
        await waitAMoment(50);
        newGp.style.zIndex = `${100 + i}`;
        newGp.style.left = `${playerGpLeft}px`;
        newGp.style.top = `${playerGpTop}px`;
        newGp.style.width = `70px`;
        newGp.style.height = `70px`;
        setTimeout(() => {
          newGp.remove();
        }, 1000);
      }
    }
  });
};

/**
 * Sets gold for first and second place then adjusts location
 */
export const setNewGPandLocation = async (copiedGameState, playerTokens) => {
  const playerPositions = getPlayerPositions();

  for (let i = 0; i < playerPositions.firstPlace.length; i++) {
    const player = playerPositions.firstPlace[i];
    copiedGameState.players[player].gp += 5;
    await animateGold(copiedGameState.players[player], 5);
    await waitAMoment(800);
  }

  for (let i = 0; i < playerPositions.secondPlace.length; i++) {
    const player = playerPositions.secondPlace[i];
    copiedGameState.players[player].gp += 3;
    await animateGold(copiedGameState.players[player], 3);
    await waitAMoment(800);
  }

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
 *  Random Int
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Initialize Card Container
 */
export const initializeCardContainer = (currentCards) => {
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
};

/**
 * Initialize Player Tokens
 */
export const initializePlayerTokens = (
  gameState,
  imageTokens,
  playerTokens
) => {
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
};

/**
 * Randomizes an array
 */
export const shuffleCards = (arr) => {
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
 *  Make some Particles
 */
export const makeParticles = (setParticles) => {
  const numOfParticles = 75;
  const calcSpace = window.innerWidth / Math.floor(numOfParticles);
  const newArray = [];
  let spacing = 0;
  for (let i = 0; i < numOfParticles; i++) {
    const speed = getRandomInt(15000, 19000);
    const delay = getRandomInt(0, speed) * -1;
    const size = getRandomInt(2, 5);
    newArray.push(
      <div
        key={`particle-${i}`}
        className="particle"
        style={{
          top: `${spacing}px`,
          animationDuration: `${speed}ms`,
          animationDelay: `${delay}ms`,
          width: `${size}px`,
          height: `${size}px`,
        }}
      ></div>
    );
    spacing += calcSpace;
  }
  setParticles(newArray);
};

export /**
 * Check for winner
 */
const checkForWinner = (
  copiedGameState,
  delay,
  setAWinnerIsYou,
  setGameStatus
) => {
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
    }, delay);
    return true;
  }
  return false;
};

/**
 * Makes an Array of numbers
 * used for making the gameboard grid
 */
export const makeAnArray = (num) => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(i);
  }
  return arr;
};

/**
 * Start the game
 */
export const startGame = (
  gameState,
  playerSetup,
  setGameState,
  setGameStatus
) => {
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
      copiedRandomPlayer.playerId = count;
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
 * Pull top card from deck
 */
export const pullFromDeck = async (
  displayedCards,
  cardPile,
  discardPile,
  gameState,
  currentCards,
  cardBack,
  setCardPile,
  setDiscardPile,
  setDisplayedCards
) => {
  const displayCards_copy = copyObject(displayedCards);
  const cardPile_copy = copyObject(cardPile);
  let discardPile_copy = copyObject(discardPile);
  const numOfCards = gameState.numOfPlayers === 6 ? 5 : gameState.numOfPlayers;

  // Helper function to check if deck needs to be reshuffled
  const checkForReshuffle = () => {
    if (cardPile_copy.length === 0) {
      const shuffledDiscardDeck = shuffleCards(discardPile_copy);
      cardPile_copy.push(...shuffledDiscardDeck);
      discardPile_copy = [];
    }
  };

  const takeTopCard = async () => {
    checkForReshuffle();
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
        cardBack
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

  checkForReshuffle();
  setCardPile(cardPile_copy);
  setDiscardPile(discardPile_copy);
  setDisplayedCards(displayCards_copy);
};

/**
 * next round
 */
export const nextRound = async (
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
) => {
  const copiedGameState = copyObject(gameState);
  const firstCheck = checkForWinner(
    copiedGameState,
    50,
    setAWinnerIsYou,
    setGameStatus
  );
  if (firstCheck) return;
  const newCurrentFP =
    currentFirstPlayer + 1 >= gameState.numOfPlayers
      ? 0
      : currentFirstPlayer + 1;
  copiedGameState.players[`${currentFirstPlayer}`].firstPlayer = false;
  copiedGameState.players[`${newCurrentFP}`].firstPlayer = true;
  const newGPandLocation = await setNewGPandLocation(
    copiedGameState,
    playerTokens
  );
  const secondCheck = checkForWinner(
    copiedGameState,
    2000,
    setAWinnerIsYou,
    setGameStatus
  );
  if (!secondCheck) {
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
  setTimeout(() => {
    setGameState(newGPandLocation);
    setCurrentFirstPlayer(newCurrentFP);
    setDisable(false);
    button.target.classList.remove("disabled");
  }, 2000);
};

/**
 *  Handle row click
 */
export const handleRowClick = (
  e,
  savedEvent,
  gameState,
  playerTokens,
  setSavedEvent,
  setGameState
) => {
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
