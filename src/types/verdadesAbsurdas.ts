export interface Verdade {
    inicio: number;
    fim: number;
}

export interface VerdadeAbsurda {
    id: string;
    titulo: string;
    texto: string;
    verdades: Verdade[];
}

export interface PontuacaoConfig {
    acertoVerdade: number; // pontos por verdade encontrada pelo rival
    erroFalso: number; // pontos subtraídos por apontar falso como verdade
    verdadeNaoEncontradaPeloRival: number; // pontos para o leitor por verdade não encontrada
}

export interface VerdadesAbsurdasData {
    verdadesAbsurdas: VerdadeAbsurda[];
    pontuacao: PontuacaoConfig;
}

export interface TextoEstado {
    id: string;
    lido: boolean;
    verdadesEncontradas: number[]; // índices das verdades encontradas
    erros: number;
    verdadesReveladas: boolean;
    pontuacaoSalva?: boolean; // evita salvar pontuação duas vezes
}

export interface VerdadesAbsurdasScoreEntry {
    textoId: string;
    timeLeitor: 'A' | 'B';
    timeAdivinhador: 'A' | 'B';
    verdadesEncontradas: number; // pelo rival
    verdadesNaoEncontradas: number; // pelo rival
    erros: number; // do rival
    pontosLeitor: number;
    pontosAdivinhador: number;
    verdadesAcertadasIndices: number[];
    timestamp: number;
}