const BackgroundContainer = ({ backgroundContainer }) => {
  return (
    <div className="background-container" ref={backgroundContainer}>
      <div className="blue-gradient"></div>
      <div className="orange-gradient"></div>
    </div>
  );
};

export default BackgroundContainer;
