import React, { useEffect, useState } from 'react';
import type { AppState } from '../../types';
import type { VerdadesAbsurdasScoreEntry } from '../../types/verdadesAbsurdas';
import type { DicionarioScoreEntry } from '../../types/dicionarioSurreal';
import type { PainelistasScoreEntry, PainelistasPunicaoEntry } from '../../types/painelistas';
import type { NoticiasExtraordinariasScoreEntry } from '../../types/noticiasExtraordinarias';
import type { CaroPraChuchuScoreEntry } from '../../types/caroPraChuchu';
import type { OvoOuGalinhaScoreEntry } from '../../types/ovoOuGalinha';
import type { QuemEEssePokemonScoreEntry } from '../../types/quemEEssePokemon';
import type { ReginaldoHoraDoLancheScoreEntry } from '../../types/reginaldoHoraDoLanche';
import type { GamesConfig } from '../../types/games';
import { loadVerdadesAbsurdasScores } from '../../utils/scoreStorage';
import { loadDicionarioSurrealScores } from '../../utils/scoreStorage';
import { loadPainelistasScores, loadPainelistasPunicoes } from '../../utils/scoreStorage';
import { loadNoticiasExtraordinariasScores } from '../../utils/scoreStorage';
import { loadCaroPraChuchuScores } from '../../utils/scoreStorage';
import { loadOvoOuGalinhaScores } from '../../utils/scoreStorage';
import { loadQuemEEssePokemonScores } from '../../utils/scoreStorage';
import { loadReginaldoHoraDoLancheScores } from '../../utils/scoreStorage';
import { carregarVerdadesAbsurdas } from '../../utils/verdadesAbsurdasLoader';
import { carregarParticipantes } from '../../utils/participantesLoader';
import { carregarDicionarioSurreal } from '../../utils/dicionarioLoader';
import { carregarNoticiasExtraordinarias } from '../../utils/noticiasExtraordinariasLoader';
import { carregarQuemEEssePokemon } from '../../utils/quemEEssePokemonLoader';
import { carregarOvoOuGalinha } from '../../utils/ovoOuGalinhaLoader';
import { carregarReginaldoHoraDoLanche } from '../../utils/reginaldoHoraDoLancheLoader';
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
    const [painelistasPunicoes, setPainelistasPunicoes] = useState<PainelistasPunicaoEntry[]>([]);
    const [noticiasExtraordinariasScores, setNoticiasExtraordinariasScores] = useState<NoticiasExtraordinariasScoreEntry[]>([]);
    const [caroPraChuchuScores, setCaroPraChuchuScores] = useState<CaroPraChuchuScoreEntry[]>([]);
    const [ovoOuGalinhaScores, setOvoOuGalinhaScores] = useState<OvoOuGalinhaScoreEntry[]>([]);
    const [quemEEssePokemonScores, setQuemEEssePokemonScores] = useState<QuemEEssePokemonScoreEntry[]>([]);
    const [reginaldoHoraDoLancheScores, setReginaldoHoraDoLancheScores] = useState<ReginaldoHoraDoLancheScoreEntry[]>([]);
    const [titulosVerdades, setTitulosVerdades] = useState<Record<string, string>>({});
    const [palavrasDicionario, setPalavrasDicionario] = useState<Record<string, string>>({});
    const [manchetesNoticias, setManchetesNoticias] = useState<Record<string, string>>({});
    const [nomesPokemon, setNomesPokemon] = useState<Record<string, string>>({});
    const [nomesComidas, setNomesComidas] = useState<Record<string, string>>({});
    const [triosOvoOuGalinha, setTriosOvoOuGalinha] = useState<Record<string, string>>({});
    const [nomesParticipantes, setNomesParticipantes] = useState<Record<string, string>>({});
    const [gamesConfig, setGamesConfig] = useState<GamesConfig | null>(null);

    useEffect(() => {
        let isMounted = true;

        // Carregar scores (síncrono - não precisa de async)
        try {
            setVerdadesAbsurdasScores(loadVerdadesAbsurdasScores());
            setDicionarioSurrealScores(loadDicionarioSurrealScores());
            setPainelistasScores(loadPainelistasScores());
            setPainelistasPunicoes(loadPainelistasPunicoes());
            setNoticiasExtraordinariasScores(loadNoticiasExtraordinariasScores());
            setCaroPraChuchuScores(loadCaroPraChuchuScores());
            setOvoOuGalinhaScores(loadOvoOuGalinhaScores());
            setQuemEEssePokemonScores(loadQuemEEssePokemonScores());
            setReginaldoHoraDoLancheScores(loadReginaldoHoraDoLancheScores());
        } catch (error) {
            console.warn('Erro ao carregar scores:', error);
        }

        // Carregar dados para mapear IDs para nomes
        const loadData = async () => {
            const promises = [];

            // Verdades Absurdas
            promises.push(
                carregarVerdadesAbsurdas()
                    .then(verdades => {
                        if (!isMounted) return null;
                        const titulos = verdades.verdadesAbsurdas.reduce((acc: Record<string, string>, texto: { id: string; titulo: string }) => {
                            acc[texto.id] = texto.titulo;
                            return acc;
                        }, {});
                        setTitulosVerdades(titulos);
                        return titulos;
                    })
                    .catch(error => {
                        if (isMounted) {
                            console.warn('Erro ao carregar verdades absurdas:', error);
                        }
                        return null;
                    })
            );

            // Dicionário Surreal
            promises.push(
                carregarDicionarioSurreal()
                    .then(dicionario => {
                        if (!isMounted) return null;
                        const palavras = dicionario.palavras.reduce((acc: Record<string, string>, palavra: { id: string; palavra: string }) => {
                            acc[palavra.id] = palavra.palavra;
                            return acc;
                        }, {});
                        setPalavrasDicionario(palavras);
                        return palavras;
                    })
                    .catch(error => {
                        if (isMounted) {
                            console.warn('Erro ao carregar dicionário surreal:', error);
                        }
                        return null;
                    })
            );

            // Notícias Extraordinárias
            promises.push(
                carregarNoticiasExtraordinarias()
                    .then(noticias => {
                        if (!isMounted) return null;
                        const manchetes = noticias.noticias.reduce((acc: Record<string, string>, noticia: { id: string; manchete: string }) => {
                            acc[noticia.id] = noticia.manchete;
                            return acc;
                        }, {});
                        setManchetesNoticias(manchetes);
                        return manchetes;
                    })
                    .catch(error => {
                        if (isMounted) {
                            console.warn('Erro ao carregar notícias extraordinárias:', error);
                        }
                        return null;
                    })
            );

            // Quem É Esse Pokémon
            promises.push(
                carregarQuemEEssePokemon()
                    .then(pokemon => {
                        if (!isMounted) return null;
                        const nomes = pokemon.pokemons.reduce((acc: Record<string, string>, poke: { id: string; nome: string }) => {
                            acc[poke.id] = poke.nome;
                            return acc;
                        }, {});
                        setNomesPokemon(nomes);
                        return nomes;
                    })
                    .catch(error => {
                        if (isMounted) {
                            console.warn('Erro ao carregar pokémons:', error);
                        }
                        return null;
                    })
            );

            // Reginaldo Hora do Lanche
            promises.push(
                carregarReginaldoHoraDoLanche()
                    .then(comidas => {
                        if (!isMounted) return null;
                        const nomes = comidas.comidas.reduce((acc: Record<string, string>, comida: { id: string; nome: string }) => {
                            acc[comida.id] = comida.nome;
                            return acc;
                        }, {});
                        setNomesComidas(nomes);
                        return nomes;
                    })
                    .catch(error => {
                        if (!isMounted) {
                            console.warn('Erro ao carregar comidas:', error);
                        }
                        return null;
                    })
            );

            // Ovo ou Galinha
            promises.push(
                carregarOvoOuGalinha()
                    .then(ovoOuGalinha => {
                        if (!isMounted) return null;
                        const nomes = ovoOuGalinha.trios.reduce((acc: Record<string, string>, trio) => {
                            acc[trio.id.toString()] = `Trio #${trio.id}`;
                            return acc;
                        }, {} as Record<string, string>);
                        setTriosOvoOuGalinha(nomes);
                        return nomes;
                    })
                    .catch(error => {
                        if (!isMounted) {
                            console.warn('Erro ao carregar trios ovo ou galinha:', error);
                        }
                        return null;
                    })
            );

            // Participantes
            promises.push(
                carregarParticipantes()
                    .then(participantes => {
                        if (!isMounted) return null;
                        const nomes = participantes.reduce((acc: Record<string, string>, participante: { id: string; nome: string }) => {
                            acc[participante.id] = participante.nome;
                            return acc;
                        }, {});
                        setNomesParticipantes(nomes);
                        return nomes;
                    })
                    .catch(error => {
                        if (!isMounted) {
                            console.warn('Erro ao carregar participantes:', error);
                        }
                        return null;
                    })
            );

            // Configuração dos Jogos
            promises.push(
                carregarConfiguracaoJogos()
                    .then(games => {
                        if (!isMounted) return null;
                        setGamesConfig(games);
                        return games;
                    })
                    .catch(error => {
                        if (isMounted) {
                            console.warn('Erro ao carregar configuração dos jogos:', error);
                        }
                        return null;
                    })
            );

            // Aguardar todas as promises com timeout
            try {
                await Promise.allSettled(promises);
            } catch (error) {
                if (isMounted) {
                    console.warn('Erro geral ao carregar dados:', error);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
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
                        <span className="label">{getTeamNameFromString('A', gameState.teams)}</span>
                        <span className="placar-valor">{gameState.teams.teamA.score} pontos</span>
                    </div>
                    <div className="total-card">
                        <span className="label">{getTeamNameFromString('B', gameState.teams)}</span>
                        <span className="placar-valor">{gameState.teams.teamB.score} pontos</span>
                    </div>
                </div>

                <h2>📰 Histórico Detalhado</h2>
                <p className="historico-descricao">Registro completo de todas as pontuações por jogo</p>

                {/* Pontuação Extra do Host */}
                {gameState.extraPoints && gameState.extraPoints.length > 0 && (
                    <div className="historico-subsecao">
                        <h3>🎯 Pontuação Extra do Host</h3>
                        <div className="table-wrapper">
                            <table className="pd-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Pontos</th>
                                        <th>Data/Hora</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gameState.extraPoints.map((entry) => (
                                        <tr key={entry.id}>
                                            <td>{getTeamNameFromString(entry.teamId, gameState.teams)}</td>
                                            <td className="center">{entry.points > 0 ? `+${entry.points}` : entry.points}</td>
                                            <td>{new Date(entry.timestamp).toLocaleString('pt-BR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

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
                                            <td>{getTeamNameFromString(score.timeAdivinhador, gameState.teams)}</td>
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
                                            <td>{getTeamNameFromString(score.timeAdivinhador, gameState.teams)}</td>
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

                {/* Punições dos Painelistas */}
                {painelistasPunicoes.length > 0 && (
                    <div className="historico-subsecao">
                        <h3>Punições - Painelistas Excêntricos</h3>
                        <div className="table-wrapper">
                            <table className="pd-table">
                                <thead>
                                    <tr>
                                        <th>Jogador</th>
                                        <th>Time</th>
                                        <th>Pontos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {painelistasPunicoes.map((punicao, idx) => (
                                        <tr key={idx}>
                                            <td className="nome-cell">{nomesParticipantes[punicao.participanteId] || punicao.participanteId}</td>
                                            <td>{getTeamNameFromString(punicao.time, gameState.teams)}</td>
                                            <td className="center">{punicao.pontos}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

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

                {/* Ovo ou Galinha */}
                <div className="historico-subsecao">
                    <h3>{getGameEmoji('ovo-ou-galinha')} Ovo ou Galinha</h3>
                    {ovoOuGalinhaScores.length > 0 ? (
                        <div className="table-wrapper">
                            <table className="pd-table">
                                <thead>
                                    <tr>
                                        <th>Trio</th>
                                        <th>Time</th>
                                        <th>Acertou</th>
                                        <th>Pontos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ovoOuGalinhaScores.map((score, idx) => (
                                        <tr key={idx}>
                                            <td className="nome-cell">
                                                {triosOvoOuGalinha[score.trioId.toString()] || `Trio #${score.trioId}`}
                                            </td>
                                            <td>{getTeamNameFromString(score.timeAdivinhador, gameState.teams)}</td>
                                            <td>{score.pontos > 0 ? '✔ Sim' : '❌ Não'}</td>
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

                {/* Quem É Esse Pokémon */}
                <div className="historico-subsecao">
                    <h3>{getGameEmoji('quem-e-esse-pokemon')} Quem É Esse Pokémon</h3>
                    {quemEEssePokemonScores.length > 0 ? (
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
                                    {quemEEssePokemonScores.map((score, idx) => (
                                        <tr key={idx}>
                                            <td className="nome-cell">{nomesPokemon[score.pokemonId] || `Pokémon #${score.pokemonId}`}</td>
                                            <td>{getTeamNameFromString(score.timeAdivinhador, gameState.teams)}</td>
                                            <td className="center">
                                                {score.resultado === 'acerto' ? '✅ Acertou' : '❌ Errou'}
                                            </td>
                                            <td className={`center ${score.pontos < 0 ? 'negative-points' : score.pontos > 0 ? 'positive-points' : ''}`}>
                                                {score.pontos > 0 ? `+${score.pontos}` : score.pontos}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="empty">Nenhum registro encontrado</p>
                    )}
                </div>

                {/* Reginaldo Hora do Lanche */}
                <div className="historico-subsecao">
                    <h3>{getGameEmoji('reginaldo-hora-do-lanche')} Reginaldo Hora do Lanche</h3>
                    {reginaldoHoraDoLancheScores.length > 0 ? (
                        <div className="table-wrapper">
                            <table className="pd-table">
                                <thead>
                                    <tr>
                                        <th>Comida</th>
                                        <th>Time</th>
                                        <th>Resultado</th>
                                        <th>Pontos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reginaldoHoraDoLancheScores.map((score, idx) => (
                                        <tr key={idx}>
                                            <td className="nome-cell">{nomesComidas[score.id] || `Comida #${score.id}`}</td>
                                            <td>{getTeamNameFromString(score.timeAdivinhador, gameState.teams)}</td>
                                            <td className="center">
                                                {score.resultado === 'acerto' ? '✅ Acertou' : '❌ Errou'}
                                            </td>
                                            <td className={`center ${score.pontos < 0 ? 'negative-points' : score.pontos > 0 ? 'positive-points' : ''}`}>
                                                {score.pontos > 0 ? `+${score.pontos}` : score.pontos}
                                            </td>
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

