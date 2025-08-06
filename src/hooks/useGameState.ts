import { useState, useEffect } from 'react';
import { Team, GameScores } from '../types';
import { initialTeams } from '../data/gameData';

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
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            teams: initialTeams,
            gameScores: {}
        };
    });

    // Salvar estado no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }, [gameState]);

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

    return {
        gameState,
        addPoints,
        addGamePoints,
        resetScores,
        updateTeamNames
    };
}; 