import React from 'react';
import type { Team } from '../../types';

interface TeamSelectorProps {
    teams: { teamA: Team; teamB: Team };
    value: 'A' | 'B' | '';
    onChange: (val: 'A' | 'B' | '') => void;
    label?: string;
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({ teams, value, onChange, label = 'Time leitor:' }) => {
    return (
        <div className="team-selector">
            <span className="label">{label}</span>
            <select className="team-dropdown" value={value} onChange={(e) => onChange(e.target.value as any)}>
                <option value="">Selecionar o time</option>
                <option value="A">{teams.teamA?.name || 'Time A'}</option>
                <option value="B">{teams.teamB?.name || 'Time B'}</option>
            </select>
        </div>
    );
};

