/**
 * CONSTANTES DO GAME SHOW SHOW
 * Organizadas por função para facilitar manutenção e reutilização
 */

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
    TEAMS_CONFIG: 'teamsJsonFile',
    GAME_SCORES: 'gameShowScores',
    GAME_SHOW_SCORES: 'gameShowShowScores',
    VERDADES_ABSURDAS_ESTADOS: 'verdadesAbsurdasEstados',
    VERDADES_ABSURDAS_SCORES: 'verdadesAbsurdasScores',
    DICIONARIO_SURREAL_ESTADOS: 'dicionarioSurrealEstados',
    DICIONARIO_SURREAL_SCORES: 'dicionarioSurrealScores',
    PAINELISTAS_ESTADOS: 'painelistasEstados',
    PAINELISTAS_SCORES: 'painelistasScores',
    PAINELISTAS_PUNICOES: 'painelistasPunicoes',
    NOTICIAS_EXTRAORDINARIAS_ESTADOS: 'noticiasEstados',
    NOTICIAS_EXTRAORDINARIAS_SCORES: 'noticiasExtraordinariasScores',
    CARO_PRA_CHUCHU_ESTADOS: 'caroPraChuchuEstados',
    CARO_PRA_CHUCHU_SCORES: 'caroPraChuchuScores',
    OVO_OU_GALINHA_ESTADOS: 'ovoOuGalinhaEstados',
    OVO_OU_GALINHA_SCORES: 'ovoOuGalinhaScores'
} as const;

// ============================================================================
// API ENDPOINTS E URLs
// ============================================================================

export const API_ENDPOINTS = {
    GAMES_CONFIG: '/config/games.json',
    PARTICIPANTES: '/config/participantes.json',
    VERDADES_ABSURDAS: '/config/verdades-absurdas.json',
    DICIONARIO_SURREAL: '/config/dicionario-surreal.json',
    PAINELISTAS_EXCENTRICOS: '/config/painelistas-excentricos.json',
    NOTICIAS_EXTRAORDINARIAS: '/config/noticias-extraordinarias.json',
    CARO_PRA_CHUCHU: '/config/caro-pra-chuchu.json',
    OVO_OU_GALINHA: '/config/ovo-ou-galinha.json'
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