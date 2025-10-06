
import Header from './Header.js';

function Portal4() {
  return (
    <div
      className="Account"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right,rgb(231, 240, 247),rgb(250, 251, 253))', // slightly grayer for subtle dynamics
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <Header />
    </div>
  );
}

export default Portal4;
