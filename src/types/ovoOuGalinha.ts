export interface OvoOuGalinhaEvent {
    id: string;
    text: string;
    year: number;
}

export interface OvoOuGalinhaTrio {
    id: number;
    events: OvoOuGalinhaEvent[];
    ordem: string[];
}

export interface OvoOuGalinhaConfig {
    trios: OvoOuGalinhaTrio[];
    pontuacao: {
        acerto: number;
    };
}

export interface OvoOuGalinhaScoreEntry {
    trioId: number;
    timeAdivinhador: string;
    pontos: number;
    timestamp: number;
}

export interface OvoOuGalinhaGameState {
    triosCompletados: number[];
    pontuacaoTotal: number;
} 