import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [dbQuery, setDbQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  const queryParam = searchParams.get('q');

  useEffect(() => {
    if (queryParam) {
      setSearchInput(queryParam);
      performSearch(queryParam);
    } else {
      setResults([]);
      setDbQuery('');
    }
  }, [queryParam]);

  const performSearch = async (q) => {
    try {
      const data = await api.search(q);
      // The backend returns the raw query in data.query
      setDbQuery(data.query);
      setResults(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchInput ? { q: searchInput } : {});
  };

  return (
    <div>
      <h1 style={{ textTransform: 'uppercase', marginBottom: '2rem' }}>Search Posts</h1>
      
      <div className="brutal-box">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            className="brutal-input"
            style={{ marginBottom: 0 }}
            placeholder="Search content..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="brutal-btn">Search</button>
        </form>
      </div>

      {dbQuery && (
        <div className="brutal-box" style={{ background: '#ffa' }}>
          <h2 style={{ margin: 0 }}>
            Results for: <i>"<span dangerouslySetInnerHTML={{ __html: dbQuery }} />"</i>
          </h2>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Found {results.length} posts.
          </p>
        </div>
      )}

      <div>
        {results.map(post => (
          <div key={post.id} className="brutal-box">
            <div style={{ fontWeight: 'bold' }}>@{post.author_username}</div>
            <div style={{ padding: '0.5rem 0' }}>
                 <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
            <Link to={`/post/${post.id}`} style={{ fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
              View Post
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
