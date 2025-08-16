import { readTeamsFile, writeTeamsFile } from '../utils/fileSystem';
import type { Team } from '../types';
import { TEAM_COLORS } from '../constants';

// Interface para configuração dos times
interface TeamsConfig {
    teams: {
        teamA: Team;
        teamB: Team;
    };
}

// Configuração padrão do jogo
const defaultGameConfig: TeamsConfig = {
    teams: {
        teamA: {
            id: 'A',
            name: 'Time A',
            captain: 'Baby',
            members: ['Baby', 'João', 'Álan', 'Matheus'],
            color: TEAM_COLORS.TEAM_A.color,
            gradient: TEAM_COLORS.TEAM_A.gradient,
            score: 0
        },
        teamB: {
            id: 'B',
            name: 'Time B',
            captain: 'Victor',
            members: ['Victor', 'Átila', 'Bruno', 'Sand'],
            color: TEAM_COLORS.TEAM_B.color,
            gradient: TEAM_COLORS.TEAM_B.gradient,
            score: 0
        }
    }
};

// Function to load custom config from teams.json file
export const loadGameConfig = async (): Promise<TeamsConfig> => {
    try {
        const fileConfig = await readTeamsFile();

        // Converte a estrutura do arquivo para o formato do TeamsConfig
        const config: TeamsConfig = {
            teams: {
                teamA: {
                    ...fileConfig.teams.teamA,
                    color: TEAM_COLORS.TEAM_A.color,
                    gradient: TEAM_COLORS.TEAM_A.gradient,
                    score: 0 // Score sempre começa em 0
                },
                teamB: {
                    ...fileConfig.teams.teamB,
                    color: TEAM_COLORS.TEAM_B.color,
                    gradient: TEAM_COLORS.TEAM_B.gradient,
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
    id: 'A' | 'B';
    name: string;
    captain: string;
    members: string[];
    color: string;
    gradient: string;
    score: number;
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
                    members: ['Baby', 'João', 'Álan', 'Matheus'],
                    color: TEAM_COLORS.TEAM_A.color,
                    gradient: TEAM_COLORS.TEAM_A.gradient,
                    score: 0
                },
                teamB: {
                    id: 'B',
                    name: 'Time B',
                    captain: 'Victor',
                    members: ['Victor', 'Átila', 'Bruno', 'Sand'],
                    color: TEAM_COLORS.TEAM_B.color,
                    gradient: TEAM_COLORS.TEAM_B.gradient,
                    score: 0
                }
            }
        });
    } catch (error) {
        console.error('Failed to reset teams.json:', error);
        throw error;
    }
}; 