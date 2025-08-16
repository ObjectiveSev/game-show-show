// Utilitário para sincronização de scores entre diferentes jogos e o estado principal

import type { GameScores } from '../types';
import { STORAGE_KEYS } from '../constants';

interface VerdadesAbsurdasEntry {
    timeLeitor: 'A' | 'B';
    timeAdivinhador: 'A' | 'B';
    pontosLeitor?: number;
    pontosAdivinhador?: number;
}

interface DicionarioEntry {
    timeAdivinhador: 'A' | 'B';
    pontos?: number;
}

interface PainelistasEntry {
    timeAdivinhador: 'A' | 'B';
    pontos?: number;
}

export interface ScoreSyncResult {
    success: boolean;
    message: string;
    updatedScores?: GameScores;
}

/**
 * Sincroniza os scores dos jogos individuais com o estado principal
 */
export const syncGameScores = async (): Promise<ScoreSyncResult> => {
    try {
        // Carregar scores de Verdades Absurdas
        const vaRaw = localStorage.getItem(STORAGE_KEYS.VERDADES_ABSURDAS_SCORES);
        const vaEntries = vaRaw ? JSON.parse(vaRaw) : [];
        const vaTotals = Array.isArray(vaEntries)
            ? vaEntries.reduce(
                (acc: { A: number; B: number }, e: VerdadesAbsurdasEntry) => {
                    acc.A += (e.timeLeitor === 'A' ? e.pontosLeitor || 0 : 0) + (e.timeAdivinhador === 'A' ? e.pontosAdivinhador || 0 : 0);
                    acc.B += (e.timeLeitor === 'B' ? e.pontosLeitor || 0 : 0) + (e.timeAdivinhador === 'B' ? e.pontosAdivinhador || 0 : 0);
                    return acc;
                },
                { A: 0, B: 0 }
            )
            : { A: 0, B: 0 };

        // Carregar scores de Dicionário Surreal
        const dsRaw = localStorage.getItem(STORAGE_KEYS.DICIONARIO_SURREAL_SCORES);
        const dsEntries = dsRaw ? JSON.parse(dsRaw) : [];
        const dsTotals = Array.isArray(dsEntries)
            ? dsEntries.reduce(
                (acc: { A: number; B: number }, e: DicionarioEntry) => {
                    if (e.timeAdivinhador === 'A') acc.A += e.pontos || 0;
                    if (e.timeAdivinhador === 'B') acc.B += e.pontos || 0;
                    return acc;
                },
                { A: 0, B: 0 }
            )
            : { A: 0, B: 0 };

        // Carregar scores de Painelistas Excêntricos
        const peRaw = localStorage.getItem(STORAGE_KEYS.PAINELISTAS_SCORES);
        const peEntries = peRaw ? JSON.parse(peRaw) : [];
        const peTotals = Array.isArray(peEntries)
            ? peEntries.reduce(
                (acc: { A: number; B: number }, e: PainelistasEntry) => {
                    if (e.timeAdivinhador === 'A') acc.A += e.pontos || 0;
                    if (e.timeAdivinhador === 'B') acc.B += e.pontos || 0;
                    return acc;
                },
                { A: 0, B: 0 }
            )
            : { A: 0, B: 0 };

        // Carregar punições de Painelistas Excêntricos
        const pePunicoesRaw = localStorage.getItem(STORAGE_KEYS.PAINELISTAS_PUNICOES);
        const pePunicoes = pePunicoesRaw ? JSON.parse(pePunicoesRaw) : [];
        const pePunicoesTotals = Array.isArray(pePunicoes)
            ? pePunicoes.reduce(
                (acc: { A: number; B: number }, e: { time: 'A' | 'B'; pontos: number }) => {
                    if (e.time === 'A') acc.A += e.pontos || 0;
                    if (e.time === 'B') acc.B += e.pontos || 0;
                    return acc;
                },
                { A: 0, B: 0 }
            )
            : { A: 0, B: 0 };

        // Combinar scores normais com punições
        const peCompleto = {
            A: peTotals.A + pePunicoesTotals.A,
            B: peTotals.B + pePunicoesTotals.B
        };

        // Criar objeto de scores consolidado
        const consolidatedScores: GameScores = {
            'verdades-absurdas': { teamA: vaTotals.A, teamB: vaTotals.B },
            'dicionario-surreal': { teamA: dsTotals.A, teamB: dsTotals.B },
            'painelistas-excentricos': { teamA: peCompleto.A, teamB: peCompleto.B }
        };

        // Salvar no localStorage principal
        localStorage.setItem(STORAGE_KEYS.GAME_SHOW_SCORES, JSON.stringify({
            gameScores: consolidatedScores
        }));

        return {
            success: true,
            message: 'Scores sincronizados com sucesso!',
            updatedScores: consolidatedScores
        };

    } catch (error) {
        console.error('❌ Erro ao sincronizar scores:', error);
        return {
            success: false,
            message: 'Erro ao sincronizar scores: ' + (error as Error).message
        };
    }
};

/**
 * Verifica se há inconsistências entre os scores dos jogos individuais e o estado principal
 */
export const checkScoreConsistency = (): {
    isConsistent: boolean;
    inconsistencies: string[];
    details: Record<string, { individual: number; consolidated: number }>;
} => {
    try {
        const consolidatedRaw = localStorage.getItem(STORAGE_KEYS.GAME_SHOW_SCORES);
        const consolidated = consolidatedRaw ? JSON.parse(consolidatedRaw) : { gameScores: {} };

        const inconsistencies: string[] = [];
        const details: Record<string, { individual: number; consolidated: number }> = {};

        // Verificar Verdades Absurdas
        const vaRaw = localStorage.getItem(STORAGE_KEYS.VERDADES_ABSURDAS_SCORES);
        const vaEntries = vaRaw ? JSON.parse(vaRaw) : [];
        const vaIndividual = Array.isArray(vaEntries)
            ? vaEntries.reduce(
                (acc: { A: number; B: number }, e: VerdadesAbsurdasEntry) => {
                    acc.A += (e.timeLeitor === 'A' ? e.pontosLeitor || 0 : 0) + (e.timeAdivinhador === 'A' ? e.pontosAdivinhador || 0 : 0);
                    acc.B += (e.timeLeitor === 'B' ? e.pontosLeitor || 0 : 0) + (e.timeAdivinhador === 'B' ? e.pontosAdivinhador || 0 : 0);
                    return acc;
                },
                { A: 0, B: 0 }
            )
            : { A: 0, B: 0 };

        const vaConsolidated = consolidated.gameScores['verdades-absurdas'] || { teamA: 0, teamB: 0 };

        if (vaIndividual.A !== vaConsolidated.teamA || vaIndividual.B !== vaConsolidated.teamB) {
            inconsistencies.push('Verdades Absurdas');
            details['verdades-absurdas'] = {
                individual: vaIndividual.A + vaIndividual.B,
                consolidated: vaConsolidated.teamA + vaConsolidated.teamB
            };
        }

        // Verificar Dicionário Surreal
        const dsRaw = localStorage.getItem(STORAGE_KEYS.DICIONARIO_SURREAL_SCORES);
        const dsEntries = dsRaw ? JSON.parse(dsRaw) : [];
        const dsIndividual = Array.isArray(dsEntries)
            ? dsEntries.reduce(
                (acc: { A: number; B: number }, e: DicionarioEntry) => {
                    if (e.timeAdivinhador === 'A') acc.A += e.pontos || 0;
                    if (e.timeAdivinhador === 'B') acc.B += e.pontos || 0;
                    return acc;
                },
                { A: 0, B: 0 }
            )
            : { A: 0, B: 0 };

        const dsConsolidated = consolidated.gameScores['dicionario-surreal'] || { teamA: 0, teamB: 0 };

        if (dsIndividual.A !== dsConsolidated.teamA || dsIndividual.B !== dsConsolidated.teamB) {
            inconsistencies.push('Dicionário Surreal');
            details['dicionario-surreal'] = {
                individual: dsIndividual.A + dsIndividual.B,
                consolidated: dsConsolidated.teamA + dsConsolidated.teamB
            };
        }

        // Verificar Painelistas Excêntricos
        const peRaw = localStorage.getItem(STORAGE_KEYS.PAINELISTAS_SCORES);
        const peEntries = peRaw ? JSON.parse(peRaw) : [];
        const peIndividual = Array.isArray(peEntries)
            ? peEntries.reduce(
                (acc: { A: number; B: number }, e: PainelistasEntry) => {
                    if (e.timeAdivinhador === 'A') acc.A += e.pontos || 0;
                    if (e.timeAdivinhador === 'B') acc.B += e.pontos || 0;
                    return acc;
                },
                { A: 0, B: 0 }
            )
            : { A: 0, B: 0 };

        const peConsolidated = consolidated.gameScores['painelistas-excentricos'] || { teamA: 0, teamB: 0 };

        if (peIndividual.A !== peConsolidated.teamA || peIndividual.B !== peConsolidated.teamB) {
            inconsistencies.push('Painelistas Excêntricos');
            details['painelistas-excentricos'] = {
                individual: peIndividual.A + peIndividual.B,
                consolidated: peConsolidated.teamA + peConsolidated.teamB
            };
        }

        return {
            isConsistent: inconsistencies.length === 0,
            inconsistencies,
            details
        };

    } catch (error) {
        console.error('❌ Erro ao verificar consistência:', error);
        return {
            isConsistent: false,
            inconsistencies: ['Erro na verificação'],
            details: {}
        };
    }
};

/**
 * Limpa todos os scores consolidados
 */
export const clearConsolidatedScores = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.GAME_SHOW_SCORES);
        console.log('🗑️ Scores consolidados limpos!');
    } catch (error) {
        console.error('❌ Erro ao limpar scores consolidados:', error);
    }
}; 