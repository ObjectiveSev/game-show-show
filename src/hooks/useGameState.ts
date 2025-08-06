import { useState, useEffect } from 'react';
import { Team, GameScores } from '../types';
import { loadGameConfig, saveGameConfig, GameConfig } from '../config/gameConfig';

interface GameState {
    teams: {
        teamA: Team;
        teamB: Team;
    };
    gameScores: GameScores;
}

const STORAGE_KEY = 'gameShowState';

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>(() => {
        // Carregar estado salvo ou usar estado inicial
        const saved = localStorage.getItem(STORAGE_KEY);
        const config = loadGameConfig();

        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge saved state with current config (to get updated team info)
            return {
                teams: config.teams,
                gameScores: parsed.gameScores || {}
            };
        }
        return {
            teams: config.teams,
            gameScores: {}
        };
    });

    // Salvar estado no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }, [gameState]);

    // Recarregar configuração quando ela mudar no localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            const config = loadGameConfig();
            setGameState(prev => ({
                ...prev,
                teams: config.teams
            }));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

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

    // Função para salvar configuração atual
    const saveConfig = () => {
        const config = loadGameConfig();
        config.teams = gameState.teams;
        saveGameConfig(config);
    };

    // Função para recarregar configuração
    const reloadConfig = () => {
        const config = loadGameConfig();
        setGameState(prev => ({
            ...prev,
            teams: config.teams
        }));
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