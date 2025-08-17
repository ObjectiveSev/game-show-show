import type { CaroPraChuchuData } from '../types/caroPraChuchu';
import { API_ENDPOINTS, TIMEOUT_CONFIG } from '../constants';

export const carregarCaroPraChuchu = async (): Promise<CaroPraChuchuData> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_CONFIG.API_REQUEST);

        const response = await fetch(API_ENDPOINTS.CARO_PRA_CHUCHU, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data as CaroPraChuchuData;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Timeout ao carregar Caro Pra Chuchu');
        }
        throw new Error(`Erro ao carregar Caro Pra Chuchu: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
}; 