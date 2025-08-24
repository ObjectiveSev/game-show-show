import React, { useEffect, useState } from 'react';
import type { CaroPraChuchuScoreEntry } from '../../../types/caroPraChuchu';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import { loadCaroPraChuchuScores } from '../../../utils/scoreStorage';

interface CaroPraChuchuScoreSectionProps {
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const CaroPraChuchuScoreSection: React.FC<CaroPraChuchuScoreSectionProps> = ({
    gameState,
    getGameEmoji
}) => {
    const [scores, setScores] = useState<CaroPraChuchuScoreEntry[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadScores = async () => {
            try {
                const caroPraChuchuScores = loadCaroPraChuchuScores();
                if (!isMounted) return;
                setScores(caroPraChuchuScores);
            } catch (error) {
                if (isMounted) {
                    console.warn('Erro ao carregar scores do Caro Pra Chuchu:', error);
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
            <h3>{getGameEmoji('caro-pra-chuchu')} Caro Pra Chuchu</h3>
            {scores.length > 0 ? (
                <div className="table-wrapper">
                    <table className="pd-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Time</th>
                                <th>Tipo de Acerto</th>
                                <th>Pontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, idx) => (
                                <tr key={idx}>
                                    <td className="nome-cell">{score.nomeItem}</td>
                                    <td className="nome-cell">
                                        {getTeamNameFromString(score.timeAdivinhador, gameState.teams)}
                                    </td>
                                    <td className="nome-cell">
                                        {score.tipoAcerto === 'moedaCorreta' && '🪙 Moeda Correta'}
                                        {score.tipoAcerto === 'pertoSuficiente' && '🎯 Perto Suficiente'}
                                        {score.tipoAcerto === 'acertoLendario' && '⭐ Acerto Lendário'}
                                        {score.tipoAcerto === 'erro' && '❌ Errou'}
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
