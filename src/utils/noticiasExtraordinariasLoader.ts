import type { NoticiasExtraordinariasData } from '../types/noticiasExtraordinarias';
import { API_ENDPOINTS, TIMEOUT_CONFIG } from '../constants';

export const carregarNoticiasExtraordinarias = async (): Promise<NoticiasExtraordinariasData> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_CONFIG.API_REQUEST);

        const response = await fetch(API_ENDPOINTS.NOTICIAS_EXTRAORDINARIAS, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data as NoticiasExtraordinariasData;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Timeout ao carregar notícias extraordinárias');
        }
        throw new Error(`Erro ao carregar notícias extraordinárias: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
}; 