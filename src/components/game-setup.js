import { makeAnArray } from "../littleBlackBox";
import { imageTokens } from "../imageTokens";
import selectImage from "../images/player-tokens/selectImage.png";
import { startGame } from "../littleBlackBox";
import { useState } from "react";

const GameSetup = ({
  playerSetup,
  handlePlayerInput,
  gameState,
  setGameState,
  setGameStatus,
  gameStatus,
}) => {
  const [tokenContainerStatus, setTokenContainerStatus] = useState({
    isOpen: false,
    openedBy: "",
  });

  if (gameStatus === "setup") {
    return (
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
              className="medievalsharp-regular"
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
    );
  }
  return null;
};

export default GameSetup;
