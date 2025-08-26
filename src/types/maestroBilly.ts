export interface Musica {
    id: string;
    nome: string;
    artista: string;
    arquivo: string;
}

export interface PontuacaoTentativa {
    nomeMusica: number;
    artista: number;
}

export interface MaestroBillyConfig {
    pontuacao: {
        primeiraTentativa: PontuacaoTentativa;
        segundaTentativa: PontuacaoTentativa;
        terceiraTentativa: PontuacaoTentativa;
        erro: number;
    };
    musicas: Musica[];
}

export interface MusicaEstado {
    id: string;
    tentativas: number;
    acertouNome: boolean;
    acertouArtista: boolean;
    pontosNome: number;
    pontosArtista: number;
    lida: boolean;
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
    timestamp: number;
}
