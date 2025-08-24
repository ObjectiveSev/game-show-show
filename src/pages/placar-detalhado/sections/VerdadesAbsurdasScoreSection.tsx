import React, { useEffect, useState } from 'react';
import type { VerdadesAbsurdasScoreEntry } from '../../../types/verdadesAbsurdas';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import { loadVerdadesAbsurdasScores } from '../../../utils/scoreStorage';
import { carregarVerdadesAbsurdas } from '../../../utils/verdadesAbsurdasLoader';

interface VerdadesAbsurdasScoreSectionProps {
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const VerdadesAbsurdasScoreSection: React.FC<VerdadesAbsurdasScoreSectionProps> = ({
    gameState,
    getGameEmoji
}) => {
    const [scores, setScores] = useState<VerdadesAbsurdasScoreEntry[]>([]);
    const [titulos, setTitulos] = useState<Record<string, string>>({});

    useEffect(() => {
        let isMounted = true;

        // Carregar scores
        try {
            setScores(loadVerdadesAbsurdasScores());
        } catch (error) {
            console.warn('Erro ao carregar scores de verdades absurdas:', error);
        }

        // Carregar títulos
        const loadTitulos = async () => {
            try {
                const verdades = await carregarVerdadesAbsurdas();
                if (!isMounted) return;
                
                const titulosMap = verdades.verdadesAbsurdas.reduce((acc: Record<string, string>, texto: { id: string; titulo: string }) => {
                    acc[texto.id] = texto.titulo;
                    return acc;
                }, {});
                setTitulos(titulosMap);
            } catch (error) {
                if (isMounted) {
                    console.warn('Erro ao carregar verdades absurdas:', error);
                }
            }
        };

        loadTitulos();

        return () => {
            isMounted = false;
        };
    }, []);

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
