import type { GamesConfig } from '../types/games';
import { API_ENDPOINTS, TIMEOUT_CONFIG } from '../constants';

export const carregarConfiguracaoJogos = async (): Promise<GamesConfig> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_CONFIG.API_REQUEST);

    try {
        const res = await fetch(API_ENDPOINTS.GAMES_CONFIG, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`Erro ao carregar games: ${res.status}`);

        const data = await res.json();
        return data;
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            throw new Error('Timeout ao carregar games');
        }
        throw err;
    }
};

export const obterJogoPorId = (games: GamesConfig, gameId: string) => {
    return games.games.find(game => game.id === gameId);
}; 