import type { DicionarioData } from '../types/dicionarioSurreal';
import { API_ENDPOINTS, TIMEOUT_CONFIG } from '../constants';

export const carregarDicionarioSurreal = async (): Promise<DicionarioData> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_CONFIG.API_REQUEST);

    try {
        const response = await fetch(API_ENDPOINTS.DICIONARIO_SURREAL, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Erro ao carregar dicionário surreal: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            throw new Error('Timeout ao carregar dicionário surreal');
        }
        throw err;
    }
};

