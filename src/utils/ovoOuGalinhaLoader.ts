import type { OvoOuGalinhaConfig } from '../types/ovoOuGalinha';

export const carregarOvoOuGalinha = async (): Promise<OvoOuGalinhaConfig> => {
    try {
        const response = await fetch('/config/ovo-ou-galinha.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data as OvoOuGalinhaConfig;
    } catch (error) {
        console.error('Erro ao carregar configuração do Ovo ou a Galinha:', error);
        throw error;
    }
}; 