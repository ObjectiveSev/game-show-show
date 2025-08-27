import React, { useEffect, useState } from 'react';
import type { MaestroBillyScoreEntry } from '../../../types/maestroBilly';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import { loadMaestroBillyScores } from '../../../utils/scoreStorage';
import { GAME_IDS } from '../../../constants';

interface MaestroBillyScoreSectionProps {
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const MaestroBillyScoreSection: React.FC<MaestroBillyScoreSectionProps> = ({
    gameState,
    getGameEmoji
}) => {
    const [scores, setScores] = useState<MaestroBillyScoreEntry[]>([]);

    useEffect(() => {
        let isMounted = true;

        const loadScores = async () => {
            try {
                const maestroBillyScores = loadMaestroBillyScores();
                if (!isMounted) return;
                setScores(maestroBillyScores);
            } catch (error) {
                if (isMounted) {
                    console.warn('Erro ao carregar scores do Maestro Billy:', error);
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
            <h3>{getGameEmoji(GAME_IDS.MAESTRO_BILLY)} Maestro Billy</h3>
            {scores.length > 0 ? (
                <div className="table-wrapper">
                    <table className="pd-table">
                        <thead>
                            <tr>
                                <th>Música</th>
                                <th>Artista</th>
                                <th>Time</th>
                                <th>Tentativa</th>
                                <th>Tipo</th>
                                <th>Bate Pronto</th>
                                <th>Pontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, idx) => (
                                <tr key={idx}>
                                    <td className="nome-cell">{score.nomeMusica}</td>
                                    <td className="nome-cell">{score.artista}</td>
                                    <td className="nome-cell">
                                        {getTeamNameFromString(score.timeAdivinhador, gameState.teams)}
                                    </td>
                                    <td className="center">{score.tentativa}ª</td>
                                    <td className="nome-cell">
                                        {score.acertouNome && score.acertouArtista && '🎉 Ambos'}
                                        {score.acertouNome && !score.acertouArtista && '🎵 Música'}
                                        {!score.acertouNome && score.acertouArtista && '🎤 Artista'}
                                        {!score.acertouNome && !score.acertouArtista && '❌ Erro'}
                                    </td>
                                    <td className="center">
                                        {score.batePronto ? '✅ Sim' : '❌ Não'}
                                    </td>
                                    <td className="center">{score.totalPontos}</td>
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
