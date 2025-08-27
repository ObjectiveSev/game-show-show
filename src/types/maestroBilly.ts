export interface Musica {
    id: string;
    nome: string;
    artista: string;
    arquivo: string;
}

export interface PontuacaoTentativa {
    musica: number;
    artista: number;
}

export interface MaestroBillyConfig {
    pontuacao: PontuacaoTentativa[];
    erro: number;
    musicas: Musica[];
}

export interface MusicaEstado {
    id: string;
    lida: boolean;
    acertouNome: boolean;
    acertouArtista: boolean;
    tentativas: number;
    pontosNome: number;
    pontosArtista: number;
    ninguemAcertou?: boolean;
}

export interface MaestroBillyScoreEntry {
    musicaId: string;
    nomeMusica: string;
    artista: string;
    arquivo: string;
    timeAdivinhador: 'A' | 'B';
    tentativa: number;
    acertouNome: boolean;
    acertouArtista: boolean;
    pontosNome: number;
    pontosArtista: number;
    totalPontos: number;
    batePronto: boolean;
    ninguemAcertou?: boolean;
}
