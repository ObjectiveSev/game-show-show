import React from 'react';
import type { Team } from '../../types';
import './TeamSelector.css';

interface TeamSelectorProps {
    teams: { teamA: Team; teamB: Team };
    value: 'A' | 'B' | '';
    onChange: (val: 'A' | 'B' | '') => void;
    label?: string;
    disabled?: boolean;
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({
    teams,
    value,
    onChange,
    label = 'Time leitor:',
    disabled = false
}) => {
    return (
        <div className="team-selector">
            <label className="team-selector-label">{label}</label>
            <select
                className="team-selector-dropdown"
                value={value}
                onChange={(e) => onChange(e.target.value as 'A' | 'B' | '')}
                disabled={disabled}
            >
                <option value="">Selecionar o time</option>
                <option value="A">{teams.teamA?.name || 'Time A'}</option>
                <option value="B">{teams.teamB?.name || 'Time B'}</option>
            </select>
        </div>
    );
};

