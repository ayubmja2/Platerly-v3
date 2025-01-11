import axios from 'axios';

const API_BASE_URL = 'https://localhost:7238/api'; // Replace with your ASP.NET port

export const fetchRecipes = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/recipes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
};
