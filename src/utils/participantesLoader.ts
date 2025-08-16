import type { Participante } from '../types/painelistas';
import { API_ENDPOINTS, TIMEOUT_CONFIG } from '../constants';

export const carregarParticipantes = async (): Promise<Participante[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_CONFIG.API_REQUEST);

    try {
        const res = await fetch(API_ENDPOINTS.PARTICIPANTES, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`Erro ao carregar participantes: ${res.status}`);

        const data = await res.json();
        // O arquivo é um array direto, não tem propriedade 'participantes'
        return Array.isArray(data) ? data : [];
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            throw new Error('Timeout ao carregar participantes');
        }
        throw err;
    }
};

