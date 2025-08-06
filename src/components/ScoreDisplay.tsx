import React from 'react';
import { Team } from '../types';

interface ScoreDisplayProps {
    teamA: Team;
    teamB: Team;
    onOpenScoreboard?: () => void;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
    teamA,
    teamB,
    onOpenScoreboard
}) => {
    return (
        <div className="score-display">
            <h3>🏆 Placar Atual</h3>
            <div className="teams-container">
                <div
                    className="team-card team-a"
                    style={{ background: teamA.gradient }}
                >
                    <div className="team-name">{teamA.name}</div>
                    <div className="team-score">{teamA.score}</div>
                    <div className="team-captain">Capitão: {teamA.captain}</div>
                    <div className="team-members">
                        {teamA.members.join(', ')}
                    </div>
                </div>

                <div className="vs">VS</div>

                <div
                    className="team-card team-b"
                    style={{ background: teamB.gradient }}
                >
                    <div className="team-name">{teamB.name}</div>
                    <div className="team-score">{teamB.score}</div>
                    <div className="team-captain">Capitão: {teamB.captain}</div>
                    <div className="team-members">
                        {teamB.members.join(', ')}
                    </div>
                </div>
            </div>

            {onOpenScoreboard && (
                <button
                    className="scoreboard-button"
                    onClick={onOpenScoreboard}
                >
                    📊 Abrir Scoreboard Detalhado
                </button>
            )}
        </div>
    );
}; 