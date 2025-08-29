import React, { useEffect, useState } from 'react';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import { STORAGE_KEYS } from '../../../constants';

interface HostExtraPointsScoreSectionProps {
    gameState: AppState;
}

export const HostExtraPointsScoreSection: React.FC<HostExtraPointsScoreSectionProps> = ({
    gameState
}) => {
    const [extraPoints, setExtraPoints] = useState<Array<{
        id: string;
        teamId: string;
        points: number;
        timestamp: number;
        razao?: string;
    }>>([]);

    useEffect(() => {
        let isMounted = true;

        const loadExtraPoints = async () => {
            try {
                // Carregar pontuação extra do localStorage usando a mesma key do dashboard
                const storedExtraPoints = localStorage.getItem(STORAGE_KEYS.EXTRA_POINTS);
                if (storedExtraPoints) {
                    const parsed = JSON.parse(storedExtraPoints);
                    if (!isMounted) return;
                    setExtraPoints(parsed);
                }
            } catch (error) {
                if (isMounted) {
                    console.warn('Erro ao carregar pontuação extra do host:', error);
                }
            }
        };

        loadExtraPoints();

        return () => {
            isMounted = false;
        };
    }, []);

    if (!extraPoints || extraPoints.length === 0) {
        return null;
    }

    return (
        <div className="historico-subsecao">
            <h3>🎯 Pontuação Extra do Host</h3>
            <div className="table-wrapper">
                <table className="pd-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Pontos</th>
                            <th>Razão</th>
                            <th>Data/Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {extraPoints.map((entry) => (
                            <tr key={entry.id}>
                                <td>{getTeamNameFromString(entry.teamId, gameState.teams)}</td>
                                <td className="center">{entry.points > 0 ? `+${entry.points}` : entry.points}</td>
                                <td className="razao-cell">{entry.razao || '-'}</td>
                                <td>{new Date(entry.timestamp).toLocaleString('pt-BR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
