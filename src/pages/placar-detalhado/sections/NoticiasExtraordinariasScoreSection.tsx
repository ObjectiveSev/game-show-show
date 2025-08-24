import React, { useEffect, useState } from 'react';
import type { NoticiasExtraordinariasScoreEntry } from '../../../types/noticiasExtraordinarias';
import type { AppState } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import { loadNoticiasExtraordinariasScores } from '../../../utils/scoreStorage';
import { carregarNoticiasExtraordinarias } from '../../../utils/noticiasExtraordinariasLoader';

interface NoticiasExtraordinariasScoreSectionProps {
    gameState: AppState;
    getGameEmoji: (gameId: string) => string;
}

export const NoticiasExtraordinariasScoreSection: React.FC<NoticiasExtraordinariasScoreSectionProps> = ({
    gameState,
    getGameEmoji
}) => {
    const [scores, setScores] = useState<NoticiasExtraordinariasScoreEntry[]>([]);
    const [manchetes, setManchetes] = useState<Record<string, string>>({});

    useEffect(() => {
        let isMounted = true;

        // Carregar scores
        try {
            setScores(loadNoticiasExtraordinariasScores());
        } catch (error) {
            console.warn('Erro ao carregar scores de notícias extraordinárias:', error);
        }

        // Carregar manchetes
        const loadManchetes = async () => {
            try {
                const noticias = await carregarNoticiasExtraordinarias();
                if (!isMounted) return;
                
                const manchetesMap = noticias.noticias.reduce((acc: Record<string, string>, noticia: { id: string; manchete: string }) => {
                    acc[noticia.id] = noticia.manchete;
                    return acc;
                }, {});
                setManchetes(manchetesMap);
            } catch (error) {
                if (isMounted) {
                    console.warn('Erro ao carregar notícias extraordinárias:', error);
                }
            }
        };

        loadManchetes();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="historico-subsecao">
            <h3>{getGameEmoji('noticias-extraordinarias')} Notícias Extraordinárias</h3>
            {scores.length > 0 ? (
                <div className="table-wrapper">
                    <table className="pd-table">
                        <thead>
                            <tr>
                                <th>Manchete</th>
                                <th>Time</th>
                                <th>Acertou</th>
                                <th>Pontos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score, idx) => (
                                <tr key={idx}>
                                    <td className="nome-cell">
                                        {(manchetes[score.noticiaId] || score.manchete).substring(0, 40)}...
                                    </td>
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
