import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// The centralized data index used for searching
const websiteIndex = [
  { 
    id: 1, 
    title: 'Portal Dashboard Overview', 
    description: 'Quick links and summaries for drone status and recent alerts.',
    path: '/',
    keywords: ['portal', 'dashboard', 'home', 'summary', 'alerts', 'status'],
  },
  { 
    id: 2, 
    title: 'Drone Fleet Management', 
    description: 'View the status and logs for all active and retired SwiftAid Drones.',
    path: '/drones',
    keywords: ['drones', 'fleet', 'management', 'logs', 'models', 'inventory'],
  },
  { 
    id: 3, 
    title: 'Live Mission Map', 
    description: 'Track ongoing drone missions, view flight paths, and set waypoints.',
    path: '/map',
    keywords: ['map', 'live', 'mission', 'tracking', 'waypoints', 'flight path'],
  },
  { 
    id: 4, 
    title: 'Account & User Settings', 
    description: 'Update your profile, change passwords, and manage billing information.',
    path: '/account',
    keywords: ['account', 'user', 'settings', 'profile', 'password', 'billing'],
  },
  { 
    id: 5, 
    title: 'Emergency Response Protocol Guide', 
    description: 'Detailed steps for handling drone emergencies and maintenance.',
    path: '/help/emergency',
    keywords: ['help', 'guide', 'protocol', 'emergency', 'maintenance', 'repair'],
  },
];

export default function SearchResultsPage() {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('q') || '';
    setQuery(searchTerm);

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      // Filter the index based on title, description, or keywords
      const filteredResults = websiteIndex.filter(item => {
        
        const textMatch = 
          item.title.toLowerCase().includes(lowerCaseSearchTerm) || 
          item.description.toLowerCase().includes(lowerCaseSearchTerm);

        const keywordMatch = item.keywords.some(keyword => 
          keyword.includes(lowerCaseSearchTerm)
        );

        return textMatch || keywordMatch;
      });
      
      setResults(filteredResults);
    } else {
      setResults([]);
    }
    
  }, [location.search]);

  return (
    <div 
      className="SearchResults"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right,rgb(231, 240, 247),rgb(250, 251, 253))',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
          Search Results for "{query}"
        </h2>
        
        {results.length > 0 ? (
          <div>
            <p>Found {results.length} result(s).</p>
            {results.map((item) => (
              <a 
                key={item.id} 
                href={item.path}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div 
                  style={{ 
                    border: '1px solid #eee', 
                    padding: '15px', 
                    marginBottom: '10px', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    backgroundColor: 'white',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <h3 style={{ marginTop: '0', fontSize: '1.2em', color: '#007bff' }}>{item.title}</h3>
                  <p style={{ color: '#555' }}>{item.description}</p>
                  <small style={{ color: '#888' }}>Path: {item.path}</small>
                </div>
              </a>
            ))}
          </div>
        ) : query ? (
          <p>No results found for **"{query}"**. Try a different search term.</p>
        ) : (
          <p>Enter a term in the search bar above to begin searching the site index.</p>
        )}
      </div>
    </div>
  );
}