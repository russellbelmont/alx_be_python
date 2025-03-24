import { useState } from "react";
import { fetchUserData, fetchAdvancedUsers } from "../services/githubService";

const Search = () => {
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [minRepos, setMinRepos] = useState("");
  const [userData, setUserData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setError(null);
    setUserData(null);
    setUsersList([]);

    try {
      if (location || minRepos) {
        const data = await fetchAdvancedUsers(username, location, minRepos);
        setUsersList(data);
      } else {
        const data = await fetchUserData(username);
        setUserData(data);
      }
    } catch (err) {
      setError("Looks like we can't find the user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-4">GitHub User Search</h2>

      <form onSubmit={handleSearch} className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub Username"
          className="w-full border rounded p-2"
          required
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (optional)"
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          value={minRepos}
          onChange={(e) => setMinRepos(e.target.value)}
          placeholder="Min Repositories (optional)"
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {userData && (
        <div className="mt-6 border p-4 rounded">
          <img src={userData.avatar_url} alt="User avatar" className="w-24 h-24 mx-auto rounded-full" />
          <h2 className="text-center text-xl font-semibold">{userData.name || userData.login}</h2>
          {userData.bio && <p className="text-center text-gray-600">{userData.bio}</p>}
          <div className="text-center space-x-4">
            <span>Followers: {userData.followers}</span>
            <span>Following: {userData.following}</span>
            <span>Repos: {userData.public_repos}</span>
          </div>
          <a
            href={userData.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-blue-600 mt-2"
          >
            View GitHub Profile
          </a>
        </div>
      )}

      {usersList.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Search Results:</h3>
          <ul className="space-y-4">
            {usersList.map((user) => (
              <li key={user.id} className="border p-3 rounded flex items-center space-x-4">
                <img src={user.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-semibold">{user.login}</h4>
                  <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    View Profile
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;

