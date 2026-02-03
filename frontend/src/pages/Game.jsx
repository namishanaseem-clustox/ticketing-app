import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api/planning_poker_api';
import '../styles/Game.css'; // Ensure you create this file

const Game = () => {
    const { gameId } = useParams();
    const [gameName, setGameName] = useState('Loading...');
    const [copied, setCopied] = useState(false);
    const [showshare, setShowShare] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [voteOptions, setVoteOptions] = useState([]);
    const [isrevealed, setIsRevealed] = useState(false);
    const [stats, setStats] = useState({});

    const [playerName, setPlayerName] = useState(
        localStorage.getItem(`player_${gameId}`) || ''
    );

    const [tempName, setTempName] = useState('');
    const [voteCount, setVoteCount] = useState(0);

    const refreshGame = async () => {
        try {
            const gamedata = await api.getGame(gameId);
            setVoteCount(gamedata.vote_count);
            
            if (gamedata.status === 'revealed') {
                setIsRevealed(true);
                setStats({
                    ...gamedata.stats,
                    votes: gamedata.votes
                }); 
            } else {
                setIsRevealed(false);
                setStats({});
            }
        } catch (error) {
            console.error("Refresh failed:", error);
        }
    };

    const handleReveal = async () => {
        try {
            const statsData = await api.revealGame(gameId);
            setStats(statsData);
            setIsRevealed(true);
        } catch (error) {
            console.error("Failed to reveal:", error);
        }
    };

    const handleReset = async () => {
        try {
            await api.resetGame(gameId);
            setIsRevealed(false);
            setStats({});
        } catch (error) {
            console.error("Failed to reset:", error);
        }
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
        <div className="game-container">
            {/* Nav Bar Implementation */}
            <nav className="navbar">
                <div className="nav-left">
                    <span>👤 {playerName || 'Joining...'}</span>
                </div>
                <div className="nav-center">
                    <h1>{gameName}</h1>
                </div>
                <div className="nav-right">
                    <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-voter'}`}>
                        {isAdmin ? 'Admin' : 'Voter'}
                    </span>
                </div>
            </nav>

            <div className="game-content">
                {/* Share Section Wrapper */}
                {isAdmin && playerName && (
                    <div className="card shadow-sm">
                        {!showshare ? (
                            <button className="share-button" onClick={() => setShowShare(true)}>
                                Share Invitation Link
                            </button>
                        ) : (
                            <div className="share-box">
                                <p className="share-link">📎 {window.location.href}</p>
                                <div className="button-group">
                                    <button className="game-button share-btn-small" onClick={CopyUrl}>
                                        {copied ? '✅ Copied!' : '📋 Copy Link'}
                                    </button>
                                    <button className="game-button share-btn-small btn-secondary" onClick={() => setShowShare(false)}>
                                        Hide
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Join Section Wrapper */}
                {!playerName && (
                    <div className="card">
                        <h3>Set Your Name</h3>
                        <input
                            className="game-input"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder='Enter your name...'
                        />
                        <button className="game-button" onClick={() => {
                            localStorage.setItem(`player_${gameId}`, tempName);
                            setPlayerName(tempName);
                            setTempName('');
                        }}>Join Game</button>
                    </div>
                )}

                {/* Main Action Ticket Card */}
                {playerName && (
                    <div className="card action-card">
                        <p className="vote-status">{voteCount} votes submitted</p>
                        {!isrevealed ? (
                            <button className="primary-action-btn" onClick={handleReveal} disabled={!isAdmin}>
                                Reveal Votes
                            </button>
                        ) : (
                            <button className="primary-action-btn" onClick={handleReset} disabled={!isAdmin}>
                                Vote Again
                            </button>
                        )}
                    </div>
                )}

                {/* Dynamic Player Deck */}
                <div className="player-deck">
                    {!isrevealed ? (
                        /* 1. WHILE VOTING: Show "Backs" based on voteCount */
                        Array.from({ length: voteCount }).map((_, index) => (
                            <div key={`hidden-${index}`} className="player-card hidden">
                                <div className="card-back">
                                    <div className="card-pattern">
                                        <span className="poker-icon">♣</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        /* 2. AFTER REVEAL: Show "Fronts" with real data */
                        stats.votes && Object.entries(stats.votes).map(([player, value]) => (
                            <div key={player} className="player-card revealed">
                                <div className="card-back">
                                    <span className="vote-value">{value}</span>
                                    <span className="player-name-label">{player}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Voting Grid Section */}
                {playerName && !isrevealed && (
                    <div className="card">
                        <h3 className="section-title">Select your estimate:</h3>
                        <div className="vote-grid">
                            {voteOptions.map((v) => (
                                <button
                                    key={v}
                                    className="vote-btn"
                                    onClick={async () => {
                                        await api.submitVote(gameId, playerName, String(v));
                                    }}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Detailed Results Section */}
                {isrevealed && (
                    <div className="card results-card">
                        <h3 className="section-title">Results</h3>
                        <div className="stats-summary-footer">
                            <div className="stat-item"><small>MIN</small><strong>{stats.min ?? '-'}</strong></div>
                            <div className="stat-item"><small>MAX</small><strong>{stats.max ?? '-'}</strong></div>
                            <div className="stat-item"><small>AVG</small><strong>{stats.avg ?? '-'}</strong></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Game;