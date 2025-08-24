import React, { useEffect, useState } from 'react';
import type { QuemEEssePokemonScoreEntry } from '../../../types/quemEEssePokemon';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import { loadQuemEEssePokemonScores } from '../../../utils/scoreStorage';

interface QuemEEssePokemonScoreSectionProps {
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const QuemEEssePokemonScoreSection: React.FC<QuemEEssePokemonScoreSectionProps> = ({
    gameState,
    getGameEmoji
}) => {
    const [scores, setScores] = useState<QuemEEssePokemonScoreEntry[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadScores = async () => {
            try {
                const quemEEssePokemonScores = loadQuemEEssePokemonScores();
                if (!isMounted) return;
                setScores(quemEEssePokemonScores);
            } catch (error) {
                if (isMounted) {
                    console.warn('Erro ao carregar scores do Quem É Esse Pokémon:', error);
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
            <h3>{getGameEmoji('quem-e-esse-pokemon')} Quem É Esse Pokémon</h3>
            {scores.length > 0 ? (
                <div className="table-wrapper">
                    <table className="pd-table">
                        <thead>
                            <tr>
                                <th>Pokémon</th>
                                <th>Time</th>
                                <th>Resultado</th>
                                <th>Pontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, idx) => (
                                <tr key={idx}>
                                    <td className="nome-cell">Pokémon #{score.pokemonId}</td>
                                    <td className="nome-cell">
                                        {getTeamNameFromString(score.timeAdivinhador, gameState.teams)}
                                    </td>
                                    <td className="nome-cell">
                                        {score.resultado === 'acerto' && '✅ Acerto'}
                                        {score.resultado === 'erro' && '❌ Erro'}
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
