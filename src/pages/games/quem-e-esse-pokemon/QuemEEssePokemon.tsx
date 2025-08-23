import React, { useState, useEffect } from 'react';
import { DefaultCard } from '../../../components/default-card/DefaultCard';
import { GameHeader } from '../../../components/game-header/GameHeader';
import { QuemEEssePokemonModal } from './QuemEEssePokemonModal';
import { carregarQuemEEssePokemon } from '../../../utils/quemEEssePokemonLoader';
import { removeQuemEEssePokemonScore } from '../../../utils/scoreStorage';
import type { Team } from '../../../types';
import type { Pokemon, QuemEEssePokemonConfig, PokemonEstado } from '../../../types/quemEEssePokemon';
import { TagType, ButtonType } from '../../../types';
import { STORAGE_KEYS } from '../../../constants';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import './QuemEEssePokemon.css';

interface QuemEEssePokemonProps {
    gameState: {
        teams: {
            teamA: Team;
            teamB: Team;
        };
        syncPoints: () => void;
    };
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
}

export const QuemEEssePokemon: React.FC<QuemEEssePokemonProps> = ({
    gameState,
    addGamePoints,
    addPoints
}) => {
    const [config, setConfig] = useState<QuemEEssePokemonConfig | null>(null);
    const [estados, setEstados] = useState<PokemonEstado[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                const data = await carregarQuemEEssePokemon();
                if (!isMounted) return;

                setConfig(data);

                // Inicializar estados dos pokémon (default)
                const estadosIniciais: PokemonEstado[] = data.pokemons.map(pokemon => ({
                    id: pokemon.id,
                    jogado: false
                }));

                // Tentar carregar estados salvos do localStorage e mesclar por id
                try {
                    const salvo = localStorage.getItem(STORAGE_KEYS.QUEM_E_ESSE_POKEMON_ESTADOS);
                    if (salvo) {
                        const estadosSalvos: PokemonEstado[] = JSON.parse(salvo);
                        const mesclados = estadosIniciais.map((estado) => {
                            const encontrado = estadosSalvos.find(s => s.id === estado.id);
                            return encontrado ? { ...estado, ...encontrado } : estado;
                        });
                        setEstados(mesclados);
                    } else {
                        setEstados(estadosIniciais);
                    }
                } catch {
                    setEstados(estadosIniciais);
                }

                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar dados do Quem é esse Pokémon:', error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Salvar estados no localStorage quando mudarem
    useEffect(() => {
        if (estados.length) {
            localStorage.setItem(STORAGE_KEYS.QUEM_E_ESSE_POKEMON_ESTADOS, JSON.stringify(estados));
        }
    }, [estados]);

    const handleCardClick = (pokemon: Pokemon) => {
        setSelectedPokemon(pokemon);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPokemon(null);
    };

    const handleSavePokemon = (pokemonId: string, teamId: 'A' | 'B', resultado: 'acerto' | 'erro', pontos: number) => {
        // Atualizar estado local
        setEstados(prev => prev.map(estado =>
            estado.id === pokemonId
                ? {
                    ...estado,
                    jogado: true,
                    timeAdivinhador: teamId,
                    resultado,
                    pontos,
                    pontuacaoSalva: true
                }
                : estado
        ));

        // Sincronizar pontos globais se disponível
        if (gameState.syncPoints) {
            gameState.syncPoints();
        }
    };

    const handleResetarPontuacao = (pokemonId: string) => {
        // Remover pontuação do storage
        removeQuemEEssePokemonScore(pokemonId);

        // Resetar estado local
        setEstados(prev => prev.map(estado =>
            estado.id === pokemonId
                ? { ...estado, jogado: false, timeAdivinhador: undefined, resultado: undefined, pontos: undefined, pontuacaoSalva: false }
                : estado
        ));

        // Sincronizar pontos globais se disponível
        if (gameState.syncPoints) {
            gameState.syncPoints();
        }
    };

    if (loading) {
        return (
            <div className="quem-e-esse-pokemon">
                <div className="loading">
                    <h2>Carregando Quem É Esse Pokémon...</h2>
                </div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="quem-e-esse-pokemon">
                <div className="error">
                    <h2>Erro ao carregar o jogo</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="quem-e-esse-pokemon">
            <GameHeader
                title="Quem É Esse Pokémon?"
                subtitle="Clique em um Pokémon para começar a adivinhar!"
                emoji="⚡"
            />

            <div className="pokemon-grid">
                {config.pokemons.map((pokemon) => {
                    const estado = estados.find(e => e.id === pokemon.id);
                    const jogado = estado?.jogado || false;

                    // Determinar tags baseadas no resultado
                    const getTags = (): TagType[] => {
                        const tags: TagType[] = [jogado ? TagType.READ : TagType.PENDING];

                        if (jogado && estado?.resultado) {
                            switch (estado.resultado) {
                                case 'acerto':
                                    tags.push(TagType.CORRECT);
                                    break;
                                case 'erro':
                                    tags.push(TagType.ERROR);
                                    break;
                            }
                        }

                        return tags;
                    };

                    return (
                        <DefaultCard
                            key={pokemon.id}
                            title={jogado ? pokemon.nome : `Pokémon #${pokemon.id}`}
                            tags={getTags()}
                            body={
                                jogado && estado?.timeAdivinhador
                                    ? `${getTeamNameFromString(estado.timeAdivinhador, gameState.teams)}`
                                    : undefined
                            }
                            button={
                                jogado
                                    ? {
                                        type: ButtonType.RESET,
                                        onClick: (e) => {
                                            e.stopPropagation();
                                            handleResetarPontuacao(pokemon.id);
                                        }
                                    }
                                    : undefined
                            }
                            onClick={() => handleCardClick(pokemon)}
                            className={`pokemon-card ${jogado ? 'jogado' : ''}`}
                        >
                            {jogado && estado?.pontos !== undefined && (
                                <div className={`pontos-info ${estado.pontos > 0 ? 'pontos-positivos' :
                                        estado.pontos < 0 ? 'pontos-negativos' : 'zero-pontos'
                                    }`}>
                                    {estado.pontos > 0 ? `+${estado.pontos}` : estado.pontos} pontos
                                </div>
                            )}
                        </DefaultCard>
                    );
                })}
            </div>

            {selectedPokemon && (
                <QuemEEssePokemonModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    pokemon={selectedPokemon}
                    config={config}
                    gameState={gameState}
                    addGamePoints={addGamePoints}
                    addPoints={addPoints}
                    onSavePokemon={handleSavePokemon}
                    isAlreadyPlayed={estados.find(e => e.id === selectedPokemon.id)?.jogado || false}
                />
            )}
        </div>
    );
};
