import React from 'react';
import type { Game } from '../types';

interface GamesListProps {
    games: Game[];
    onGameClick: (gameId: string) => void;
}

export const GamesList: React.FC<GamesListProps> = ({ games, onGameClick }) => {
    const getStatusBadge = (status: Game['status']) => {
        switch (status) {
            case 'completed':
                return <span className="status-badge completed">✅ Pronto</span>;
            case 'in-development':
                return <span className="status-badge in-development">🔄 Em Desenvolvimento</span>;
            case 'pending':
                return <span className="status-badge pending">⏳ Pendente</span>;
            default:
                return null;
        }
    };

    return (
        <div className="games-section">
            <h3>🎮 Jogos Disponíveis</h3>
            <div className="games-grid">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className={`game-card ${game.status}`}
                        onClick={() => onGameClick(game.id)}
                    >
                        <div className="game-icon">{game.icon}</div>
                        <h4>{game.name}</h4>
                        <p>{game.description}</p>
                        <div className="game-points">{game.points}</div>
                        {getStatusBadge(game.status)}
                    </div>
                ))}
            </div>
        </div>
    );
}; 