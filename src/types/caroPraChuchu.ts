export interface ItemCaroPraChuchu {
    id: string;
    nome: string;
    local: string;
    data: string;
    contexto: string;
    precoReal: string;
    imagem: string;
}

export interface PontuacaoConfig {
    moedaCorreta: number;
    pertoSuficiente: number;
    acertoLendario: number;
    erro: number;
}

export interface CaroPraChuchuData {
    itens: ItemCaroPraChuchu[];
    pontuacao: PontuacaoConfig;
}

export interface ItemEstado {
    id: string;
    lido: boolean;
    timeAdivinhador?: 'A' | 'B';
    tipoAcerto?: 'moedaCorreta' | 'pertoSuficiente' | 'acertoLendario' | 'erro';
    pontos?: number;
    pontuacaoSalva?: boolean;
}

export interface CaroPraChuchuScoreEntry {
    itemId: string;
    nomeItem: string;
    timeAdivinhador: 'A' | 'B';
    tipoAcerto: 'moedaCorreta' | 'pertoSuficiente' | 'acertoLendario' | 'erro';
    pontos: number;
    timestamp: number;
} 