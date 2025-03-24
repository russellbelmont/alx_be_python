import { useState } from 'react';
import { searchUsers } from '../services/githubService';

const Search = () => {
  const [searchParams, setSearchParams] = useState({
    username: '',
    location: '',
    minRepos: '',  // Changed from reposMin to minRepos
    language: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Call the service with all search parameters including minRepos
      const users = await searchUsers({
        username: searchParams.username,
        location: searchParams.location,
        minRepos: searchParams.minRepos,  // Using minRepos here
        language: searchParams.language
      });
      setResults(users);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="search-section">
          <input
            type="text"
            name="username"
            value={searchParams.username}
            onChange={handleChange}
            placeholder="Username"
          />
        </div>

        <div className="advanced-section">
          <h3>Advanced Search</h3>
          <input
            type="text"
            name="location"
            value={searchParams.location}
            onChange={handleChange}
            placeholder="Location"
          />
          <input
            type="number"
            name="minRepos"  // Changed to minRepos
            value={searchParams.minRepos}
            onChange={handleChange}
            placeholder="Minimum Repositories"
          />
          <input
            type="text"
            name="language"
            value={searchParams.language}
            onChange={handleChange}
            placeholder="Language"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="results">
        {results.map(user => (
          <div key={user.id} className="user-card">
            <img src={user.avatar_url} alt={`${user.login}'s avatar`} />
            <div className="user-info">
              <h3>
                <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                  {user.name || user.login}
                </a>
              </h3>
              {user.bio && <p>{user.bio}</p>}
              <div className="stats">
                {user.location && <span>📍 {user.location}</span>}
                <span>📦 Repos: {user.public_repos}</span>
                {user.minRepos && <span>✅ Min: {user.minRepos}</span>}
                {user.language && <span>💻 {user.language}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
