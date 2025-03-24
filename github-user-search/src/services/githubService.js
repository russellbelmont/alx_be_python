import axios from 'axios';

export const searchUsers = async (params) => {
  try {
    let query = '';
    if (params.username) query += `user:${params.username}`;
    if (params.location) query += ` location:${params.location}`;
    if (params.reposMin) query += ` repos:>${params.reposMin}`;
    if (params.language) query += ` language:${params.language}`;

    const response = await axios.get(
      `https://api.github.com/search/users?q=${query}&per_page=10`
    );
    
    const usersWithDetails = await Promise.all(
      response.data.items.map(async (user) => {
        const userDetails = await axios.get(`https://api.github.com/users/${user.login}`);
        return userDetails.data;
      })
    );
    
    return usersWithDetails;
  } catch (error) {
    throw new Error('No users found matching your criteria');
  }
};