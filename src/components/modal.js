const CardModal = ({ modal, setModal }) => {
  if (modal) {
    return (
      <div className="card-modal" onClick={() => setModal("")}>
        <img alt="modal" src={modal} />
      </div>
    );
  }
  return null;
};

export default CardModal;
