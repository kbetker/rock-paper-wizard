import { imageTokens } from "../imageTokens";
import playersGold from "../images/gp.png";

const PlayerRegion = ({ gameState, handleMoneys }) => {
  return (
    <div className="players-region">
      {Object.keys(gameState.players).map((playerKey, i) => {
        if (playerKey) {
          const { icon, name, firstPlayer } = gameState.players[playerKey];
          const iconUrl = imageTokens[icon]?.url || "";

          return (
            <div key={`playercontainer-${i}`} className={`player-container`}>
              <div class="player-wrapper">
                <div className="bottom-image">
                  <img
                    alt={`bottom player ${name}`}
                    className={`bottom-player-token ${
                      firstPlayer ? " first-player" : ""
                    }`}
                    src={iconUrl}
                  />
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
              <span
                className={`player-name medievalsharp-regular${
                  firstPlayer ? " player-name-highlight" : ""
                }`}
              >
                {name}
              </span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default PlayerRegion;
