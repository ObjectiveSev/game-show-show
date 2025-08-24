import React from 'react';
import type { QuemEEssePokemonScoreEntry } from '../../../types/quemEEssePokemon';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';

interface QuemEEssePokemonScoreSectionProps {
    scores: QuemEEssePokemonScoreEntry[];
    nomesPokemon: Record<string, string>;
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const QuemEEssePokemonScoreSection: React.FC<QuemEEssePokemonScoreSectionProps> = ({
    scores,
    nomesPokemon,
    gameState,
    getGameEmoji
}) => {
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
                                <th>Acertou</th>
                                <th>Pontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, idx) => (
                                <tr key={idx}>
                                    <td className="nome-cell">{nomesPokemon[score.pokemonId] || score.pokemonId}</td>
                                    <td>{getTeamNameFromString(score.timeAdivinhador, gameState.teams)}</td>
                                    <td>{score.resultado === 'acerto' ? '✔ Sim' : '❌ Não'}</td>
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
