import { makeAnArray } from "../littleBlackBox";
import { handleRowClick } from "../littleBlackBox";

const GameBoard = ({
  savedEvent,
  gameState,
  playerTokens,
  setSavedEvent,
  setGameState,
}) => {
  return (
    <div className="game-board-container">
      {makeAnArray(11).map((columnNum) => {
        const gameBoardColumnId = `game-board-column-${columnNum}`;
        return (
          <div
            className="game-board-column"
            key={gameBoardColumnId}
            id={gameBoardColumnId}
          >
            {makeAnArray(6).map((rowNum) => {
              const gameBoardRowId = `game-board-row-${rowNum}`;
              return (
                <div
                  className="game-board-row"
                  key={gameBoardRowId}
                  id={gameBoardRowId}
                >
                  <div
                    onClick={(e) =>
                      handleRowClick(
                        e,
                        savedEvent,
                        gameState,
                        playerTokens,
                        setSavedEvent,
                        setGameState
                      )
                    }
                    className="game-board-row-marker"
                    id={`${columnNum}-${rowNum}`}
                    data-occupied={""}
                  ></div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
