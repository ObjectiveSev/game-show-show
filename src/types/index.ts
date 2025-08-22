// Tipos para o Game Show Show

export interface Team {
    id: 'A' | 'B';
    name: string;
    captain: string;
    members: string[];
    color: string;
    gradient: string;
    score: number;
}

export interface Game {
    id: string;
    name: string;
    icon: string;
    description: string;
    points: string;
    status: 'completed' | 'in-development' | 'pending';
    component?: React.ComponentType;
}

export interface GameScore {
    teamA: number;
    teamB: number;
}

export interface GameScores {
    [gameId: string]: GameScore;
}

export interface BuzzerState {
    active: boolean;
    winner: 'A' | 'B' | null;
    timer: number | null;
    timeLeft: number;
}

export interface AppState {
    teams: {
        teamA: Team;
        teamB: Team;
    };
    gameScores: GameScores;
    buzzer: BuzzerState;
}

// Tipos para jogos específicos
export interface VerdadesAbsurdasText {
    text: string;
    truths: string[];
}

export interface DicionarioSurrealWord {
    word: string;
    definitions: string[];
    correct: number;
}

export interface NoticiaExtraordinaria {
    title: string;
    real: boolean;
}

export interface CaroPraChuchuItem {
    item: string;
    price: number;
    hint: string;
}

// Tipos para configuração
export interface GameConfig {
    audio: {
        enabled: boolean;
        volume: number;
    };
    visual: {
        theme: string;
        animations: boolean;
        particles: boolean;
    };
    scoring: {
        defaultPoints: number;
        allowNegative: boolean;
        maxPoints: number;
    };
}

export const TagType = {
    PENDING: 'pending',
    ERROR: 'error',
    READ: 'read',
    CORRECT: 'correct'
} as const;

export type TagType = typeof TagType[keyof typeof TagType];

export const ButtonType = {
    RESET: 'reset',
    ERROR: 'error',
    REVEAL_TRUTH: 'reveal_truth',
    SAVE: 'save'
} as const;

export type ButtonType = typeof ButtonType[keyof typeof ButtonType];

export interface TagConfig {
    type: TagType;
    text: string;
    backgroundColor: string;
    textColor: string;
    icon: string;
} 