import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { AuthContext } from '../App';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const data = await api.getPost(id);
      setPost(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load post');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Must log in to comment');
      return;
    }
    try {
      await api.createComment(id, commentContent);
      setCommentContent('');
      loadPost();
    } catch (err) {
      setError(err.message);
    }
  };

  if (error && !post) return <div className="brutal-box"><h3>Error</h3><p>{error}</p></div>;
  if (!post) return <div className="brutal-box">Loading...</div>;

  return (
    <div>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem', fontWeight: 'bold', color: 'black' }}>&larr; Back to Feed</Link>
      <div className="brutal-box" style={{ borderColor: 'var(--primary)' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>@{post.author_username}</span>
          <span>{new Date(post.created_at).toLocaleString()}</span>
        </div>
        <h2 style={{ margin: '1rem 0' }} dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <div style={{ marginLeft: '2rem' }}>
        <h3 style={{ textTransform: 'uppercase' }}>Comments</h3>
        {post.comments && post.comments.map(c => (
          <div key={c.id} className="brutal-box" style={{ padding: '1rem', boxShadow: '3px 3px 0px black' }}>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem' }}>@{c.author_username} said:</div>
            <div dangerouslySetInnerHTML={{ __html: c.content }} />
            
            <div style={{ fontSize: '0.7rem', marginTop: '0.5rem', textAlign: 'right' }}>{new Date(c.created_at).toLocaleString()}</div>
          </div>
        ))}

        {user ? (
          <div className="brutal-box" style={{ marginTop: '2rem', background: '#eef' }}>
            <h4>Add a Comment</h4>
            {error && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}
            <form onSubmit={handleCommentSubmit}>
              <input
                type="text"
                className="brutal-input"
                placeholder="Write a comment..."
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                required
              />
              <button type="submit" className="brutal-btn" style={{ padding: '0.5rem 1rem' }}>Comment</button>
            </form>
          </div>
        ) : (
          <p style={{ marginTop: '2rem', fontWeight: 'bold' }}>Please login to comment.</p>
        )}
      </div>
    </div>
  );
}
