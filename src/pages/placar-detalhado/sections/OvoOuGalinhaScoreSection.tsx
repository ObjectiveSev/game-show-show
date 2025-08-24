import React, { useEffect, useState } from 'react';
import type { OvoOuGalinhaScoreEntry } from '../../../types/ovoOuGalinha';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import { loadOvoOuGalinhaScores } from '../../../utils/scoreStorage';

interface OvoOuGalinhaScoreSectionProps {
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const OvoOuGalinhaScoreSection: React.FC<OvoOuGalinhaScoreSectionProps> = ({
    gameState,
    getGameEmoji
}) => {
    const [scores, setScores] = useState<OvoOuGalinhaScoreEntry[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadScores = async () => {
            try {
                const ovoOuGalinhaScores = loadOvoOuGalinhaScores();
                if (!isMounted) return;
                setScores(ovoOuGalinhaScores);
            } catch (error) {
                if (isMounted) {
                    console.warn('Erro ao carregar scores do Ovo ou Galinha:', error);
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
            <h3>{getGameEmoji('ovo-ou-galinha')} Ovo ou Galinha</h3>
            {scores.length > 0 ? (
                <div className="table-wrapper">
                    <table className="pd-table">
                        <thead>
                            <tr>
                                <th>Trio</th>
                                <th>Time</th>
                                <th>Resultado</th>
                                <th>Pontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, idx) => (
                                <tr key={idx}>
                                    <td className="nome-cell">Trio #{score.trioId}</td>
                                    <td className="nome-cell">
                                        {getTeamNameFromString(score.timeAdivinhador, gameState.teams)}
                                    </td>
                                    <td className="nome-cell">
                                        {score.pontos > 0 ? '✅ Acerto' : '❌ Erro'}
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
