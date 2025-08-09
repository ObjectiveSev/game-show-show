import type { DicionarioData, DicionarioPontuacaoConfig } from '../types/dicionarioSurreal';

export const carregarDicionarioSurreal = async (): Promise<DicionarioData> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('/config/dicionario-surreal.json', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Erro ao carregar dicionario: ${response.status}`);

        const raw = await response.json();
        const defaults: DicionarioPontuacaoConfig = { baseAcerto: 3, pontosPorDica: 1 };
        const data: DicionarioData = {
            palavras: raw.palavras || [],
            pontuacao: raw.pontuacao ?? defaults
        };
        return data;
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            throw new Error('Timeout ao carregar dicionário');
        }
        throw err;
    }
};

