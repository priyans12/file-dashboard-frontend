// src/components/NotFound.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/queensford-logo.png';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="header">
        <img src={logo} alt="Queensford Logo" />
        <h1>Queensford College VETCO Portal</h1>
      </div>

      <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <div style={{ 
          padding: '60px 40px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          border: '2px solid rgba(220, 53, 69, 0.3)'
        }}>
          <div style={{ fontSize: '120px', marginBottom: '20px' }}>🔍</div>
          
          <h1 style={{ 
            fontSize: '72px', 
            margin: '20px 0', 
            color: '#dc3545',
            textShadow: '0 0 20px rgba(220, 53, 69, 0.5)'
          }}>
            404
          </h1>
          
          <h2 style={{ 
            fontSize: '32px', 
            margin: '20px 0',
            color: '#fff'
          }}>
            Page Not Found
          </h2>
          
          <p style={{ 
            fontSize: '18px', 
            color: '#ccc', 
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Sorry, the page you are looking for doesn't exist or has been moved.
            <br />
            Please check the URL or return to the homepage.
          </p>

          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => navigate('/')}
              style={{
                background: '#00c2cb',
                color: 'white',
                padding: '15px 30px',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '150px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#01d8e0';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#00c2cb';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🏠 Go Home
            </button>
            
            <button 
              onClick={() => navigate(-1)}
              style={{
                background: '#6c757d',
                color: 'white',
                padding: '15px 30px',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '150px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#5a6268';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#6c757d';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ⬅ Go Back
            </button>
          </div>

          <div style={{ 
            marginTop: '40px',
            padding: '20px',
            background: 'rgba(0, 194, 203, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(0, 194, 203, 0.3)'
          }}>
            <h4 style={{ color: '#00c2cb', margin: '0 0 10px 0' }}>
              📋 Common Pages
            </h4>
            <div style={{ fontSize: '14px', color: '#ccc' }}>
              • <strong>Login:</strong> /
              <br />
              • <strong>Manager Dashboard:</strong> /manager
              <br />
              • <strong>Coordinator Dashboard:</strong> /coordinator
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <p><strong>Queensland – Brisbane Campus (Head Office)</strong><br />
          Level 2, 359 Queen Street, Brisbane, QLD 4000<br />
          +61 73221 1626 · info@queensford.edu.au</p>
        <p><strong>South Australia – Adelaide Campus</strong><br />
          Level 11, 90 King William Street, Adelaide SA 5000<br />
          +61 8 8410 4605 · sa@queensford.edu.au</p>
        <p><strong>New South Wales – Parramatta Campus</strong><br />
          Level 4, 16–18 Wentworth Street, Parramatta NSW 2150<br />
          +61 2 8660 0040 · syd@queensford.edu.au</p>
        <p>© 2025 Queensford College | CRICOS No: 03010G | RTO: 31736</p>
      </div>
    </>
  );
};

export default NotFound;