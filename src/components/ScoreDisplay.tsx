import React, { useMemo } from 'react';
import type { Team } from '../types';
import { carregarParticipantes } from '../utils/participantesLoader';
import { getTeamNameFromString } from '../utils/teamUtils';

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
    const [map, setMap] = React.useState<Record<string, string>>({});
    React.useEffect(() => {
        let mounted = true;
        carregarParticipantes().then(list => {
            if (!mounted) return;
            const m: Record<string, string> = {};
            list.forEach(p => { m[p.id] = p.nome; });
            setMap(m);
        }).catch(() => { });
        return () => { mounted = false; };
    }, []);
    const membersA = useMemo(() => teamA.members.map(id => map[id] || id), [teamA.members, map]);
    const membersB = useMemo(() => teamB.members.map(id => map[id] || id), [teamB.members, map]);
    const captainA = map[teamA.captain] || teamA.captain;
    const captainB = map[teamB.captain] || teamB.captain;
    return (
        <div className="score-display">
            <h3>🏆 Placar Atual</h3>
            <div className="teams-container">
                <div
                    className="team-card team-a"
                    style={{ background: teamA.gradient }}
                >
                    <div className="team-name">{getTeamNameFromString('A', { teamA, teamB })}</div>
                    <div className="team-score">{teamA.score}</div>
                    <div className="team-captain">Capitão: {captainA || 'Não definido'}</div>
                    <div className="team-members">
                        {membersA.length > 0 ? membersA.join(', ') : 'Nenhum membro'}
                    </div>
                </div>

                <div className="vs">VS</div>

                <div
                    className="team-card team-b"
                    style={{ background: teamB.gradient }}
                >
                    <div className="team-name">{getTeamNameFromString('B', { teamA, teamB })}</div>
                    <div className="team-score">{teamB.score}</div>
                    <div className="team-captain">Capitão: {captainB || 'Não definido'}</div>
                    <div className="team-members">
                        {membersB.length > 0 ? membersB.join(', ') : 'Nenhum membro'}
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