import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Map from './map.js';
import Drones from './drones.js';
import Header from './Header.js';
import Account from './account.js';
import SearchResultsPage from './SearchResultsPage';

function Portal() {
  return (
    <div
      className="App"
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

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/" element={<Portal />} />
        <Route path="/map" element={<Map />} />
        <Route path="/drones" element={<Drones />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;
