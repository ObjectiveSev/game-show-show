import type { QuemEEssePokemonConfig } from '../types/quemEEssePokemon';
import { API_ENDPOINTS } from '../constants';

export const carregarQuemEEssePokemon = async (): Promise<QuemEEssePokemonConfig> => {
    try {
        const response = await fetch(API_ENDPOINTS.QUEM_E_ESSE_POKEMON);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data: QuemEEssePokemonConfig = await response.json();
        
        // Validação básica dos dados
        if (!data.pokemons || !Array.isArray(data.pokemons)) {
            throw new Error('Dados de pokémon inválidos');
        }
        
        if (!data.pontuacao || typeof data.pontuacao.acerto !== 'number') {
            throw new Error('Configuração de pontuação inválida');
        }
        
        return data;
    } catch (error) {
        console.error('Erro ao carregar dados do Quem é esse Pokémon:', error);
        throw error;
    }
};
