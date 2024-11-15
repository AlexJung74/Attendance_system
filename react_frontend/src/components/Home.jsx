// src/components/Home.jsx

import { useState } from 'react';

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 로직 처리
    console.log("Logging in with", username, password);
  };

  return (
    <div>
      <h2>Welcome to the Attendance System</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>ID:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Home;
