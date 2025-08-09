import React from 'react';
import type { Game } from '../types';

interface GamesListProps {
    games: Game[];
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
                        className={`game-card ${game.status}`}
                        href={game.id === 'verdades-absurdas' ? '/verdades-absurdas' : game.id === 'dicionario-surreal' ? '/dicionario-surreal' : '#'}
                        onClick={(e) => {
                            if (game.id !== 'verdades-absurdas' && game.id !== 'dicionario-surreal') {
                                e.preventDefault();
                                onGameClick(game.id);
                            }
                        }}
                    >
                        <div className="game-icon">{game.icon}</div>
                        <h4>{game.name}</h4>
                        <p>{game.description}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}; 