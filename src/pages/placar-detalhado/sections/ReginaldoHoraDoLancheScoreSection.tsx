import React from 'react';
import type { ReginaldoHoraDoLancheScoreEntry } from '../../../types/reginaldoHoraDoLanche';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';

interface ReginaldoHoraDoLancheScoreSectionProps {
    scores: ReginaldoHoraDoLancheScoreEntry[];
    nomesComidas: Record<string, string>;
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const ReginaldoHoraDoLancheScoreSection: React.FC<ReginaldoHoraDoLancheScoreSectionProps> = ({
    scores,
    nomesComidas,
    gameState,
    getGameEmoji
}) => {
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
                                <th>Acertou</th>
                                <th>Pontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, idx) => (
                                <tr key={idx}>
                                    <td className="nome-cell">{nomesComidas[score.id] || score.nome}</td>
                                    <td>{getTeamNameFromString(score.timeAdivinhador, gameState.teams)}</td>
                                    <td>{score.resultado === 'acerto' ? '✔ Sim' : '❌ Não'}</td>
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
