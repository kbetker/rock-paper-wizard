import RPWLogo from "../images/openScreen.png";

const StartScreen = ({ setGameStatus, gameStatus }) => {
  if (gameStatus === "start-screen") {
    return (
      <div className="start-screen">
        <img alt="Rock Paper Wizard Logo" src={RPWLogo} draggable="false" />
        <button
          onClick={() => setGameStatus("setup")}
          className="start-button medievalsharp-regular"
        >
          Start new game
        </button>
      </div>
    );
  }
  return null;
};

export default StartScreen;
