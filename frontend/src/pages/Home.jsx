import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/planning_poker_api';
import '../styles/Home.css';

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
            alert('Failed to create game. PLease try again');
        } finally {
            setLoading(false);
            console.log("loading stopped");
        }

        if (loading) return <div>Loading...</div>
        
    };

    return (
        <div className='home-container'>
            <h1 className='home-title'>Welcome to Planning Poker</h1>
            
            <div className='home-card'>
                <form onSubmit={ createGame }>
                    <input
                        className='home-input'
                        value= {gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        placeholder='Enter project name'
                    />
                    <br/>
                    <button 
                        type="submit"
                        className='home-button'
                        disabled= {!gameName.trim() || loading}
                    >
                        {loading ? 'Creating...' : 'Create Game'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Home;