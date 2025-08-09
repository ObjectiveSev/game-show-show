export interface DicionarioDefinicao {
    id: string;
    texto: string;
    dica: string; // texto livre
}

export interface DicionarioDica {
    id: string;
    texto: string;
}

export interface DicionarioPalavra {
    id: string;
    palavra: string;
    definicoes: DicionarioDefinicao[];
    definicaoCorretaId: string;
}

export interface DicionarioPontuacaoConfig {
    baseAcerto: number;
    pontosPorDica: number;
}

export interface DicionarioData {
    palavras: DicionarioPalavra[];
    pontuacao: DicionarioPontuacaoConfig;
}

export interface PalavraEstado {
    id: string;
    dicasAbertas: boolean[]; // uma flag por definição para sabermos quantas dicas foram abertas
    respostaSelecionada?: string; // id da definicao escolhida
    extras: number; // ajustes manuais (+/-)
    lido: boolean;
    pontuacaoSalva?: boolean;
}

export interface DicionarioScoreEntry {
    palavraId: string;
    timeAdivinhador: 'A' | 'B';
    acertou: boolean;
    dicasAbertas: number;
    pontos: number;
    definicaoMarcadaId: string;
    timestamp: number;
}

