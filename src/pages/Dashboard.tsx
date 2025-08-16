import React, { useEffect, useState } from 'react';

import { ScoreDisplay } from '../components/ScoreDisplay';
import { GamesList } from '../components/GamesList';
import { ToolsSection } from '../components/ToolsSection';
import { carregarConfiguracaoJogos } from '../utils/gamesLoader';
import type { GamesConfig } from '../types/games';
import type { Team } from '../types';

interface DashboardProps {
    onOpenScoreboard: () => void;
    onOpenBuzzer: () => void;
    onOpenSettings: () => void;
    onGameClick: (gameId: string) => void;
    gameState: {
        teams: {
            teamA: Team;
            teamB: Team;
        };
    };
    addPoints: (teamId: 'A' | 'B', points: number) => void;
    resetScores: () => void;
    onClearLocalStorage: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    onOpenScoreboard,
    onOpenBuzzer,
    onOpenSettings,
    onGameClick,
    gameState,
    addPoints,
    resetScores,
    onClearLocalStorage
}) => {
    const [gamesConfig, setGamesConfig] = useState<GamesConfig | null>(null);
    const [loading, setLoading] = useState(true);

    // Carregar configuração dos jogos
    useEffect(() => {
        const carregarJogos = async () => {
            try {
                const config = await carregarConfiguracaoJogos();
                setGamesConfig(config);
            } catch (error) {
                console.error('Erro ao carregar configuração dos jogos:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarJogos();
    }, []);


    // Atalhos de teclado
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey) {
                switch (event.key) {
                    case '1':
                        event.preventDefault();
                        addPoints('A', 1);
                        break;
                    case '2':
                        event.preventDefault();
                        addPoints('B', 1);
                        break;
                    case 'z':
                        event.preventDefault();
                        addPoints('A', -1);
                        break;
                    case 'x':
                        event.preventDefault();
                        addPoints('B', -1);
                        break;
                    case 'b':
                        event.preventDefault();
                        onOpenBuzzer();
                        break;
                    case 's':
                        event.preventDefault();
                        onOpenScoreboard();
                        break;
                    case 'r':
                        event.preventDefault();
                        // Usar setTimeout para evitar problemas com message channel
                        setTimeout(() => {
                            if (confirm('Tem certeza que deseja resetar a pontuação?')) {
                                resetScores();
                            }
                        }, 0);
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [addPoints, resetScores, onOpenBuzzer, onOpenScoreboard]);

    return (
        <div className="dashboard">
            <header className="header">
                <h1>🎯 Game Show Show</h1>
            </header>

            <main className="main-content">
                <ScoreDisplay
                    teamA={gameState.teams.teamA}
                    teamB={gameState.teams.teamB}
                    onOpenScoreboard={onOpenScoreboard}
                    onOpenSettings={onOpenSettings}
                />

                {loading ? (
                    <div className="games-section">
                        <h3>🎮 Jogos Disponíveis</h3>
                        <div className="loading-games">
                            <p>Carregando jogos...</p>
                        </div>
                    </div>
                ) : (
                    <GamesList
                        games={gamesConfig?.games || []}
                        onGameClick={onGameClick}
                    />
                )}

                <ToolsSection
                    onOpenBuzzer={onOpenBuzzer}
                    onResetScores={() => {
                        // Usar setTimeout para evitar problemas com message channel
                        setTimeout(() => {
                            if (confirm('Tem certeza que deseja resetar a pontuação?')) {
                                resetScores();
                            }
                        }, 0);
                    }}
                    onClearLocalStorage={onClearLocalStorage}
                />
            </main>
        </div>
    );
}; 