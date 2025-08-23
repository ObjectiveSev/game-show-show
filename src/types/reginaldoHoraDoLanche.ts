export interface Comida {
    id: string;
    nome: string;
}

export interface ReginaldoHoraDoLancheConfig {
    pontuacao: {
        acerto: number;
        erro: number;
    };
    comidas: Comida[];
}

export interface ComidaEstado {
    id: string;
    jogado: boolean;
    timeAdivinhador?: 'A' | 'B';
    resultado?: 'acerto' | 'erro';
    pontos?: number;
    pontuacaoSalva?: boolean;
}

export interface ReginaldoHoraDoLancheScoreEntry {
    id: string;
    nome: string;
    timeAdivinhador: 'A' | 'B';
    resultado: 'acerto' | 'erro';
    pontos: number;
    timestamp: number;
}
