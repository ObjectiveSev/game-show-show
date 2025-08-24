import React, { useEffect, useState } from 'react';
import type { PainelistasScoreEntry, PainelistasPunicaoEntry } from '../../../types/painelistas';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import { loadPainelistasScores, loadPainelistasPunicoes } from '../../../utils/scoreStorage';
import { carregarParticipantes } from '../../../utils/participantesLoader';

interface PainelistasExcentricosScoreSectionProps {
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const PainelistasExcentricosScoreSection: React.FC<PainelistasExcentricosScoreSectionProps> = ({
    gameState,
    getGameEmoji
}) => {
    const [scores, setScores] = useState<PainelistasScoreEntry[]>([]);
    const [punicoes, setPunicoes] = useState<PainelistasPunicaoEntry[]>([]);
    const [nomesParticipantes, setNomesParticipantes] = useState<Record<string, string>>({});

    useEffect(() => {
        let isMounted = true;

        // Carregar scores e punições
        try {
            setScores(loadPainelistasScores());
            setPunicoes(loadPainelistasPunicoes());
        } catch (error) {
            console.warn('Erro ao carregar scores de painelistas:', error);
        }

        // Carregar nomes dos participantes
        const loadParticipantes = async () => {
            try {
                const participantes = await carregarParticipantes();
                if (!isMounted) return;
                
                const nomes = participantes.reduce((acc: Record<string, string>, participante: { id: string; nome: string }) => {
                    acc[participante.id] = participante.nome;
                    return acc;
                }, {});
                setNomesParticipantes(nomes);
            } catch (error) {
                if (isMounted) {
                    console.warn('Erro ao carregar participantes:', error);
                }
            }
        };

        loadParticipantes();

        return () => {
            isMounted = false;
        };
    }, []);

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
