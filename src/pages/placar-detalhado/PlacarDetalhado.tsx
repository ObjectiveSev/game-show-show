import React, { useEffect, useState } from 'react';
import type { AppState } from '../../types';
import type { VerdadesAbsurdasScoreEntry } from '../../types/verdadesAbsurdas';
import type { DicionarioScoreEntry } from '../../types/dicionarioSurreal';
import type { PainelistasScoreEntry } from '../../types/painelistas';
import type { NoticiasExtraordinariasScoreEntry } from '../../types/noticiasExtraordinarias';
import type { CaroPraChuchuScoreEntry } from '../../types/caroPraChuchu';
import type { GamesConfig } from '../../types/games';
import { loadVerdadesAbsurdasScores } from '../../utils/scoreStorage';
import { loadDicionarioSurrealScores } from '../../utils/scoreStorage';
import { loadPainelistasScores } from '../../utils/scoreStorage';
import { loadNoticiasExtraordinariasScores } from '../../utils/scoreStorage';
import { loadCaroPraChuchuScores } from '../../utils/scoreStorage';
import { carregarVerdadesAbsurdas } from '../../utils/verdadesAbsurdasLoader';
import { carregarDicionarioSurreal } from '../../utils/dicionarioLoader';
import { carregarNoticiasExtraordinarias } from '../../utils/noticiasExtraordinariasLoader';
import { carregarConfiguracaoJogos } from '../../utils/gamesLoader';
import { getTeamNameFromString } from '../../utils/teamUtils';
import { BackButton } from '../../components/back-button/BackButton';
import './PlacarDetalhado.css';

interface Props {
    gameState: AppState;
}

export const PlacarDetalhado: React.FC<Props> = ({ gameState }) => {
    const [verdadesAbsurdasScores, setVerdadesAbsurdasScores] = useState<VerdadesAbsurdasScoreEntry[]>([]);
    const [dicionarioSurrealScores, setDicionarioSurrealScores] = useState<DicionarioScoreEntry[]>([]);
    const [painelistasScores, setPainelistasScores] = useState<PainelistasScoreEntry[]>([]);
    const [noticiasExtraordinariasScores, setNoticiasExtraordinariasScores] = useState<NoticiasExtraordinariasScoreEntry[]>([]);
    const [caroPraChuchuScores, setCaroPraChuchuScores] = useState<CaroPraChuchuScoreEntry[]>([]);
    const [titulosVerdades, setTitulosVerdades] = useState<Record<string, string>>({});
    const [palavrasDicionario, setPalavrasDicionario] = useState<Record<string, string>>({});
    const [manchetesNoticias, setManchetesNoticias] = useState<Record<string, string>>({});
    const [gamesConfig, setGamesConfig] = useState<GamesConfig | null>(null);

    useEffect(() => {
        // Carregar scores
        setVerdadesAbsurdasScores(loadVerdadesAbsurdasScores());
        setDicionarioSurrealScores(loadDicionarioSurrealScores());
        setPainelistasScores(loadPainelistasScores());
        setNoticiasExtraordinariasScores(loadNoticiasExtraordinariasScores());
        setCaroPraChuchuScores(loadCaroPraChuchuScores());

        // Carregar dados para mapear IDs para nomes
        (async () => {
            try {
                const verdades = await carregarVerdadesAbsurdas();
                const titulos = verdades.verdadesAbsurdas.reduce((acc: Record<string, string>, texto: { id: string; titulo: string }) => {
                    acc[texto.id] = texto.titulo;
                    return acc;
                }, {});
                setTitulosVerdades(titulos);
            } catch (error) {
                console.error('Erro ao carregar verdades absurdas:', error);
            }

            try {
                const dicionario = await carregarDicionarioSurreal();
                const palavras = dicionario.palavras.reduce((acc: Record<string, string>, palavra: { id: string; palavra: string }) => {
                    acc[palavra.id] = palavra.palavra;
                    return acc;
                }, {});
                setPalavrasDicionario(palavras);
            } catch (error) {
                console.error('Erro ao carregar dicionário surreal:', error);
            }

            try {
                const noticias = await carregarNoticiasExtraordinarias();
                const manchetes = noticias.noticias.reduce((acc: Record<string, string>, noticia: { id: string; manchete: string }) => {
                    acc[noticia.id] = noticia.manchete;
                    return acc;
                }, {});
                setManchetesNoticias(manchetes);
            } catch (error) {
                console.error('Erro ao carregar notícias extraordinárias:', error);
            }

            try {
                const games = await carregarConfiguracaoJogos();
                setGamesConfig(games);
            } catch (error) {
                console.error('Erro ao carregar configuração dos jogos:', error);
            }
        })();
    }, []);

    const getGameEmoji = (gameId: string) => {
        if (!gamesConfig) return '🎮';
        const game = gamesConfig.games.find((g: { id: string; emoji: string }) => g.id === gameId);
        return game?.emoji || '🎮';
    };

    return (
        <div className="placar-detalhado">
            <BackButton />
            <div className="pd-header">
                <h1>🏆 Placar Detalhado</h1>
                <p>Histórico completo de todas as pontuações</p>
            </div>

            <div className="historico-principal-section">
                <h2>🏆 Placar Geral</h2>
                <div className="totais-container">
                    <div className="total-card">
                        <span className="label">Time A: {getTeamNameFromString('A', gameState.teams)}</span>
                        <span className="valor">{gameState.teams.teamA.score} pontos</span>
                    </div>
                    <div className="total-card">
                        <span className="label">Time B: {getTeamNameFromString('B', gameState.teams)}</span>
                        <span className="valor">{gameState.teams.teamB.score} pontos</span>
                    </div>
                </div>

                <h2>📰 Histórico Detalhado</h2>
                <p className="historico-descricao">Registro completo de todas as pontuações por jogo</p>

                {/* Verdades Absurdas */}
                <div className="historico-subsecao">
                    <h3>{getGameEmoji('verdades-absurdas')} Verdades Absurdas</h3>
                    {verdadesAbsurdasScores.length > 0 ? (
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
                                    {verdadesAbsurdasScores.map((score, idx) => (
                                        <tr key={idx}>
                                            <td className="nome-cell">{titulosVerdades[score.textoId] || score.textoId}</td>
                                            <td>{getTeamNameFromString(gameState.teams.teamA.members.includes(score.timeLeitor) ? 'A' : 'B', gameState.teams)}</td>
                                            <td className="center">{score.pontosLeitor}</td>
                                            <td>{getTeamNameFromString(gameState.teams.teamA.members.includes(score.timeAdivinhador) ? 'A' : 'B', gameState.teams)}</td>
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

                {/* Dicionário Surreal */}
                <div className="historico-subsecao">
                    <h3>{getGameEmoji('dicionario-surreal')} Dicionário Surreal</h3>
                    {dicionarioSurrealScores.length > 0 ? (
                        <div className="table-wrapper">
                            <table className="pd-table">
                                <thead>
                                    <tr>
                                        <th>Palavra</th>
                                        <th>Time</th>
                                        <th>Pontos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dicionarioSurrealScores.map((score, idx) => (
                                        <tr key={idx}>
                                            <td className="nome-cell">{palavrasDicionario[score.palavraId] || score.palavraId}</td>
                                            <td>{getTeamNameFromString(gameState.teams.teamA.members.includes(score.timeAdivinhador) ? 'A' : 'B', gameState.teams)}</td>
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

                {/* Painelistas Excêntricos */}
                <div className="historico-subsecao">
                    <h3>{getGameEmoji('painelistas-excentricos')} Painelistas Excêntricos</h3>
                    {painelistasScores.length > 0 ? (
                        <div className="table-wrapper">
                            <table className="pd-table">
                                <thead>
                                    <tr>
                                        <th>Jogador</th>
                                        <th>Fato</th>
                                        <th>Time</th>
                                        <th>Pontos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {painelistasScores.map((score, idx) => (
                                        <tr key={idx}>
                                            <td className="nome-cell">{score.participanteNome}</td>
                                            <td className="fato-cell">{score.fatoTexto}</td>
                                            <td>{getTeamNameFromString(gameState.teams.teamA.members.includes(score.timeAdivinhador) ? 'A' : 'B', gameState.teams)}</td>
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

                {/* Notícias Extraordinárias */}
                <div className="historico-subsecao">
                    <h3>{getGameEmoji('noticias-extraordinarias')} Notícias Extraordinárias</h3>
                    {noticiasExtraordinariasScores.length > 0 ? (
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
                                    {noticiasExtraordinariasScores.map((score, idx) => (
                                        <tr key={idx}>
                                            <td className="nome-cell">
                                                {(manchetesNoticias[score.noticiaId] || score.manchete).substring(0, 40)}...
                                            </td>
                                            <td>{getTeamNameFromString(gameState.teams.teamA.members.includes(score.timeAdivinhador) ? 'A' : 'B', gameState.teams)}</td>
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

                {/* Caro Pra Chuchu */}
                <div className="historico-subsecao">
                    <h3>{getGameEmoji('caro-pra-chuchu')} Caro Pra Chuchu</h3>
                    {caroPraChuchuScores.length > 0 ? (
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
                                    {caroPraChuchuScores.map((score, idx) => (
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
            </div>
        </div>
    );
};

