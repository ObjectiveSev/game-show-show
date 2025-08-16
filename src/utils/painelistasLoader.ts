import type { PainelistasData, PainelistasPontuacaoConfig } from '../types/painelistas';
import type { GamesConfig, GameConfig } from '../types/games';
import { API_ENDPOINTS, TIMEOUT_CONFIG } from '../constants';

export const carregarPainelistas = async (): Promise<PainelistasData> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_CONFIG.API_REQUEST);

    try {
        const res = await fetch(API_ENDPOINTS.PAINELISTAS_EXCENTRICOS, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`Erro ao carregar painelistas: ${res.status}`);

        const raw = await res.json();

        // Configurações padrão
        const defaultsPontuacao: PainelistasPontuacaoConfig = {
            acerto: 4,
            erro: 0,
            fatoNaoFornecido: -2,
            fatosEsperadosPorJogador: 2
        };

        const data: PainelistasData = {
            jogadores: Array.isArray(raw.jogadores) ? raw.jogadores : [],
            pontuacao: raw.pontuacao ?? defaultsPontuacao
        };

        return data;
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            throw new Error('Timeout ao carregar painelistas');
        }
        throw err;
    }
};

export const obterJogoPorId = (games: GamesConfig, gameId: string): GameConfig | undefined => {
    return games.games.find((game: GameConfig) => game.id === gameId);
};

