import type { VerdadesAbsurdasData, Verdade } from '../types/verdadesAbsurdas';
import { API_ENDPOINTS, TIMEOUT_CONFIG } from '../constants';

export const carregarVerdadesAbsurdas = async (): Promise<VerdadesAbsurdasData> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_CONFIG.API_REQUEST);

    try {
        const response = await fetch(API_ENDPOINTS.VERDADES_ABSURDAS, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Erro ao carregar verdades absurdas: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            throw new Error('Timeout ao carregar verdades absurdas');
        }
        throw err;
    }
};

// Função para extrair o texto de uma verdade usando índices
export const extrairTextoVerdade = (textoCompleto: string, verdade: Verdade): string => {
    return textoCompleto.substring(verdade.inicio, verdade.fim);
};

// Função para verificar se uma posição está dentro de uma verdade
export const posicaoEstaNaVerdade = (posicao: number, verdade: Verdade): boolean => {
    return posicao >= verdade.inicio && posicao < verdade.fim;
};

// Função para encontrar o índice da verdade baseado na posição
export const encontrarIndiceVerdade = (posicao: number, verdades: Verdade[]): number => {
    return verdades.findIndex(verdade => posicaoEstaNaVerdade(posicao, verdade));
}; 