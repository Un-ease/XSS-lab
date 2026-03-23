import { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login({ username, password });
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="brutal-box" style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          className="brutal-input" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="brutal-input" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="brutal-btn" style={{ width: '100%' }}>Login</button>
      </form>
    </div>
  );
}
