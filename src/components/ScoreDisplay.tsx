import React from 'react';
import type { Team } from '../types';

interface ScoreDisplayProps {
    teamA: Team;
    teamB: Team;
    onOpenScoreboard?: () => void;
    onOpenSettings?: () => void;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
    teamA,
    teamB,
    onOpenScoreboard,
    onOpenSettings
}) => {
    return (
        <div className="score-display">
            <h3>🏆 Placar Atual</h3>
            <div className="teams-container">
                <div
                    className="team-card team-a"
                    style={{ background: teamA.gradient }}
                >
                    <div className="team-name">{teamA.name || 'Time A'}</div>
                    <div className="team-score">{teamA.score}</div>
                    <div className="team-captain">Capitão: {teamA.captain || 'Não definido'}</div>
                    <div className="team-members">
                        {teamA.members.length > 0 ? teamA.members.join(', ') : 'Nenhum membro'}
                    </div>
                </div>

                <div className="vs">VS</div>

                <div
                    className="team-card team-b"
                    style={{ background: teamB.gradient }}
                >
                    <div className="team-name">{teamB.name || 'Time B'}</div>
                    <div className="team-score">{teamB.score}</div>
                    <div className="team-captain">Capitão: {teamB.captain || 'Não definido'}</div>
                    <div className="team-members">
                        {teamB.members.length > 0 ? teamB.members.join(', ') : 'Nenhum membro'}
                    </div>
                </div>
            </div>

            <div className="score-actions">
                {onOpenScoreboard && (
                    <button
                        className="scoreboard-button"
                        onClick={onOpenScoreboard}
                    >
                        📊 Abrir Scoreboard Detalhado
                    </button>
                )}
                {onOpenSettings && (
                    <button
                        className="settings-button"
                        onClick={onOpenSettings}
                    >
                        ⚙️ Configuração de Times
                    </button>
                )}
            </div>
        </div>
    );
}; 