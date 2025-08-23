export interface Pokemon {
    id: string;
    nome: string;
}

export interface QuemEEssePokemonConfig {
    pontuacao: {
        acerto: number;
        erro: number;
    };
    pokemons: Pokemon[];
}

export interface PokemonEstado {
    id: string;
    jogado: boolean;
    timeAdivinhador?: 'A' | 'B';
    resultado?: 'acerto' | 'erro';
    pontos?: number;
    pontuacaoSalva?: boolean;
}

export interface QuemEEssePokemonScoreEntry {
    pokemonId: string;
    timeAdivinhador: 'A' | 'B';
    resultado: 'acerto' | 'erro';
    pontos: number;
    timestamp: number;
}
