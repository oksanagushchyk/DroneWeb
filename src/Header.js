import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const buttonStyle = {
  padding: '0 32px',
  fontSize: '18px',
  backgroundColor: 'white',
  color: 'gray',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'color 0.3s ease',
  height: '48px',
  lineHeight: '48px',
  textAlign: 'center',
};

const searchContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginLeft: '30px',
};

const searchInputStyle = {
  padding: '8px 15px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  outline: 'none',
  width: '200px',
};

export default function Header() {
  const [searchValue, setSearchValue] = React.useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const encodedQuery = encodeURIComponent(searchValue);
    if (encodedQuery) {
        navigate(`/search?q=${encodedQuery}`);
        setSearchValue('');
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '5px 30px 0px 30px',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        margin: '0 auto 32px auto',
        display: 'flex',
        alignItems: 'flex-start',
        minHeight: '80px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1
            style={{
              marginBottom: '0',
              fontSize: '26px',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              cursor: 'pointer',
            }}
          > 
            <span style={{ color: '#333', marginRight: '8px', fontSize: '26px' }}>✙</span> SwiftAid Drones
          </h1>
        
        </Link>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', height: '100%' }}>
          {['Portal', 'Drones', 'Map', 'Account'].map((text) => (
            <Link
              to={text === 'Portal' ? '/' : `/${text.toLowerCase()}`}
              key={text}
              style={{ textDecoration: 'none' }}
            >
              <button
                style={buttonStyle}
                onMouseOver={(e) => (e.currentTarget.style.color = 'black')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'gray')}
              >
                {text}
              </button>
            </Link>
          ))}
          <div style={searchContainerStyle}>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={handleSearchChange}
                style={searchInputStyle}
              />
              <button 
                type="submit" 
                style={{
                  ...buttonStyle, 
                  height: '42px', 
                  lineHeight: '42px', 
                  marginLeft: '10px', 
                  padding: '0 15px',
                  backgroundColor: '#f0f0f0'
                }}
              >
                🔍
              </button>
            </form>
          </div>
        </div>
      </div>

          <p
            style={{
              fontSize: '13px',
              color: '#555',
              marginBottom: '30px',
              alignSelf: 'flex-start',
            }}
          >
          </p>
    </div>
  );
}