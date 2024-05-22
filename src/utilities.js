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
      console.log("%csquare:", "color: magenta", square);
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

export const clearOldPositions = (oldLocations) => {
  Object.keys(oldLocations).forEach((key) => {
    const oldLoc = document.getElementById(oldLocations[key].location);
    const [column, row] = oldLoc.id.split("-");
    if (column < 3 || column > 8) {
      oldLoc.dataset.occupied = "";
    }
  });
};

export const defaultPlayerSetup = {
  player1: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-0" },
  player2: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-1" },
  player3: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-2" },
  player4: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-3" },
  player5: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-4" },
  player6: { name: "", icon: "", gp: 3, firstPlayer: false, location: "5-5" },
};
