import { useState } from "react";
import axios from "axios";

const Search = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserData = async () => {
    if (!username) return;

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      setUserData(response.data);
    } catch {
      setError("Looks like we can't find the user");
      setUserData(null);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Search GitHub Username..."
        className="border p-2"
      />
      <button onClick={fetchUserData} className="bg-blue-500 text-white p-2 ml-2">
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {userData && (
        <div className="mt-4">
          <img src={userData.avatar_url} alt="Avatar" width="100" />
          <h3>{userData.name}</h3>
          <a href={userData.html_url} target="_blank" rel="noopener noreferrer">
            View Profile
          </a>
        </div>
      )}
    </div>
  );
};

export default Search;
