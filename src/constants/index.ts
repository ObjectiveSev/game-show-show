/**
 * CONSTANTES DO GAME SHOW SHOW
 * Organizadas por função para facilitar manutenção e reutilização
 */

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
    // Configurações principais
    TEAMS_CONFIG: 'teamsJsonFile',
    GAME_SCORES: 'gameShowScores',
    GAME_SHOW_SCORES: 'gameShowShowScores',

    // Estados dos jogos
    VERDADES_ABSURDAS_ESTADOS: 'verdadesAbsurdasEstados',
    DICIONARIO_SURREAL_ESTADOS: 'dicionarioSurrealEstados',
    PAINELISTAS_ESTADOS: 'painelistasEstados',

    // Scores dos jogos
    VERDADES_ABSURDAS_SCORES: 'verdadesAbsurdasScores',
    DICIONARIO_SURREAL_SCORES: 'dicionarioSurrealScores',
    PAINELISTAS_SCORES: 'painelistasScores',
    PAINELISTAS_PUNICOES: 'painelistasPunicoes',
} as const;

// ============================================================================
// API ENDPOINTS E URLs
// ============================================================================

export const API_ENDPOINTS = {
    // Configurações
    GAMES_CONFIG: '/config/games.json',
    PARTICIPANTES: '/config/participantes.json',

    // Jogos
    VERDADES_ABSURDAS: '/config/verdades-absurdas.json',
    DICIONARIO_SURREAL: '/config/dicionario-surreal.json',
    PAINELISTAS_EXCENTRICOS: '/config/painelistas-excentricos.json',
} as const;

// ============================================================================
// CONFIGURAÇÕES DE TIMEOUT
// ============================================================================

export const TIMEOUT_CONFIG = {
    API_REQUEST: 10000, // 10 segundos
} as const;

// ============================================================================
// CONFIGURAÇÕES DE CORES DOS TIMES
// ============================================================================

export const TEAM_COLORS = {
    TEAM_A: {
        color: '#ff6b6b',
        gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    },
    TEAM_B: {
        color: '#4ecdc4',
        gradient: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
    },
} as const; 