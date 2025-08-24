import React from 'react';
import type { PainelistasScoreEntry, PainelistasPunicaoEntry } from '../../../types/painelistas';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';

interface PainelistasExcentricosScoreSectionProps {
    scores: PainelistasScoreEntry[];
    punicoes: PainelistasPunicaoEntry[];
    nomesParticipantes: Record<string, string>;
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const PainelistasExcentricosScoreSection: React.FC<PainelistasExcentricosScoreSectionProps> = ({
    scores,
    punicoes,
    nomesParticipantes,
    gameState,
    getGameEmoji
}) => {
    return (
        <>
            {/* Painelistas Excêntricos - Fatos */}
            <div className="historico-subsecao">
                <h3>{getGameEmoji('painelistas-excentricos')} Painelistas Excêntricos</h3>
                {scores.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="pd-table">
                                                            <thead>
                                    <tr>
                                        <th>Participante</th>
                                        <th>Fato</th>
                                        <th>Time</th>
                                        <th>Resultado</th>
                                        <th>Pontos</th>
                                    </tr>
                                </thead>
                            <tbody>
                                {scores.map((score, idx) => (
                                    <tr key={idx}>
                                        <td className="nome-cell">
                                            {nomesParticipantes[score.participanteId] || score.participanteId}
                                        </td>
                                        <td className="nome-cell">{score.fatoTexto.substring(0, 30)}...</td>
                                        <td>{getTeamNameFromString(score.timeAdivinhador, gameState.teams)}</td>
                                        <td>{score.acertou ? '✔ Acertou' : '❌ Errou'}</td>
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

            {/* Punições dos Painelistas */}
            {punicoes.length > 0 && (
                <div className="historico-subsecao">
                    <h3>Punições - Painelistas Excêntricos</h3>
                    <div className="table-wrapper">
                        <table className="pd-table">
                            <thead>
                                <tr>
                                    <th>Jogador</th>
                                    <th>Time</th>
                                    <th>Pontos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {punicoes.map((punicao, idx) => (
                                    <tr key={idx}>
                                        <td className="nome-cell">{nomesParticipantes[punicao.participanteId] || punicao.participanteId}</td>
                                        <td>{getTeamNameFromString(punicao.time, gameState.teams)}</td>
                                        <td className="center">{punicao.pontos}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};
