import { useState } from 'react';
import { fetchUserData } from '../services/githubService';

const Search = () => {
  const [searchParams, setSearchParams] = useState({
    username: '',
    location: '',
    reposMin: '',
    language: ''
  });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // For basic search by username
      if (searchParams.username) {
        const data = await fetchUserData(searchParams.username);
        setUserData(data);
      } else {
        // For advanced search (simplified example)
        // Note: GitHub's search API has limitations
        let query = '';
        if (searchParams.location) query += `location:${searchParams.location}`;
        if (searchParams.reposMin) query += ` repos:>${searchParams.reposMin}`;
        if (searchParams.language) query += ` language:${searchParams.language}`;
        
        const response = await axios.get(`https://api.github.com/search/users?q=${query}`);
        setUserData(response.data.items[0]); // Just showing first result for simplicity
      }
    } catch (err) {
      setError('Looks like we cant find the user');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={searchParams.username}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter GitHub username"
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900">Advanced Search</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={searchParams.location}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., San Francisco"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Repositories</label>
              <input
                type="number"
                name="reposMin"
                value={searchParams.reposMin}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Language</label>
              <input
                type="text"
                name="language"
                value={searchParams.language}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., JavaScript"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading && <p className="mt-4 text-center">Loading...</p>}
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      {userData && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <img 
              src={userData.avatar_url} 
              alt="User avatar" 
              className="w-16 h-16 rounded-full" 
            />
            <div>
              <h2 className="text-lg font-semibold">{userData.name || userData.login}</h2>
              {userData.location && <p className="text-sm text-gray-600">{userData.location}</p>}
              {userData.public_repos && <p className="text-sm text-gray-600">{userData.public_repos} public repositories</p>}
            </div>
          </div>
          {userData.bio && <p className="mt-3 text-sm text-gray-700">{userData.bio}</p>}
          <a 
            href={userData.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View GitHub Profile →
          </a>
        </div>
      )}
    </div>
  );
};

export default Search;
