import React from 'react';
import type { OvoOuGalinhaScoreEntry } from '../../../types/ovoOuGalinha';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';

interface OvoOuGalinhaScoreSectionProps {
    scores: OvoOuGalinhaScoreEntry[];
    trios: Record<string, string>;
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const OvoOuGalinhaScoreSection: React.FC<OvoOuGalinhaScoreSectionProps> = ({
    scores,
    trios,
    gameState,
    getGameEmoji
}) => {
    return (
        <div className="historico-subsecao">
            <h3>{getGameEmoji('ovo-ou-galinha')} Ovo ou Galinha</h3>
            {scores.length > 0 ? (
                <div className="table-wrapper">
                    <table className="pd-table">
                        <thead>
                            <tr>
                                <th>Trio</th>
                                <th>Time</th>
                                <th>Acertou</th>
                                <th>Pontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, idx) => (
                                <tr key={idx}>
                                    <td className="nome-cell">
                                        {trios[score.trioId.toString()] || `Trio #${score.trioId}`}
                                    </td>
                                    <td>{getTeamNameFromString(score.timeAdivinhador, gameState.teams)}</td>
                                    <td>{score.pontos > 0 ? '✔ Sim' : '❌ Não'}</td>
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
