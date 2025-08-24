import React from 'react';
import type { DicionarioScoreEntry } from '../../../types/dicionarioSurreal';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';

interface DicionarioSurrealScoreSectionProps {
    scores: DicionarioScoreEntry[];
    palavras: Record<string, string>;
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const DicionarioSurrealScoreSection: React.FC<DicionarioSurrealScoreSectionProps> = ({
    scores,
    palavras,
    gameState,
    getGameEmoji
}) => {
    return (
        <div className="historico-subsecao">
            <h3>{getGameEmoji('dicionario-surreal')} Dicionário Surreal</h3>
            {scores.length > 0 ? (
                <div className="table-wrapper">
                    <table className="pd-table">
                        <thead>
                            <tr>
                                <th>Palavra</th>
                                <th>Time</th>
                                <th>Acertou</th>
                                <th>Pontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, idx) => (
                                <tr key={idx}>
                                    <td className="nome-cell">{palavras[score.palavraId] || score.palavraId}</td>
                                    <td>{getTeamNameFromString(score.timeAdivinhador, gameState.teams)}</td>
                                    <td>{score.acertou ? '✔ Sim' : '❌ Não'}</td>
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
