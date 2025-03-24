import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

export const searchUsers = async ({ username, location, minRepos, language }) => {
  try {
    // Build query string with all parameters
    let query = '';
    if (username) query += `user:${username}`;
    if (location) query += ` location:${location}`;
    if (minRepos) query += ` repos:>${minRepos}`;  // Explicit minRepos parameter
    if (language) query += ` language:${language}`;

    // Make initial search request
    const searchResponse = await axios.get(
      `${GITHUB_API_URL}/search/users?q=${query}&per_page=5`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    // Fetch detailed information for each user
    const usersWithDetails = await Promise.all(
      searchResponse.data.items.map(async (user) => {
        const userResponse = await axios.get(
          `${GITHUB_API_URL}/users/${user.login}`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json'
            }
          }
        );
        return userResponse.data;
      })
    );

    return usersWithDetails;
  } catch (error) {
    throw new Error('Failed to fetch users. Please try again later.');
  }
};