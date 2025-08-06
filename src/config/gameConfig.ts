import { Team } from '../types';

export interface GameConfig {
    teams: {
        teamA: Team;
        teamB: Team;
    };
    settings: {
        defaultPoints: number;
        maxScore: number;
        enableSound: boolean;
        enableAnimations: boolean;
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
    },
    settings: {
        defaultPoints: 1,
        maxScore: 100,
        enableSound: true,
        enableAnimations: true
    }
};

// Function to load custom config from localStorage or use default
export const loadGameConfig = (): GameConfig => {
    const savedConfig = localStorage.getItem('gameShowConfig');
    if (savedConfig) {
        try {
            const parsed = JSON.parse(savedConfig);
            return { ...defaultGameConfig, ...parsed };
        } catch (error) {
            console.warn('Failed to parse saved config, using default:', error);
        }
    }
    return defaultGameConfig;
};

// Function to save config to localStorage
export const saveGameConfig = (config: GameConfig): void => {
    localStorage.setItem('gameShowConfig', JSON.stringify(config));
};

// Function to reset config to default
export const resetGameConfig = (): void => {
    localStorage.removeItem('gameShowConfig');
}; 