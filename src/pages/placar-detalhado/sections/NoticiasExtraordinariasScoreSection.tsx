import React from 'react';
import type { NoticiasExtraordinariasScoreEntry } from '../../../types/noticiasExtraordinarias';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';

interface NoticiasExtraordinariasScoreSectionProps {
    scores: NoticiasExtraordinariasScoreEntry[];
    manchetes: Record<string, string>;
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const NoticiasExtraordinariasScoreSection: React.FC<NoticiasExtraordinariasScoreSectionProps> = ({
    scores,
    manchetes,
    gameState,
    getGameEmoji
}) => {
    return (
        <div className="historico-subsecao">
            <h3>{getGameEmoji('noticias-extraordinarias')} Notícias Extraordinárias</h3>
            {scores.length > 0 ? (
                <div className="table-wrapper">
                    <table className="pd-table">
                        <thead>
                            <tr>
                                <th>Manchete</th>
                                <th>Time</th>
                                <th>Acertou</th>
                                <th>Pontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, idx) => (
                                <tr key={idx}>
                                    <td className="nome-cell">
                                        {(manchetes[score.noticiaId] || score.manchete).substring(0, 40)}...
                                    </td>
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
