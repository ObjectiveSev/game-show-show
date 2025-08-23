import React from 'react';
import { Button } from './button/Button';
import { ButtonType } from '../types';
import { getTeamNameFromString } from '../utils/teamUtils';
import type { Team } from '../types';
import { soundManager } from '../utils/soundManager';

interface ToolsSectionProps {
    onResetScores: () => void;
    onClearLocalStorage: () => void;
    onAddExtraPoints: (teamId: 'A' | 'B', points: number) => void;
    teamA: Team;
    teamB: Team;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({
    onResetScores,
    onClearLocalStorage,
    onAddExtraPoints,
    teamA,
    teamB
}) => {
    // Função para adicionar pontos com som
    const handleAddExtraPoints = (teamId: 'A' | 'B', points: number) => {
        // Tocar som baseado no tipo de ação
        if (points > 0) {
            soundManager.playSuccessSound();
        } else {
            soundManager.playErrorSound();
        }

        // Executar a ação original
        onAddExtraPoints(teamId, points);
    };
    return (
        <div className="tools-section">
            <h3>🛠️ Ferramentas do Host</h3>
            <div className="tools-grid">
                <Button
                    type={ButtonType.RESET}
                    onClick={onResetScores}
                    text="Resetar Pontuação"
                />

                <Button
                    type={ButtonType.CLEAR_STORAGE}
                    onClick={onClearLocalStorage}
                />
            </div>

            <div className="pontuacao-extra-section">
                <h4>🎯 Pontuação Extra do Host</h4>
                <div className="pontuacao-extra-grid">
                    <div className="pontuacao-row">
                        <Button
                            type={ButtonType.CUSTOM}
                            onClick={() => handleAddExtraPoints('A', 1)}
                            customConfig={{
                                text: `+1 ${getTeamNameFromString('A', { teamA, teamB })}`,
                                backgroundColor: teamA.color,
                                hoverBackground: teamA.color,
                                textColor: 'white'
                            }}
                        />
                        <Button
                            type={ButtonType.CUSTOM}
                            onClick={() => handleAddExtraPoints('A', -1)}
                            customConfig={{
                                text: `-1 ${getTeamNameFromString('A', { teamA, teamB })}`,
                                backgroundColor: teamA.color,
                                hoverBackground: teamA.color,
                                textColor: 'white'
                            }}
                        />
                    </div>

                    <div className="pontuacao-row">
                        <Button
                            type={ButtonType.CUSTOM}
                            onClick={() => handleAddExtraPoints('B', 1)}
                            customConfig={{
                                text: `+1 ${getTeamNameFromString('B', { teamA, teamB })}`,
                                backgroundColor: teamB.color,
                                hoverBackground: teamB.color,
                                textColor: 'white'
                            }}
                        />
                        <Button
                            type={ButtonType.CUSTOM}
                            onClick={() => handleAddExtraPoints('B', -1)}
                            customConfig={{
                                text: `-1 ${getTeamNameFromString('B', { teamA, teamB })}`,
                                backgroundColor: teamB.color,
                                hoverBackground: teamB.color,
                                textColor: 'white'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}; 