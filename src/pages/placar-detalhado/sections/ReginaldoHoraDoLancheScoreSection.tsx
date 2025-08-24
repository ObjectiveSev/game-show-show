import React, { useEffect, useState } from 'react';
import type { ReginaldoHoraDoLancheScoreEntry } from '../../../types/reginaldoHoraDoLanche';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import { loadReginaldoHoraDoLancheScores } from '../../../utils/scoreStorage';

interface ReginaldoHoraDoLancheScoreSectionProps {
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const ReginaldoHoraDoLancheScoreSection: React.FC<ReginaldoHoraDoLancheScoreSectionProps> = ({
    gameState,
    getGameEmoji
}) => {
    const [scores, setScores] = useState<ReginaldoHoraDoLancheScoreEntry[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadScores = async () => {
            try {
                const reginaldoHoraDoLancheScores = loadReginaldoHoraDoLancheScores();
                if (!isMounted) return;
                setScores(reginaldoHoraDoLancheScores);
            } catch (error) {
                if (isMounted) {
                    console.warn('Erro ao carregar scores do Reginaldo Hora do Lanche:', error);
                }
            }
        };

        loadScores();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="historico-subsecao">
            <h3>{getGameEmoji('reginaldo-hora-do-lanche')} Reginaldo Hora do Lanche</h3>
            {scores.length > 0 ? (
                <div className="table-wrapper">
                    <table className="pd-table">
                        <thead>
                            <tr>
                                <th>Comida</th>
                                <th>Time</th>
                                <th>Resultado</th>
                                <th>Pontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, idx) => (
                                <tr key={idx}>
                                    <td className="nome-cell">Comida #{score.id}</td>
                                    <td className="nome-cell">
                                        {getTeamNameFromString(score.timeAdivinhador, gameState.teams)}
                                    </td>
                                    <td className="nome-cell">
                                        {score.resultado === 'acerto' && '✅ Acerto'}
                                        {score.resultado === 'erro' && '❌ Erro'}
                                    </td>
                                    <td className="center">{score.pontos}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="empty">Nenhum registro encontrado</p>
            )}
        </div>
    );
};
