import { useState, useEffect } from 'react';
import type { Team, GameScores } from '../types';
import { loadGameConfig, saveGameConfig } from '../config/gameConfig';


interface GameState {
    teams: {
        teamA: Team;
        teamB: Team;
    };
    gameScores: GameScores;
}

const SCORES_STORAGE_KEY = 'gameShowScores';

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>({
        teams: {
            teamA: {
                id: 'A',
                name: '',
                captain: '',
                members: [],
                color: '#ff6b6b',
                gradient: 'linear-gradient(145deg, #ff6b6b, #ee5a52)',
                score: 0
            },
            teamB: {
                id: 'B',
                name: '',
                captain: '',
                members: [],
                color: '#4ecdc4',
                gradient: 'linear-gradient(145deg, #4ecdc4, #44a08d)',
                score: 0
            }
        },
        gameScores: {}
    });



    // Carregar configuração inicial do localStorage
    useEffect(() => {
        const loadInitialConfig = async () => {
            try {
                const config = await loadGameConfig();
                setGameState(prev => ({
                    ...prev,
                    teams: config.teams
                }));
            } catch (error) {
                console.error('❌ Erro ao carregar configuração inicial:', error);
            }
        };

        loadInitialConfig();
    }, []);

    // Carregar scores salvos do localStorage
    useEffect(() => {
        const savedScores = localStorage.getItem(SCORES_STORAGE_KEY);
        if (savedScores) {
            try {
                const parsed = JSON.parse(savedScores);
                setGameState(prev => ({
                    ...prev,
                    gameScores: parsed.gameScores || {}
                }));
            } catch (error) {
                console.error('❌ Erro ao carregar scores:', error);
            }
        }
    }, []);

    // Fallback: agregação a partir do histórico detalhado (verdadesAbsurdasScores)
    useEffect(() => {
        try {
            const raw = localStorage.getItem('verdadesAbsurdasScores');
            if (!raw) return;
            const entries = JSON.parse(raw);
            if (!Array.isArray(entries)) return;

            const totals = entries.reduce(
                (acc: { A: number; B: number }, e: any) => {
                    acc.A += (e.timeLeitor === 'A' ? e.pontosLeitor || 0 : 0) + (e.timeAdivinhador === 'A' ? e.pontosAdivinhador || 0 : 0);
                    acc.B += (e.timeLeitor === 'B' ? e.pontosLeitor || 0 : 0) + (e.timeAdivinhador === 'B' ? e.pontosAdivinhador || 0 : 0);
                    return acc;
                },
                { A: 0, B: 0 }
            );

            setGameState(prev => {
                // não sobrescrever se já existe pontuação agregada para o jogo
                if (prev.gameScores['verdades-absurdas']) return prev;
                return {
                    ...prev,
                    gameScores: {
                        ...prev.gameScores,
                        ['verdades-absurdas']: { teamA: totals.A, teamB: totals.B }
                    }
                };
            });
        } catch {
            // ignore
        }
    }, []);

    // Salvar scores no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify({
            gameScores: gameState.gameScores
        }));
    }, [gameState.gameScores]);

    // Recalcular placar total a partir dos gameScores (após carregar/somar pontos)
    useEffect(() => {
        const totals = Object.values(gameState.gameScores).reduce(
            (acc, gs) => {
                if (!gs) return acc;
                acc.teamA += gs.teamA || 0;
                acc.teamB += gs.teamB || 0;
                return acc;
            },
            { teamA: 0, teamB: 0 }
        );

        setGameState(prev => ({
            ...prev,
            teams: {
                ...prev.teams,
                teamA: { ...prev.teams.teamA, score: totals.teamA },
                teamB: { ...prev.teams.teamB, score: totals.teamB }
            }
        }));
    }, [gameState.gameScores]);



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

    // Função para adicionar pontos a um jogo específico
    const addGamePoints = (gameId: string, teamId: 'A' | 'B', points: number) => {
        setGameState(prev => {
            const currentGameScore = prev.gameScores[gameId] || { teamA: 0, teamB: 0 };
            return {
                ...prev,
                gameScores: {
                    ...prev.gameScores,
                    [gameId]: {
                        ...currentGameScore,
                        [`team${teamId}`]: currentGameScore[`team${teamId}` as keyof typeof currentGameScore] + points
                    }
                }
            };
        });
    };

    // Função para resetar pontuação
    const resetScores = () => {
        setGameState(prev => ({
            ...prev,
            teams: {
                ...prev.teams,
                teamA: { ...prev.teams.teamA, score: 0 },
                teamB: { ...prev.teams.teamB, score: 0 }
            },
            gameScores: {}
        }));

        // Limpar persistência de pontuação no localStorage
        try {
            localStorage.removeItem(SCORES_STORAGE_KEY);
            localStorage.removeItem('verdadesAbsurdasScores');
        } catch {
            // ignore
        }
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
    const updateTeamConfig = (teamId: 'A' | 'B', team: Partial<Team>) => {
        setGameState(prev => ({
            ...prev,
            teams: {
                ...prev.teams,
                [`team${teamId}`]: {
                    ...prev.teams[`team${teamId}` as keyof typeof prev.teams],
                    ...team
                }
            }
        }));
    };

    // Função para salvar configuração atual no localStorage
    const saveConfig = async (customData?: any) => {
        try {
            let configToSave;

            if (customData) {
                // Usar dados customizados se fornecidos
                configToSave = customData;
            } else {
                // Usar estado atual
                configToSave = {
                    teams: {
                        teamA: {
                            id: gameState.teams.teamA.id,
                            name: gameState.teams.teamA.name,
                            captain: gameState.teams.teamA.captain,
                            members: gameState.teams.teamA.members
                        },
                        teamB: {
                            id: gameState.teams.teamB.id,
                            name: gameState.teams.teamB.name,
                            captain: gameState.teams.teamB.captain,
                            members: gameState.teams.teamB.members
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

    return {
        gameState,
        addPoints,
        addGamePoints,
        resetScores,
        updateTeamNames,
        updateTeamMembers,
        updateTeamConfig,
        saveConfig,
        reloadConfig
    };
}; 