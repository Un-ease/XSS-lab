import { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import PostDetail from './components/PostDetail';
import Search from './components/Search';
import Profile from './components/Profile';

export const AuthContext = createContext(null);

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
        <BrowserRouter>
          <div className="app-container">
            <nav className="brutal-nav">
              <div>
                <Link to="/" style={{ fontSize: '1.5rem', textDecoration: 'none' }}>Social Platform</Link>
              </div>
              <ul>
                <li><Link to="/">Feed</Link></li>
                <li><Link to="/search">Search</Link></li>
                {user ? (
                  <>
                    <li><Link to="/profile">Profile ({user.username})</Link></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Logout</a></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                  </>
                )}
              </ul>
            </nav>

            <main className="main-content">
              <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/search" element={<Search />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
