import playersGold from "../images/gp.png";

const GoldPile = ({ handleNextRound, disable }) => {
  return (
    <div className="gold-pile-container" id="gold-pile-container">
      <div className="gold-pile-wrapper">
        <img
          className="gold-pile"
          id="gold-pile"
          alt="players gold"
          src={playersGold}
        />
      </div>
      <button
        className="next-round-btn medievalsharp-regular"
        onClick={(e) => handleNextRound(e)}
        disabled={disable}
      >
        Next round
      </button>
    </div>
  );
};

export default GoldPile;
