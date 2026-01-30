import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api/planning_poker_api';

const Game = () => {
    const { gameId } = useParams();
    const [gameName, setGameName] = useState('Loading...');
    const [copied, setCopied] = useState(false);
    const [showshare, setShowShare] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [voteOptions, setVoteOptions] = useState([]);
    const [isrevealed, setIsRevealed] = useState(false);

    //if someone has joined game the app remembers even after reload
    const [playerName, setPlayerName] = useState(
        localStorage.getItem(`player_${gameId}`) || ''
    );

    //using temp name so only on join name is saved
    const [tempName, setTempName] = useState('');
    const [voteCount, setVoteCount] = useState(0);

    const refreshGame = async () => {
        const gamedata = await api.getGame(gameId);
        setVoteCount(gamedata.vote_count);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            refreshGame()
        }, 2000);

        return () => clearInterval(interval);
    }, [gameId]);

    useEffect(() => {
        api.getVoteOptions().then((data) => {
            setVoteOptions(data.options);
        });
    }, []);

    useEffect(() => {
        api.getGame(gameId).then((gameData) => {
            setGameName(gameData.name);
            const creatorId = localStorage.getItem(`creator_${gameId}`);
            setIsAdmin(creatorId === gameData.creator_id);
            
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
                {!showshare && isAdmin &&
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

            {!playerName && (
                <div>
                    <input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder='Enter your name'
                    />
                    <button onClick={() => {
                        localStorage.setItem(`player_${gameId}`,tempName),
                        setPlayerName(tempName);
                        setTempName('');
                    }}>
                        Join
                    </button>
                </div>
            )}

            {/* Ticket Card */}
            { playerName && <div style={{
                maxWidth: '400px',
                margin: '2rem auto',
                padding: '2rem',
                borderRadius: '1rem',
                backgroundColor: 'blueviolet',
                boxShadow: '0 20px 25px -5px rgba(0, 0,0, 0.1), 0 10px 10px -5px rgba(0, 0,0, 0.04)',
                textAlign: 'center'
            }}>
                <button disabled={!isAdmin} onClick={() => {setIsRevealed(true)}}>Reveal Votes</button>
            </div>
            }

            {playerName && <div>
                <h3>Voting options:</h3>
                {voteOptions.map((v) => (
                    <button
                        key={v}
                        onClick={async () => {
                            await api.submitVote(gameId, playerName, String(v));
                        }}
                        disabled={isrevealed}
                    >
                        {v}
                    </button>
                ))}
                </div>}

            { isAdmin ? (<h3>Admin Page</h3>):(<h3>Voter Page</h3>)}
            <h4>{voteCount} votes submitted</h4>
            {isrevealed && <h4>see revealed votes</h4>}


        </div>
    );
};

export default Game;
