import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header.js';


function Portal2() {
  return (
    <div
      className="App"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right,rgb(231, 240, 247),rgb(250, 251, 253))', // light gray gradient for dynamic background
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <Header />
      <div style={{
        marginBottom: '0',
        fontSize: '26px',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        height: '48px',
        cursor: 'pointer',
        margin: '32px 0 16px 0',
        marginLeft: '36px',
        fontWeight: 500,
        fontFamily: 'Segoe UI, Arial, sans-serif',
        textShadow: '0 2px 8px rgba(60,80,120,0.06)'

      }}>Drone Map</div>
     
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-center">

            <MapModal />

        </div>
      </div>
    </div>
  );
}

// map modal
const MapModal = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const mapModalClass = isFullScreen ? 'map-modal-fullscreen' : 'map-modal';

  // modal styling
  const modalStyle = {
    width: '90vw',
    height: '70vh',
    margin: '0 auto',
    padding: '24px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const fullScreenMapStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    //padding: '8px', (probably not needed)
    background: 'white',
    borderRadius: '0',
    width: '100vw',
    height: '100vh',
    margin: 0,
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [isFullScreen]);

  return (
    <div
      className={mapModalClass}
      style={isFullScreen ? fullScreenMapStyle : modalStyle}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <button
          onClick={toggleFullScreen}
          style={{
            padding: '8px',
            color: '#2563eb',
            borderRadius: '999px',
            background: '#e0e7ef',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            fontWeight: 500,
            marginBottom: '8px',
          }}
          title={isFullScreen ? 'Collapse Map (Esc)' : 'Expand Map'}
        >
          {isFullScreen ? (
            <span style={{ marginRight: '4px', fontSize: '18px' }}>[-]</span>
          ) : (
            <span style={{ marginRight: '4px', fontSize: '18px' }}>[+]</span>
          )}
          {isFullScreen ? 'Collapse' : 'Expand'}
        </button>
      </div>

      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <iframe
          title="Drone Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d329177.3061730302!2d-118.89201974641662!3d33.89664536254462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1698886000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0, borderRadius: '16px' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

      </div>

    </div>

  );

  
};

export default Portal2;
