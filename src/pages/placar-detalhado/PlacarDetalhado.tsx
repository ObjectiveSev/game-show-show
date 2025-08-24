import React, { useEffect, useState } from 'react';
import type { AppState } from '../../types';

import type { DicionarioScoreEntry } from '../../types/dicionarioSurreal';
import type { PainelistasScoreEntry, PainelistasPunicaoEntry } from '../../types/painelistas';
import type { NoticiasExtraordinariasScoreEntry } from '../../types/noticiasExtraordinarias';
import type { CaroPraChuchuScoreEntry } from '../../types/caroPraChuchu';
import type { OvoOuGalinhaScoreEntry } from '../../types/ovoOuGalinha';
import type { QuemEEssePokemonScoreEntry } from '../../types/quemEEssePokemon';
import type { ReginaldoHoraDoLancheScoreEntry } from '../../types/reginaldoHoraDoLanche';
import type { GamesConfig } from '../../types/games';

import { loadDicionarioSurrealScores } from '../../utils/scoreStorage';
import { loadPainelistasScores, loadPainelistasPunicoes } from '../../utils/scoreStorage';
import { loadNoticiasExtraordinariasScores } from '../../utils/scoreStorage';
import { loadCaroPraChuchuScores } from '../../utils/scoreStorage';
import { loadOvoOuGalinhaScores } from '../../utils/scoreStorage';
import { loadQuemEEssePokemonScores } from '../../utils/scoreStorage';
import { loadReginaldoHoraDoLancheScores } from '../../utils/scoreStorage';

import { carregarParticipantes } from '../../utils/participantesLoader';
import { carregarDicionarioSurreal } from '../../utils/dicionarioLoader';
import { carregarNoticiasExtraordinarias } from '../../utils/noticiasExtraordinariasLoader';
import { carregarQuemEEssePokemon } from '../../utils/quemEEssePokemonLoader';
import { carregarOvoOuGalinha } from '../../utils/ovoOuGalinhaLoader';
import { carregarReginaldoHoraDoLanche } from '../../utils/reginaldoHoraDoLancheLoader';
import { carregarConfiguracaoJogos } from '../../utils/gamesLoader';
import { getTeamNameFromString } from '../../utils/teamUtils';
import { BackButton } from '../../components/back-button/BackButton';
import { VerdadesAbsurdasScoreSection } from './sections/VerdadesAbsurdasScoreSection';
import { PainelistasExcentricosScoreSection } from './sections/PainelistasExcentricosScoreSection';
import { DicionarioSurrealScoreSection } from './sections/DicionarioSurrealScoreSection';
import { NoticiasExtraordinariasScoreSection } from './sections/NoticiasExtraordinariasScoreSection';
import { CaroPraChuchuScoreSection } from './sections/CaroPraChuchuScoreSection';
import { OvoOuGalinhaScoreSection } from './sections/OvoOuGalinhaScoreSection';
import { QuemEEssePokemonScoreSection } from './sections/QuemEEssePokemonScoreSection';
import { ReginaldoHoraDoLancheScoreSection } from './sections/ReginaldoHoraDoLancheScoreSection';
import './PlacarDetalhado.css';

interface Props {
    gameState: AppState;
}

export const PlacarDetalhado: React.FC<Props> = ({ gameState }) => {

    const [dicionarioSurrealScores, setDicionarioSurrealScores] = useState<DicionarioScoreEntry[]>([]);
    const [painelistasScores, setPainelistasScores] = useState<PainelistasScoreEntry[]>([]);
    const [painelistasPunicoes, setPainelistasPunicoes] = useState<PainelistasPunicaoEntry[]>([]);
    const [noticiasExtraordinariasScores, setNoticiasExtraordinariasScores] = useState<NoticiasExtraordinariasScoreEntry[]>([]);
    const [caroPraChuchuScores, setCaroPraChuchuScores] = useState<CaroPraChuchuScoreEntry[]>([]);
    const [ovoOuGalinhaScores, setOvoOuGalinhaScores] = useState<OvoOuGalinhaScoreEntry[]>([]);
    const [quemEEssePokemonScores, setQuemEEssePokemonScores] = useState<QuemEEssePokemonScoreEntry[]>([]);
    const [reginaldoHoraDoLancheScores, setReginaldoHoraDoLancheScores] = useState<ReginaldoHoraDoLancheScoreEntry[]>([]);

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

    const renderGameSection = (gameId: string) => {
        switch (gameId) {
            case 'verdades-absurdas':
                return (
                    <VerdadesAbsurdasScoreSection
                        key={gameId}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'painelistas-excentricos':
                return (
                    <PainelistasExcentricosScoreSection
                        key={gameId}
                        scores={painelistasScores}
                        punicoes={painelistasPunicoes}
                        nomesParticipantes={nomesParticipantes}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'dicionario-surreal':
                return (
                    <DicionarioSurrealScoreSection
                        key={gameId}
                        scores={dicionarioSurrealScores}
                        palavras={palavrasDicionario}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'noticias-extraordinarias':
                return (
                    <NoticiasExtraordinariasScoreSection
                        key={gameId}
                        scores={noticiasExtraordinariasScores}
                        manchetes={manchetesNoticias}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'caro-pra-chuchu':
                return (
                    <CaroPraChuchuScoreSection
                        key={gameId}
                        scores={caroPraChuchuScores}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'ovo-ou-galinha':
                return (
                    <OvoOuGalinhaScoreSection
                        key={gameId}
                        scores={ovoOuGalinhaScores}
                        trios={triosOvoOuGalinha}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'quem-e-esse-pokemon':
                return (
                    <QuemEEssePokemonScoreSection
                        key={gameId}
                        scores={quemEEssePokemonScores}
                        nomesPokemon={nomesPokemon}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'reginaldo-hora-do-lanche':
                return (
                    <ReginaldoHoraDoLancheScoreSection
                        key={gameId}
                        scores={reginaldoHoraDoLancheScores}
                        nomesComidas={nomesComidas}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            default:
                return null;
        }
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

                {/* Seções dos jogos renderizadas dinamicamente baseadas no games.json */}
                {gamesConfig?.games.map((game) => renderGameSection(game.id))}
            </div>
        </div>
    );
};