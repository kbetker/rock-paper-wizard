const Particles = ({ particles }) => {
  return (
    <div className="particle-wrapper">
      <div className="particle-and-foreground-container">
        <div className="particles-container">
          {particles.map((el) => {
            return el;
          })}
        </div>
      </div>
    </div>
  );
};

export default Particles;
