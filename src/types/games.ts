export interface GameConfig {
    id: string;
    name: string;
    emoji: string;
    description: string;
    configFile: string;
}

export interface GamesConfig {
    games: GameConfig[];
} 