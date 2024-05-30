import { imageTokens } from "../imageTokens";

const WinnerScreen = ({ aWinnerIsYou, resetGame }) => {
  console.log("%caWinnerIsYou:", "color: red", aWinnerIsYou.icon);
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
            <div>{aWinnerIsYou.name} is the winner!</div>
          </div>
          <div className="endgame-button-container">
            <button onClick={resetGame}>New Game?</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WinnerScreen;
