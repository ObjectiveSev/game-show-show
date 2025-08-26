import type { MaestroBillyConfig } from '../types/maestroBilly';
import { API_ENDPOINTS } from '../constants';

export const carregarMaestroBilly = async (): Promise<MaestroBillyConfig> => {
    try {
        const response = await fetch(API_ENDPOINTS.MAESTRO_BILLY);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: MaestroBillyConfig = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar configuração do Maestro Billy:', error);
        throw error;
    }
};
