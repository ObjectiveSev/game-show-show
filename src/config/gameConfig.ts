import type { Team } from '../types';
import { readTeamsFile, writeTeamsFile } from '../utils/fileSystem';

export interface GameConfig {
    teams: {
        teamA: Team;
        teamB: Team;
    };
}

// Default configuration - this can be easily modified for different game sessions
export const defaultGameConfig: GameConfig = {
    teams: {
        teamA: {
            id: 'A',
            name: 'Time A',
            captain: 'Baby',
            members: ['Baby', 'João', 'Álan', 'Matheus'],
            color: '#ff6b6b',
            gradient: 'linear-gradient(145deg, #ff6b6b, #ee5a52)',
            score: 0
        },
        teamB: {
            id: 'B',
            name: 'Time B',
            captain: 'Victor',
            members: ['Victor', 'Átila', 'Bruno', 'Sand'],
            color: '#4ecdc4',
            gradient: 'linear-gradient(145deg, #4ecdc4, #44a08d)',
            score: 0
        }
    }
};

// Function to load custom config from teams.json file
export const loadGameConfig = async (): Promise<GameConfig> => {
    try {
        const fileConfig = await readTeamsFile();

        // Converte a estrutura do arquivo para o formato do GameConfig
        const config: GameConfig = {
            teams: {
                teamA: {
                    ...fileConfig.teams.teamA,
                    color: '#ff6b6b',
                    gradient: 'linear-gradient(145deg, #ff6b6b, #ee5a52)',
                    score: 0 // Score sempre começa em 0
                },
                teamB: {
                    ...fileConfig.teams.teamB,
                    color: '#4ecdc4',
                    gradient: 'linear-gradient(145deg, #4ecdc4, #44a08d)',
                    score: 0 // Score sempre começa em 0
                }
            }
        };

        return config;
    } catch (error) {
        console.warn('❌ Failed to load teams.json, using default:', error);
        return defaultGameConfig;
    }
};

// Interface para dados básicos do time (sem cores e scores)
interface TeamBasicData {
    id: string;
    name: string;
    captain: string;
    members: string[];
}

interface TeamsBasicConfig {
    teams: {
        teamA: TeamBasicData;
        teamB: TeamBasicData;
    };
}

// Function to save config to teams.json file
export const saveGameConfig = async (config: TeamsBasicConfig): Promise<void> => {
    try {
        await writeTeamsFile(config);
    } catch (error) {
        console.error('❌ Failed to save teams.json:', error);
        throw error;
    }
};

// Function to reset config to default
export const resetGameConfig = async (): Promise<void> => {
    try {
        await writeTeamsFile({
            teams: {
                teamA: {
                    id: 'A',
                    name: 'Time A',
                    captain: 'Baby',
                    members: ['Baby', 'João', 'Álan', 'Matheus']
                },
                teamB: {
                    id: 'B',
                    name: 'Time B',
                    captain: 'Victor',
                    members: ['Victor', 'Átila', 'Bruno', 'Sand']
                }
            }
        });
    } catch (error) {
        console.error('Failed to reset teams.json:', error);
        throw error;
    }
}; 