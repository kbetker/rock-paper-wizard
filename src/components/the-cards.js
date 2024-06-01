import cardBack from "../images/card-images/_cardBack.png";
import { makeAnArray } from "../littleBlackBox";

const TheCards = ({ wildMagic, gameState, handleModalClick }) => {
  return (
    <div className="cards-region">
      <div
        className="card-container cardpile"
        id="card-container-0"
        data-cardtype="card-pile"
      >
        <img
          onClick={() => wildMagic()}
          alt="card pile"
          src={cardBack}
          id="draw-pile-img"
        />

        <img alt="card pile" src={cardBack} id="draw-pile-img-backer" />
      </div>

      {makeAnArray(
        gameState.numOfPlayers === 6 ? 5 : gameState.numOfPlayers
      ).map((card, index) => {
        return (
          <div
            className="card-container"
            key={`card-slot-${index}`}
            id={`card-container-${index + 1}`}
            data-cardtype="visible-card"
            onClick={handleModalClick}
          ></div>
        );
      })}

      <div
        className="card-container"
        id={`card-container-${gameState.numOfPlayers + 1}`}
        data-cardtype="discard-pile"
      >
        <img alt="discard pile" src={cardBack} id="discard-pile-img" />
        <img
          alt="discard pile backer"
          src={cardBack}
          id="discard-pile-img-backer"
        />
      </div>
    </div>
  );
};

export default TheCards;
