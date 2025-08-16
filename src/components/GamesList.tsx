import React from 'react';
import type { GameConfig } from '../types/games';

interface GamesListProps {
    games: GameConfig[];
    onGameClick: (gameId: string) => void;
}

export const GamesList: React.FC<GamesListProps> = ({ games, onGameClick }) => {
    return (
        <div className="games-section">
            <h3>🎮 Jogos Disponíveis</h3>
            <div className="games-grid">
                {games.map((game) => (
                    <a
                        key={game.id}
                        className="game-card completed"
                        href={`/${game.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            onGameClick(game.id);
                        }}
                    >
                        <div className="game-icon">{game.emoji}</div>
                        <h4>{game.name}</h4>
                        <p>{game.description}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}; 