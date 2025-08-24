import React, { useEffect, useState } from 'react';
import type { DicionarioScoreEntry } from '../../../types/dicionarioSurreal';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import { loadDicionarioSurrealScores } from '../../../utils/scoreStorage';
import { carregarDicionarioSurreal } from '../../../utils/dicionarioLoader';

interface DicionarioSurrealScoreSectionProps {
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const DicionarioSurrealScoreSection: React.FC<DicionarioSurrealScoreSectionProps> = ({
    gameState,
    getGameEmoji
}) => {
    const [scores, setScores] = useState<DicionarioScoreEntry[]>([]);
    const [palavras, setPalavras] = useState<Record<string, string>>({});

    useEffect(() => {
        let isMounted = true;

        // Carregar scores
        try {
            setScores(loadDicionarioSurrealScores());
        } catch (error) {
            console.warn('Erro ao carregar scores de dicionário surreal:', error);
        }

        // Carregar palavras
        const loadPalavras = async () => {
            try {
                const dicionario = await carregarDicionarioSurreal();
                if (!isMounted) return;
                
                const palavrasMap = dicionario.palavras.reduce((acc: Record<string, string>, palavra: { id: string; palavra: string }) => {
                    acc[palavra.id] = palavra.palavra;
                    return acc;
                }, {});
                setPalavras(palavrasMap);
            } catch (error) {
                if (isMounted) {
                    console.warn('Erro ao carregar dicionário surreal:', error);
                }
            }
        };

        loadPalavras();

        return () => {
            isMounted = false;
        };
    }, []);

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
