import React from 'react';
import type { VerdadesAbsurdasScoreEntry } from '../../../types/verdadesAbsurdas';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';

interface VerdadesAbsurdasScoreSectionProps {
    scores: VerdadesAbsurdasScoreEntry[];
    titulos: Record<string, string>;
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const VerdadesAbsurdasScoreSection: React.FC<VerdadesAbsurdasScoreSectionProps> = ({
    scores,
    titulos,
    gameState,
    getGameEmoji
}) => {
    return (
        <div className="historico-subsecao">
            <h3>{getGameEmoji('verdades-absurdas')} Verdades Absurdas</h3>
            {scores.length > 0 ? (
                <div className="table-wrapper">
                    <table className="pd-table">
                        <thead>
                            <tr>
                                <th>Texto</th>
                                <th>Time Leitor</th>
                                <th>Pontos Leitor</th>
                                <th>Time Adivinhador</th>
                                <th>Pontos Adivinhador</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, idx) => (
                                <tr key={idx}>
                                    <td className="nome-cell">{titulos[score.textoId] || score.textoId}</td>
                                    <td>{getTeamNameFromString(score.timeLeitor, gameState.teams)}</td>
                                    <td className="center">{score.pontosLeitor}</td>
                                    <td>{getTeamNameFromString(score.timeAdivinhador, gameState.teams)}</td>
                                    <td className="center">{score.pontosAdivinhador}</td>
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
