import { useState, useEffect, useContext } from 'react';
import { api } from '../api';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to post');
      return;
    }
    try {
      await api.createPost(content);
      setContent('');
      setError('');
      loadPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 style={{ textTransform: 'uppercase', marginBottom: '2rem' }}>Global Feed</h1>
      
      {user && (
        <div className="brutal-box" style={{ background: '#f8f8f8' }}>
          <h3>Create a Post</h3>
          {error && <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <textarea
              className="brutal-input"
              rows={3}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button type="submit" className="brutal-btn">Post</button>
          </form>
        </div>
      )}

      <div>
        {posts.map(post => (
          <div key={post.id} className="brutal-box">
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>@{post.author_username}</span>
              <span style={{ fontSize: '0.8rem' }}>{new Date(post.created_at).toLocaleString()}</span>
            </div>
            {/* INTENTIONAL VULNERABILITY SINK (Stored XSS) */}
            <div style={{ padding: '1rem 0' }} dangerouslySetInnerHTML={{ __html: post.content }} />
            <div style={{ marginTop: '1rem', borderTop: '2px dashed black', paddingTop: '0.5rem' }}>
              <Link to={`/post/${post.id}`} style={{ fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>
                View/Add Comments ({post.comments?.length || 0})
              </Link>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p>No posts yet.</p>}
      </div>
    </div>
  );
}
