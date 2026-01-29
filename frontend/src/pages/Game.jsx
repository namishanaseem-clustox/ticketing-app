import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api/planning_poker_api';

const Game = () => {
    const { gameId } = useParams();
    const [gameName, setGameName] = useState('Loading...');
    const [copied, setCopied] = useState(false);
    const [showshare, setShowShare] = useState(false);

    useEffect(() => {
        api.getGame(gameId).then((gameData) => {
            setGameName(gameData.name);
        }).catch(() => {
            setGameName('Game not found');
        });
    }, [gameId]);

    const CopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Copy failed:', error);
            alert('Copy failed! Please try again');
        }
    };

    return (
        <div>
            {/* Header - Centered Name */}
            <div>
                <h1>{gameName} Game Lobby</h1>
                {/*Just to test the url generation for now*/}
                <h2>ID: {gameId}</h2>
            </div>

            {/* Share Toggle Button - Centered */}
            <div>
                {!showshare && 
                <button onClick={() => setShowShare(true)}>
                    share invitation link
                </button>}
            </div>

            {/* Share Box */}
            {showshare && (
                <div>
                    {/* Link */}
                    <div>📎 {window.location.href}</div>
                    
                    {/* Copy + Hide Buttons */}
                    <div>
                        <button onClick={CopyUrl}>
                            {copied ? '✅ Copied!' : '📋 Copy Link'}
                        </button>
                        <button onClick={() => setShowShare(false)}>
                            Hide
                        </button>
                    </div>
                </div>
            )}

            {/* Ticket Card */}
            <div style={{
                maxWidth: '400px',
                margin: '2rem auto',
                padding: '2rem',
                borderRadius: '1rem',
                backgroundColor: 'blueviolet',
                boxShadow: '0 20px 25px -5px rgba(0, 0,0, 0.1), 0 10px 10px -5px rgba(0, 0,0, 0.04)',
                textAlign: 'center'
            }}>
                <button>Start Voting</button>
            </div>

        </div>
    );
};

export default Game;
