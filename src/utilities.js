/**
 * Make a deep copy
 * @param {*} inObject
 * @returns
 */
export const copyObject = (inObject: any) => {
  let outObject: Record<string, any>;
  let value: string;
  let key: string;

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
 * @returns
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

export const defaultPlayerSetup = {
  player1: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-0" },
  player2: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-1" },
  player3: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-2" },
  player4: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-3" },
  player5: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-4" },
  player6: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-5" },
};

export const waitAMoment = (time) => {
  return new Promise((res) => {
    setTimeout(() => {
      res("resolved");
    }, time);
  });
};

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

export const animateCards = async (
  currentCards,
  topCard,
  numOfPlayers,
  cardBack,
  setModal
) => {
  const maxNumOfCards = numOfPlayers === 6 ? 5 : numOfPlayers;
  let count = maxNumOfCards;
  const drawPileImg = document.getElementById("draw-pile-img");
  const discardPileImg = document.getElementById("discard-pile-img");

  while (count > 0) {
    // create new card at index 0
    //todo: create a ref for card backer so we're not generating many imgs
    if (!currentCards.current[count].data && count - 1 === 0) {
      const parentWidth = currentCards.current[0].container.offsetWidth;
      const parentHeight = currentCards.current[0].container.offsetHeight;
      const marginLeft = (parentWidth - parentWidth * 0.8) / 2;
      const marginTop = (parentHeight - parentHeight * 0.8) / 2;

      const newCard = document.createElement("img");
      drawPileImg.style.opacity = "1";

      newCard.onclick = () => setModal(topCard.cardImgUrl);
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
      currentCards.current[0].container.appendChild(newCard);
      currentCards.current[0].data = topCard;
      currentCards.current[0].image = newCard;

      await waitAMoment(10);
      drawPileImg.classList.add("card-rotate-back");
      await waitAMoment(200);
      newCard.classList.remove("card-rotate-front");
      await waitAMoment(10);
      drawPileImg.style.opacity = "0";
      drawPileImg.classList.remove("card-rotate-back");
      await waitAMoment(200);
      drawPileImg.style.opacity = "1";
      // todo: animate card flip
    }

    /**
     * shift card to the right
     */
    if (
      !currentCards.current[count].data &&
      currentCards.current[count - 1].data
    ) {
      // await waitAMoment(10);
      // drawPileImg.classList.add("card-rotate-back");
      // await waitAMoment(230);
      // drawPileImg.style.opacity = "0";
      // drawPileImg.classList.remove("card-rotate-back");
      // await waitAMoment(10);
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
      // const discarded = copiedDisplayedCards.pop();
      // copiedDiscardPile.push(discarded);

      discardPileImg.style.opacity = "0";
      discardPileImg.classList.add("card-rotate-back");

      await waitAMoment(10);
      currentCards.current[count].image.classList.add("card-rotate-front");
      await waitAMoment(190);
      discardPileImg.style.opacity = "1";
      discardPileImg.classList.remove("card-rotate-back");
      await waitAMoment(200);
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
