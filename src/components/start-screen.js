import RPWLogo from "../images/openScreen.png";

const StartScreen = ({ setGameStatus }) => {
  return (
    <div className="start-screen">
      <img alt="Rock Paper Wizard Logo" src={RPWLogo} draggable="false" />
      <button onClick={() => setGameStatus("setup")} className="start-button">
        Start new game
      </button>
    </div>
  );
};

export default StartScreen;
