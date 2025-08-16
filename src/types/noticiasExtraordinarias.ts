export interface Noticia {
    id: string;
    manchete: string;
    subtitulo: string;
    resposta: boolean; // true = VERDADE, false = MENTIRA
}

export interface NoticiaEstado {
    id: string;
    lida: boolean;
    timeAdivinhador?: 'A' | 'B';
    respostaEscolhida?: boolean;
    acertou?: boolean;
    pontuacaoSalva?: boolean;
}

export interface PontuacaoConfig {
    acerto: number; // pontos por resposta certa
}

export interface NoticiasExtraordinariasData {
    noticias: Noticia[];
    pontuacao: PontuacaoConfig;
}

export interface NoticiasExtraordinariasScoreEntry {
    noticiaId: string;
    manchete: string;
    timeAdivinhador: 'A' | 'B';
    respostaEscolhida: boolean;
    respostaCorreta: boolean;
    acertou: boolean;
    pontos: number;
    timestamp: number;
} 