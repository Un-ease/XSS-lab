import { useContext } from 'react';
import { AuthContext } from '../App';

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className="brutal-box">Not logged in.</div>;
  }

  return (
    <div>
      <h1 style={{ textTransform: 'uppercase' }}>Your Profile</h1>
      <div className="brutal-box">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email || 'None provided'}</p>
        <p><strong>Status:</strong> Active Lab Participant</p>
        
        <div style={{ marginTop: '2rem', padding: '1rem', border: 'var(--border-width) solid var(--primary)', background: '#fff' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>About</h3>
          <p>Welcome to your profile on the Social Platform.</p>
        </div>
      </div>
    </div>
  );
}
