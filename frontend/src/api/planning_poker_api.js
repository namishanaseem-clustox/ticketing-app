//API abstraction
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const api = {

    createGame: async (name) => {
        const response = await axios.post(`${API_BASE}/games/`, { name });
        return response.data;
    },

    getGame: async (gameId) => {
        const response = await axios.get(`${API_BASE}/games/${gameId}`);
        return response.data;
    },

    submitVote: async(gameId, playerName, value) => {
        const response = await axios.post(`${API_BASE}/games/${gameId}/vote`, {
            player_name: playerName,
            value: value
        });
        return response.data;
    },

    getVoteOptions: async () => {
        const response = await axios.get(`${API_BASE}/games/options`);
        return response.data;
    },

    revealGame: async(gameId) => {
        const response = await axios.post(`${API_BASE}/games/${gameId}/reveal`);
        return response.data;
    },

    resetGame: async(gameId) => {
        const response = await axios.post(`${API_BASE}/games/${gameId}/reset`);
        return response.data
    }

}