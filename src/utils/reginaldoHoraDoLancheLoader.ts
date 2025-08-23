import { API_ENDPOINTS } from '../constants';
import type { ReginaldoHoraDoLancheConfig } from '../types/reginaldoHoraDoLanche';

export const carregarReginaldoHoraDoLanche = async (): Promise<ReginaldoHoraDoLancheConfig> => {
    const response = await fetch(API_ENDPOINTS.REGINALDO_HORA_DO_LANCHE);
    if (!response.ok) {
        throw new Error(`Erro ao carregar configuração: ${response.status}`);
    }
    return response.json();
};
