// src/components/Search.jsx
import { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [searchParams, setSearchParams] = useState({
    username: '',
    location: '',
    reposMin: '',
    language: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const searchUsers = async () => {
    try {
      let query = '';
      if (searchParams.username) query += `user:${searchParams.username}`;
      if (searchParams.location) query += ` location:${searchParams.location}`;
      if (searchParams.reposMin) query += ` repos:>${searchParams.reposMin}`;
      if (searchParams.language) query += ` language:${searchParams.language}`;

      const response = await axios.get(
        `https://api.github.com/search/users?q=${query}&per_page=10`
      );
      
      // Fetch detailed data for each user
      const usersWithDetails = await Promise.all(
        response.data.items.map(async (user) => {
          const userDetails = await axios.get(`https://api.github.com/users/${user.login}`);
          return userDetails.data;
        })
      );
      
      return usersWithDetails;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchUsers();
      setSearchResults(results);
    } catch (err) {
      setError('No users found matching your criteria');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={searchParams.username}
            onChange={handleChange}
            placeholder="e.g. octocat"
          />
        </div>

        <div className="advanced-fields">
          <h3>Advanced Search</h3>
          
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={searchParams.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco"
            />
          </div>

          <div className="form-group">
            <label>Minimum Repositories</label>
            <input
              type="number"
              name="reposMin"
              value={searchParams.reposMin}
              onChange={handleChange}
              placeholder="e.g. 10"
            />
          </div>

          <div className="form-group">
            <label>Primary Language</label>
            <input
              type="text"
              name="language"
              value={searchParams.language}
              onChange={handleChange}
              placeholder="e.g. JavaScript"
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search GitHub Users'}
        </button>
      </form>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="results-container">
        {searchResults.map((user) => (
          <div key={user.id} className="user-card">
            <img src={user.avatar_url} alt={`${user.login}'s avatar`} />
            <div className="user-info">
              <h3>
                <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                  {user.name || user.login}
                </a>
              </h3>
              {user.bio && <p className="bio">{user.bio}</p>}
              <div className="stats">
                <span>📍 {user.location || 'Unknown'}</span>
                <span>📦 {user.public_repos} repos</span>
                <span>👥 {user.followers} followers</span>
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
