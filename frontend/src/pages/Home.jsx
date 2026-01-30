import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/planning_poker_api';

const Home = () => {
    const [gameName, setGameName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const createGame = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("loading start");
        try {
            const game = await api.createGame(gameName);
            localStorage.setItem(`creator_${game.id}`, game.creator_id);
            console.log("Game Created");
            setLoading(false);
            console.log("loading stopped");
            navigate(`/game/${game.id}`);
        } catch (error) {
            console.error("error during creation", error);
            alert('Error creating the game');
        } finally {
            setLoading(false);
            console.log("loading stopped");
        }

        if (loading) return <div>Loading...</div>
        
    };

    return (
        <form onSubmit={ createGame }>
            <div>
                <h1 >Planning Poker Game</h1>
                <input
                value= {gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder='Enter game name'
                />
                <br/>
                <button type="submit" disabled= {!gameName.trim() || loading}>create</button>
            </div>
        </form>
    )
};

export default Home;