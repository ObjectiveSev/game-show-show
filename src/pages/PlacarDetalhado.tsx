import React, { useMemo, useEffect, useState } from 'react';
import { loadVerdadesAbsurdasScores, loadDicionarioSurrealScores, loadPainelistasScores, loadPainelistasPunicoes } from '../utils/scoreStorage';
import { useGameState } from '../hooks/useGameState';
import { BackButton } from '../components/common/BackButton';
import { carregarVerdadesAbsurdas } from '../utils/verdadesAbsurdasLoader';
import { carregarDicionarioSurreal } from '../utils/dicionarioLoader';
import { carregarParticipantes } from '../utils/participantesLoader';
import type { GamesConfig, GameConfig } from '../types/games';
import type { DicionarioScoreEntry } from '../types/dicionarioSurreal';
import { API_ENDPOINTS } from '../constants';
import '../styles/PlacarDetalhado.css';

export const PlacarDetalhado: React.FC = () => {
    const { gameState } = useGameState();

    const verdadesEntries = loadVerdadesAbsurdasScores();
    const dicionarioEntries = loadDicionarioSurrealScores();
    const painelistasEntries = loadPainelistasScores();
    const punicoes = loadPainelistasPunicoes();
    const [gamesConfig, setGamesConfig] = useState<GamesConfig>({ games: [] });
    const [participantes, setParticipantes] = useState<Record<string, string>>({});
    const [titulosVerdades, setTitulosVerdades] = useState<Record<string, string>>({});
    const [palavrasDicionario, setPalavrasDicionario] = useState<Record<string, string>>({});

    useEffect(() => {
        let isMounted = true;

        fetch(API_ENDPOINTS.GAMES_CONFIG)
            .then(res => res.json())
            .then((data: GamesConfig) => {
                if (!isMounted) return;
                setGamesConfig(data);
            })
            .catch((error) => {
                console.error('❌ Erro ao carregar games.json:', error);
            });

        carregarParticipantes()
            .then(ps => {
                if (!isMounted) return;
                const map: Record<string, string> = {};
                ps.forEach(p => { map[p.id] = p.nome; });
                setParticipantes(map);
            })
            .catch(() => { });

        carregarVerdadesAbsurdas()
            .then(data => {
                if (!isMounted) return;
                const map: Record<string, string> = {};
                data.verdadesAbsurdas.forEach(t => { map[t.id] = t.titulo; });
                setTitulosVerdades(map);
            })
            .catch(() => { });

        carregarDicionarioSurreal()
            .then(data => {
                if (!isMounted) return;
                const map: Record<string, string> = {};
                data.palavras.forEach(p => { map[p.id] = p.palavra; });
                setPalavrasDicionario(map);
            })
            .catch(() => { });

        return () => { isMounted = false; };
    }, []);

    const totaisPorJogo = useMemo(() => {
        return {
            'verdades-absurdas': gameState.gameScores['verdades-absurdas'] || { teamA: 0, teamB: 0 },
            'dicionario-surreal': gameState.gameScores['dicionario-surreal'] || { teamA: 0, teamB: 0 },
            'painelistas-excentricos': gameState.gameScores['painelistas-excentricos'] || { teamA: 0, teamB: 0 }
        };
    }, [gameState.gameScores]);

    const totaisGerais = useMemo(() => {
        return {
            A: Object.values(totaisPorJogo).reduce((acc, jogo) => acc + jogo.teamA, 0),
            B: Object.values(totaisPorJogo).reduce((acc, jogo) => acc + jogo.teamB, 0)
        };
    }, [totaisPorJogo]);

    const getGameConfig = (gameId: string): GameConfig | undefined => {
        if (!gamesConfig) {
            return undefined;
        }

        if (!gamesConfig.games) {
            return undefined;
        }

        if (!Array.isArray(gamesConfig.games)) {
            return undefined;
        }

        return gamesConfig.games.find(game => game.id === gameId);
    };

    return (
        <div className="placar-detalhado">
            <BackButton />
            <header className="pd-header">
                <h1>📊 Placar Detalhado</h1>
                <p>Veja os registros das partidas e a soma de pontos por time</p>
            </header>

            <section className="totais-section">
                <h2>🏆 Placar Geral</h2>
                <div className="totais-container">
                    <div className="total-card">
                        <span className="label">{gameState.teams.teamA.name || 'Time A'}</span>
                        <span className="valor">{totaisGerais.A}</span>
                    </div>
                    <div className="total-card">
                        <span className="label">{gameState.teams.teamB.name || 'Time B'}</span>
                        <span className="valor">{totaisGerais.B}</span>
                    </div>
                </div>
            </section>

            <section className="historico-principal-section">
                <h2>📝 Histórico Detalhado</h2>
                <p className="historico-descricao">Registros completos de todas as partidas e pontuações</p>

                {/* Verdades Absurdas */}
                <div className="historico-subsecao">
                    <h3>{getGameConfig('verdades-absurdas')?.emoji || '🎭'} {getGameConfig('verdades-absurdas')?.name || 'Verdades Absurdas'}</h3>
                    {verdadesEntries.length === 0 ? (
                        <div className="empty">Nenhum registro salvo ainda.</div>
                    ) : (
                        <div className="table-wrapper">
                            <h4 className="tabela-subtitulo">🎯 Fatos Jogados</h4>
                            <table className="pd-table">
                                <thead>
                                    <tr>
                                        <th>Texto</th>
                                        <th>Time Leitor</th>
                                        <th>Time Adivinhador</th>
                                        <th className="right">Verdades Encontradas</th>
                                        <th className="right">Verdades Não Encontradas</th>
                                        <th className="right">Erros</th>
                                        <th className="right">Pontos Leitor</th>
                                        <th className="right">Pontos Adivinhador</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {verdadesEntries.map((e, idx) => (
                                        <tr key={idx}>
                                            <td className="nome-cell">{titulosVerdades[e.textoId] || e.textoId}</td>
                                            <td>{e.timeLeitor === 'A' ? (gameState.teams.teamA.name || 'Time A') : (gameState.teams.teamB.name || 'Time B')}</td>
                                            <td>{e.timeAdivinhador === 'A' ? (gameState.teams.teamA.name || 'Time A') : (gameState.teams.teamB.name || 'Time B')}</td>
                                            <td className="right">{e.verdadesEncontradas}</td>
                                            <td className="right">{e.verdadesNaoEncontradas}</td>
                                            <td className="right">{e.erros}</td>
                                            <td className="right">{e.pontosLeitor}</td>
                                            <td className="right">{e.pontosAdivinhador}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Dicionário Surreal */}
                <div className="historico-subsecao">
                    <h3>{getGameConfig('dicionario-surreal')?.emoji || '📚'} {getGameConfig('dicionario-surreal')?.name || 'Dicionário Surreal'}</h3>
                    {dicionarioEntries.length === 0 ? (
                        <div className="empty">Nenhum registro salvo ainda.</div>
                    ) : (
                        <div className="table-wrapper">
                            <h4 className="tabela-subtitulo">📖 Palavras Jogadas</h4>
                            <table className="pd-table">
                                <thead>
                                    <tr>
                                        <th>Palavra</th>
                                        <th>Time Adivinhador</th>
                                        <th className="right">Pontos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dicionarioEntries.map((e: DicionarioScoreEntry, idx: number) => (
                                        <tr key={idx}>
                                            <td className="nome-cell">{palavrasDicionario[e.palavraId] || e.palavraId}</td>
                                            <td>{e.timeAdivinhador === 'A' ? (gameState.teams.teamA.name || 'Time A') : (gameState.teams.teamB.name || 'Time B')}</td>
                                            <td className="right">{e.pontos}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Painelistas Excêntricos */}
                <div className="historico-subsecao">
                    <h3>{getGameConfig('painelistas-excentricos')?.emoji || '🎪'} {getGameConfig('painelistas-excentricos')?.name || 'Painelistas Excêntricos'}</h3>
                    {painelistasEntries.length === 0 ? (
                        <div className="empty">Nenhum registro salvo ainda.</div>
                    ) : (
                        <div className="table-wrapper">
                            <h4 className="tabela-subtitulo">🎯 Fatos Jogados</h4>
                            <table className="pd-table">
                                <thead>
                                    <tr>
                                        <th>Participante</th>
                                        <th>Fato</th>
                                        <th>Time do Participante</th>
                                        <th>Time Adivinhador</th>
                                        <th className="right">Acertou?</th>
                                        <th className="right">Pontos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {painelistasEntries.map((e, idx) => {
                                        const fatoIndex = e.fatoId.replace('f', '');

                                        return (
                                            <tr key={idx}>
                                                <td className="nome-cell">{e.participanteNome}</td>
                                                <td className="fato-index">Fato {fatoIndex}</td>
                                                <td>{e.timeParticipante === 'A' ? (gameState.teams.teamA.name || 'Time A') : (gameState.teams.teamB.name || 'Time B')}</td>
                                                <td>{e.timeAdivinhador === 'A' ? (gameState.teams.teamA.name || 'Time A') : (gameState.teams.teamB.name || 'Time B')}</td>
                                                <td className="right">{e.acertou ? 'Sim' : 'Não'}</td>
                                                <td className="right">{e.pontos}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {punicoes.length === 0 ? (
                        <div className="empty">Nenhuma punição aplicada ainda.</div>
                    ) : (
                        <div className="table-wrapper" style={{ marginTop: '20px' }}>
                            <h4 className="tabela-subtitulo">⚠️ Punições Aplicadas</h4>
                            <table className="pd-table">
                                <thead>
                                    <tr>
                                        <th>Participante</th>
                                        <th>Time</th>
                                        <th className="right">Pontos Perdidos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {punicoes.map((p, idx) => (
                                        <tr key={idx} className="punicao-row">
                                            <td>{participantes[p.participanteId] || p.participanteId}</td>
                                            <td>{p.time === 'A' ? (gameState.teams.teamA.name || 'Time A') : (gameState.teams.teamB.name || 'Time B')}</td>
                                            <td className="right pontos-negativos">{p.pontos}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

