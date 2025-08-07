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

export interface VerdadesAbsurdasData {
    verdadesAbsurdas: VerdadeAbsurda[];
}

export interface TextoEstado {
    id: string;
    lido: boolean;
    verdadesEncontradas: number[]; // índices das verdades encontradas
    erros: number;
    verdadesReveladas: boolean;
} 