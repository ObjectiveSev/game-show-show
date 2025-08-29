import { useState, useEffect } from 'react';
import type { Team, AppState, ExtraPointsEntry } from '../types';
import { loadGameConfig, saveGameConfig } from '../config/gameConfig';
import { STORAGE_KEYS } from '../constants';
import { syncGameScores } from '../utils/scoreSync';

// Estado inicial padrão
const initialState: AppState = {
    teams: {
        teamA: {
            id: 'A',
            name: 'Time A',
            captain: '',
            members: [],
            color: '#ff6b6b',
            gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            score: 0
        },
        teamB: {
            id: 'B',
            name: 'Time B',
            captain: '',
            members: [],
            color: '#4ecdc4',
            gradient: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
            score: 0
        }
    },
    gameScores: {},
    buzzer: {
        active: false,
        winner: null,
        timer: null,
        timeLeft: 0
    },
    extraPoints: []
};

export const useGameState = () => {
    const [gameState, setGameState] = useState<AppState>(initialState);

    // Carregar configuração inicial
    useEffect(() => {
        let isMounted = true;

        const loadInitialConfig = async () => {
            try {
                const config = await loadGameConfig();
                if (!isMounted) return;
                setGameState(prev => ({
                    ...prev,
                    teams: config.teams
                }));
            } catch (error) {
                if (isMounted) {
                    console.warn('❌ Failed to load initial config, using defaults:', error);
                }
            }
        };

        loadInitialConfig();

        return () => {
            isMounted = false;
        };
    }, []);

    // Carregar scores salvos
    useEffect(() => {
        let isMounted = true;

        const loadSavedScores = async () => {
            try {
                // Sincronizar scores dos jogos individuais
                const updatedScores = syncGameScores();
                if (!isMounted) return;
                setGameState(prev => ({
                    ...prev,
                    gameScores: updatedScores
                }));

                // Carregar scores consolidados
                const savedScores = localStorage.getItem(STORAGE_KEYS.GAME_SCORES);
                if (savedScores) {
                    const parsed = JSON.parse(savedScores);
                    if (parsed && isMounted) {
                        setGameState(prev => ({
                            ...prev,
                            gameScores: parsed
                        }));
                    }
                }

                // Carregar pontos extras salvos
                const savedExtraPoints = localStorage.getItem(STORAGE_KEYS.EXTRA_POINTS);
                if (savedExtraPoints && isMounted) {
                    try {
                        const extraPoints = JSON.parse(savedExtraPoints);
                        if (Array.isArray(extraPoints)) {
                            setGameState(prev => ({
                                ...prev,
                                extraPoints
                            }));
                        }
                    } catch (error) {
                        console.warn('❌ Failed to parse extra points:', error);
                    }
                }
            } catch (error) {
                if (isMounted) {
                    console.warn('❌ Failed to load saved scores:', error);
                }
            }
        };

        loadSavedScores();

        return () => {
            isMounted = false;
        };
    }, []);

    // Salvar scores automaticamente quando mudarem
    useEffect(() => {
        if (Object.keys(gameState.gameScores).length > 0) {
            localStorage.setItem(STORAGE_KEYS.GAME_SCORES, JSON.stringify({
                gameScores: gameState.gameScores
            }));
        }
    }, [gameState.gameScores]);

    // Salvar pontos extras automaticamente quando mudarem
    useEffect(() => {
        if (gameState.extraPoints.length > 0) {
            localStorage.setItem(STORAGE_KEYS.EXTRA_POINTS, JSON.stringify(gameState.extraPoints));
        }
    }, [gameState.extraPoints]);

    // Sincronizar pontos dos times automaticamente quando gameScores ou extraPoints mudarem
    useEffect(() => {
        const gameScoreA = Object.values(gameState.gameScores).reduce((sum, game) => sum + game.teamA, 0);
        const gameScoreB = Object.values(gameState.gameScores).reduce((sum, game) => sum + game.teamB, 0);

        const extraScoreA = gameState.extraPoints.filter(entry => entry.teamId === 'A').reduce((sum, entry) => sum + entry.points, 0);
        const extraScoreB = gameState.extraPoints.filter(entry => entry.teamId === 'B').reduce((sum, entry) => sum + entry.points, 0);

        const totalScoreA = gameScoreA + extraScoreA;
        const totalScoreB = gameScoreB + extraScoreB;

        setGameState(prev => ({
            ...prev,
            teams: {
                ...prev.teams,
                teamA: { ...prev.teams.teamA, score: totalScoreA },
                teamB: { ...prev.teams.teamB, score: totalScoreB }
            }
        }));
    }, [gameState.gameScores, gameState.extraPoints]);

    // Função para adicionar pontos a um time
    const addPoints = (teamId: 'A' | 'B', points: number) => {
        setGameState(prev => ({
            ...prev,
            teams: {
                ...prev.teams,
                [`team${teamId}`]: {
                    ...prev.teams[`team${teamId}` as keyof typeof prev.teams],
                    score: prev.teams[`team${teamId}` as keyof typeof prev.teams].score + points
                }
            }
        }));
    };

    // Função para adicionar pontos específicos de um jogo
    const addGamePoints = (gameId: string, teamId: 'A' | 'B', points: number) => {
        setGameState(prev => ({
            ...prev,
            gameScores: {
                ...prev.gameScores,
                [gameId]: {
                    ...prev.gameScores[gameId],
                    [`team${teamId}`]: (prev.gameScores[gameId]?.[`team${teamId}`] || 0) + points
                }
            }
        }));
    };

    // Função para remover pontos específicos de um jogo (para reset)
    const removeGamePoints = (gameId: string, teamId: 'A' | 'B', points: number) => {
        setGameState(prev => ({
            ...prev,
            gameScores: {
                ...prev.gameScores,
                [gameId]: {
                    ...prev.gameScores[gameId],
                    [`team${teamId}`]: Math.max(0, (prev.gameScores[gameId]?.[`team${teamId}`] || 0) - points)
                }
            }
        }));
    };

    // Função para adicionar pontos extras do host
    const addExtraPoints = (teamId: 'A' | 'B', points: number, razao?: string) => {
        const entry: ExtraPointsEntry = {
            id: Date.now().toString(),
            teamId,
            points,
            timestamp: Date.now(),
            description: `${points > 0 ? '+' : ''}${points} ponto${points !== 1 ? 's' : ''}`,
            razao: razao || undefined
        };

        setGameState(prev => ({
            ...prev,
            extraPoints: [...prev.extraPoints, entry]
        }));
    };

    // Função para resetar todos os scores
    const resetScores = () => {
        setGameState(prev => ({
            ...prev,
            gameScores: {},
            teams: {
                ...prev.teams,
                teamA: { ...prev.teams.teamA, score: 0 },
                teamB: { ...prev.teams.teamB, score: 0 }
            },
            extraPoints: []
        }));

        // Limpar todos os localStorages dos jogos para resetar score detalhado
        localStorage.removeItem(STORAGE_KEYS.GAME_SCORES);
        localStorage.removeItem(STORAGE_KEYS.VERDADES_ABSURDAS_SCORES);
        localStorage.removeItem(STORAGE_KEYS.VERDADES_ABSURDAS_ESTADOS);
        localStorage.removeItem(STORAGE_KEYS.DICIONARIO_SURREAL_SCORES);
        localStorage.removeItem(STORAGE_KEYS.DICIONARIO_SURREAL_ESTADOS);
        localStorage.removeItem(STORAGE_KEYS.PAINELISTAS_SCORES);
        localStorage.removeItem(STORAGE_KEYS.PAINELISTAS_ESTADOS);
        localStorage.removeItem(STORAGE_KEYS.PAINELISTAS_PUNICOES);
        localStorage.removeItem(STORAGE_KEYS.NOTICIAS_EXTRAORDINARIAS_SCORES);
        localStorage.removeItem(STORAGE_KEYS.NOTICIAS_EXTRAORDINARIAS_ESTADOS);
        localStorage.removeItem(STORAGE_KEYS.CARO_PRA_CHUCHU_SCORES);
        localStorage.removeItem(STORAGE_KEYS.CARO_PRA_CHUCHU_ESTADOS);
        localStorage.removeItem(STORAGE_KEYS.OVO_OU_GALINHA_SCORES);
        localStorage.removeItem(STORAGE_KEYS.OVO_OU_GALINHA_ESTADOS);
        localStorage.removeItem(STORAGE_KEYS.QUEM_E_ESSE_POKEMON_SCORES);
        localStorage.removeItem(STORAGE_KEYS.QUEM_E_ESSE_POKEMON_ESTADOS);
        localStorage.removeItem(STORAGE_KEYS.REGINALDO_HORA_DO_LANCHE_SCORES);
        localStorage.removeItem(STORAGE_KEYS.REGINALDO_HORA_DO_LANCHE_ESTADOS);
        localStorage.removeItem(STORAGE_KEYS.MAESTRO_BILLY_SCORES);
        localStorage.removeItem(STORAGE_KEYS.MAESTRO_BILLY_ESTADOS);
        localStorage.removeItem(STORAGE_KEYS.EXTRA_POINTS);
    };

    // Função para atualizar nomes dos times
    const updateTeamNames = (teamId: 'A' | 'B', name: string, captain: string) => {
        setGameState(prev => ({
            ...prev,
            teams: {
                ...prev.teams,
                [`team${teamId}`]: {
                    ...prev.teams[`team${teamId}` as keyof typeof prev.teams],
                    name,
                    captain
                }
            }
        }));
    };

    // Função para atualizar membros dos times
    const updateTeamMembers = (teamId: 'A' | 'B', members: string[]) => {
        setGameState(prev => ({
            ...prev,
            teams: {
                ...prev.teams,
                [`team${teamId}`]: {
                    ...prev.teams[`team${teamId}` as keyof typeof prev.teams],
                    members
                }
            }
        }));
    };

    // Função para atualizar configuração completa dos times
    const updateTeamConfig = async (teamId: 'A' | 'B', team: Partial<Team>) => {
        setGameState(prev => {
            const newState = {
                ...prev,
                teams: {
                    ...prev.teams,
                    [`team${teamId}`]: {
                        ...prev.teams[`team${teamId}` as keyof typeof prev.teams],
                        ...team
                    }
                }
            };

            // Salvar automaticamente no localStorage
            saveConfig({
                teams: {
                    teamA: newState.teams.teamA,
                    teamB: newState.teams.teamB
                }
            }).catch(error => {
                console.error('❌ Erro ao salvar configuração automática:', error);
            });

            return newState;
        });
    };

    // Função para salvar configuração atual no localStorage
    const saveConfig = async (customData?: Record<string, unknown>) => {
        try {
            let configToSave: {
                teams: {
                    teamA: {
                        id: 'A' | 'B';
                        name: string;
                        captain: string;
                        members: string[];
                        color: string;
                        gradient: string;
                        score: number;
                    };
                    teamB: {
                        id: 'A' | 'B';
                        name: string;
                        captain: string;
                        members: string[];
                        color: string;
                        gradient: string;
                        score: number;
                    };
                };
            };

            if (customData) {
                // Usar dados customizados se fornecidos
                configToSave = customData as typeof configToSave;
            } else {
                // Usar estado atual
                configToSave = {
                    teams: {
                        teamA: {
                            id: gameState.teams.teamA.id,
                            name: gameState.teams.teamA.name,
                            captain: gameState.teams.teamA.captain,
                            members: gameState.teams.teamA.members,
                            color: gameState.teams.teamA.color,
                            gradient: gameState.teams.teamA.gradient,
                            score: gameState.teams.teamA.score
                        },
                        teamB: {
                            id: gameState.teams.teamB.id,
                            name: gameState.teams.teamB.name,
                            captain: gameState.teams.teamB.captain,
                            members: gameState.teams.teamB.members,
                            color: gameState.teams.teamB.color,
                            gradient: gameState.teams.teamB.gradient,
                            score: gameState.teams.teamB.score
                        }
                    }
                };
            }

            await saveGameConfig(configToSave);
        } catch (error) {
            console.error('❌ Erro ao salvar configuração:', error);
        }
    };

    // Função para recarregar configuração
    const reloadConfig = async () => {
        try {
            const config = await loadGameConfig();
            setGameState(prev => ({
                ...prev,
                teams: config.teams
            }));
        } catch (error) {
            console.error('Erro ao recarregar configuração:', error);
        }
    };

    // Função para sincronizar pontos do localStorage
    const syncPoints = async () => {
        try {
            const updatedScores = syncGameScores();

            setGameState(prev => ({
                ...prev,
                gameScores: updatedScores
            }));

            // Atualizar scores dos times baseado nos gameScores
            const totalScoreA = Object.values(updatedScores).reduce((sum, game) => sum + game.teamA, 0);
            const totalScoreB = Object.values(updatedScores).reduce((sum, game) => sum + game.teamB, 0);

            setGameState(prev => ({
                ...prev,
                teams: {
                    ...prev.teams,
                    teamA: { ...prev.teams.teamA, score: totalScoreA },
                    teamB: { ...prev.teams.teamB, score: totalScoreB }
                }
            }));
        } catch (error) {
            console.error('❌ Erro ao sincronizar pontos:', error);
        }
    };

    return {
        gameState,
        addPoints,
        addGamePoints,
        removeGamePoints,
        addExtraPoints,
        resetScores,
        updateTeamNames,
        updateTeamMembers,
        updateTeamConfig,
        saveConfig,
        reloadConfig,
        syncPoints
    };
}; 