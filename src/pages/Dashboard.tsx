import React, { useEffect } from 'react';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { GamesList } from '../components/GamesList';
import { ToolsSection } from '../components/ToolsSection';
import { useGameState } from '../hooks/useGameState';
import { games } from '../data/gameData';

interface DashboardProps {
    onOpenScoreboard: () => void;
    onOpenBuzzer: () => void;
    onOpenSettings: () => void;
    onGameClick: (gameId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    onOpenScoreboard,
    onOpenBuzzer,
    onOpenSettings,
    onGameClick
}) => {
    const { gameState, addPoints, resetScores } = useGameState();

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
                        if (confirm('Tem certeza que deseja resetar a pontuação?')) {
                            resetScores();
                        }
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
                />

                <GamesList
                    games={games}
                    onGameClick={onGameClick}
                />

                <ToolsSection
                    onOpenBuzzer={onOpenBuzzer}
                    onResetScores={() => {
                        if (confirm('Tem certeza que deseja resetar a pontuação?')) {
                            resetScores();
                        }
                    }}
                    onOpenSettings={onOpenSettings}
                />
            </main>
        </div>
    );
}; 