export interface Participante {
    id: string;
    nome: string;
}

export interface FatoPainelista {
    id: string;
    texto: string;
    verdadeiro: boolean;
}

export interface JogadorFatos {
    participanteId: string;
    fatos: FatoPainelista[];
}

export interface PainelistasPontuacaoConfig {
    acerto: number;
    erro: number;
    fatoNaoFornecido: number;
    fatosEsperadosPorJogador: number;
}

export interface PainelistasData {
    jogadores: JogadorFatos[];
    pontuacao: PainelistasPontuacaoConfig;
}

export interface FatoEstado {
    id: string;
    lido: boolean;
    verificado: boolean;
    acertou?: boolean;
    pontuacaoSalva?: boolean;
}

export interface PunicaoEstado {
    participanteId: string;
    time: 'A' | 'B';
    ativa: boolean;
    timestamp: number;
}

export interface PainelistasScoreEntry {
    fatoId: string;
    participanteId: string;
    participanteNome: string; // Nome do participante
    fatoTexto: string; // Texto do fato
    timeParticipante: 'A' | 'B';
    timeAdivinhador: 'A' | 'B';
    acertou: boolean;
    pontos: number;
    timestamp: number;
}

export interface PainelistasPunicaoEntry {
    participanteId: string;
    time: 'A' | 'B';
    pontos: number;
    timestamp: number;
}

