
import React from 'react';
import './App.css';
import StickyNotes from './StickyNotes';
import Auth from './Auth';

function App() {
  const [user, setUser] = React.useState(localStorage.getItem('user') || null);

  const handleAuth = (username) => {
    setUser(username);
    localStorage.setItem('user', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <div className="App">
      {!user ? (
        <Auth onAuth={handleAuth} />
      ) : (
        <>
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            padding: '18px 24px 12px 24px',
            background: 'linear-gradient(90deg, #232526 60%, #414345 100%)',
            borderRadius: '0 0 18px 18px',
            boxShadow: '0 2px 12px rgba(44,62,80,0.18)',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <h1 style={{margin:0, color:'#fff', fontWeight:'bold', letterSpacing:'1px', fontSize:'2rem', textAlign:'center'}}>Sticky Notes</h1>
            </div>
            <button
              onClick={handleLogout}
              style={{
                marginLeft: 24,
                padding:'10px 22px',
                borderRadius:10,
                border:'none',
                background:'#e57373',
                color:'#fff',
                fontWeight:'bold',
                cursor:'pointer',
                fontSize:'1.08rem',
                boxShadow:'0 2px 8px rgba(229,115,115,0.10)'
              }}
            >
              Logout
            </button>
          </header>
          <StickyNotes />

          <footer style={{
            marginTop: 40,
            padding: '24px 0 18px 0',
            background: 'linear-gradient(90deg, #232526 60%, #414345 100%)',
            color: '#fff',
            borderRadius: '18px 18px 0 0',
            boxShadow: '0 -2px 12px rgba(44,62,80,0.10)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            fontSize: '1.08rem',
          }}>
            <div>Contact: <a href="tel:09156636554" style={{color:'#81c784',textDecoration:'none'}}>09156636554</a></div>
            <div style={{display:'flex',gap:18,alignItems:'center'}}>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" title="Facebook Page" style={{display:'flex',alignItems:'center',fontSize:'1.5rem'}}>
                <i className="fa-brands fa-facebook-f" style={{color:'#1877F3',fontSize:'1.5em'}}></i>
                <span style={{marginLeft:10,fontSize:'1.08rem',color:'#fff'}}>FB Page</span>
              </a>
              <a href="https://mail.google.com/" target="_blank" rel="noopener noreferrer" title="Gmail" style={{display:'flex',alignItems:'center',color:'#fff'}}>
                {/* Font Awesome-like Gmail icon SVG */}
                <svg width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" rx="6" fill="#232526"/>
                  <path d="M502.3 190.8L327.4 338.3c-15.9 13.7-39.8 13.7-55.7 0L9.7 190.8C3.9 186.1 0 178.7 0 170.7V80c0-26.5 21.5-48 48-48h416c26.5 0 48 21.5 48 48v90.7c0 8-3.9 15.4-9.7 20.1z" fill="#EA4335"/>
                  <path d="M502.3 190.8L327.4 338.3c-15.9 13.7-39.8 13.7-55.7 0L9.7 190.8C3.9 186.1 0 178.7 0 170.7V80c0-26.5 21.5-48 48-48h416c26.5 0 48 21.5 48 48v90.7c0 8-3.9 15.4-9.7 20.1z" fill="#fff" fillOpacity=".9"/>
                  <path d="M502.3 190.8L327.4 338.3c-15.9 13.7-39.8 13.7-55.7 0L9.7 190.8C3.9 186.1 0 178.7 0 170.7V80c0-26.5 21.5-48 48-48h416c26.5 0 48 21.5 48 48v90.7c0 8-3.9 15.4-9.7 20.1z" fill="#fff" fillOpacity=".2"/>
                </svg>
                <span style={{marginLeft:6}}>Gmail</span>
              </a>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
