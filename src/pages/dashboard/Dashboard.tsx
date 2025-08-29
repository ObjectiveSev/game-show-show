import React, { useEffect, useState } from 'react';
import { GamesList } from '../../components/GamesList';
import { ScoreDisplay } from '../../components/ScoreDisplay';
import { ToolsSection } from '../../components/ToolsSection';
import { carregarConfiguracaoJogos } from '../../utils/gamesLoader';
import type { GamesConfig } from '../../types/games';
import type { Team } from '../../types';
import './Dashboard.css';

interface DashboardProps {
    onOpenScoreboard: () => void;
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
    addExtraPoints: (teamId: 'A' | 'B', points: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    onOpenScoreboard,
    onOpenSettings,
    onGameClick,
    gameState,
    addPoints,
    resetScores,
    onClearLocalStorage,
    addExtraPoints
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

                    case 's':
                        event.preventDefault();
                        onOpenScoreboard();
                        break;
                    case 'r': {
                        event.preventDefault();
                        // Usar uma abordagem mais segura para evitar problemas com message channel
                        const shouldReset = window.confirm('Tem certeza que deseja resetar a pontuação?');
                        if (shouldReset) {
                            resetScores();
                        }
                        break;
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [addPoints, resetScores, onOpenScoreboard]);

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
                    onResetScores={() => {
                        // Usar uma abordagem mais segura para evitar problemas com message channel
                        const shouldReset = window.confirm('Tem certeza que deseja resetar a pontuação?');
                        if (shouldReset) {
                            resetScores();
                        }
                    }}
                    onClearLocalStorage={onClearLocalStorage}
                    onAddExtraPoints={addExtraPoints}
                    teamA={gameState.teams.teamA}
                    teamB={gameState.teams.teamB}
                />
            </main>
        </div>
    );
}; 