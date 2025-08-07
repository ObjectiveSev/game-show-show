import type { VerdadesAbsurdasData, Verdade } from '../types/verdadesAbsurdas';

export const carregarVerdadesAbsurdas = async (): Promise<VerdadesAbsurdasData> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

        const response = await fetch('/config/verdades-absurdas.json', {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Erro ao carregar verdades absurdas: ${response.status}`);
        }

        const data: VerdadesAbsurdasData = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.error('❌ Timeout ao carregar verdades absurdas');
            throw new Error('Timeout ao carregar dados');
        }
        console.error('❌ Erro ao carregar verdades absurdas:', error);
        throw error;
    }
};

// Função para extrair o texto de uma verdade usando índices
export const extrairTextoVerdade = (textoCompleto: string, verdade: Verdade): string => {
    return textoCompleto.substring(verdade.inicio, verdade.fim);
};

// Função para verificar se uma posição está dentro de uma verdade
export const posicaoEstaNaVerdade = (posicao: number, verdade: Verdade): boolean => {
    return posicao >= verdade.inicio && posicao <= verdade.fim;
};

// Função para encontrar o índice da verdade baseado na posição
export const encontrarIndiceVerdade = (posicao: number, verdades: Verdade[]): number => {
    return verdades.findIndex(verdade => posicaoEstaNaVerdade(posicao, verdade));
}; 