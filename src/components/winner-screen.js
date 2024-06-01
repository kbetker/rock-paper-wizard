import { imageTokens } from "../imageTokens";

const WinnerScreen = ({ aWinnerIsYou, resetGame, gameStatus }) => {
  if (gameStatus === "someoneWon") {
    return (
      <div className="card-modal">
        {aWinnerIsYou && (
          <div className="endgame-container">
            <div className="winner-container">
              <img
                alt="winner"
                className="winner-icon"
                src={imageTokens[aWinnerIsYou.icon].url}
              />
              <div className="medievalsharp-regular">
                {aWinnerIsYou.name} is the winner!
              </div>
            </div>
            <div className="endgame-button-container">
              <button className="medievalsharp-regular" onClick={resetGame}>
                New Game?
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default WinnerScreen;
