import React, { useState } from 'react';
import './Auth.css';

function Auth({ onAuth }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // For demo: store users in localStorage
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    if (isRegister) {
      if (users[username]) {
        setError('Username already exists.');
        return;
      }
      users[username] = password;
      localStorage.setItem('users', JSON.stringify(users));
      onAuth(username);
    } else {
      if (!users[username] || users[username] !== password) {
        setError('Invalid username or password.');
        return;
      }
      onAuth(username);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
        <div className="auth-toggle">
          {isRegister ? (
            <span>Already have an account? <button type="button" onClick={() => setIsRegister(false)}>Login</button></span>
          ) : (
            <span>Don't have an account? <button type="button" onClick={() => setIsRegister(true)}>Register</button></span>
          )}
        </div>
      </form>
    </div>
  );
}

export default Auth;
