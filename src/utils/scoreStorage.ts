import type { VerdadesAbsurdasScoreEntry } from '../types/verdadesAbsurdas';
import type { DicionarioScoreEntry } from '../types/dicionarioSurreal';
import type { PainelistasScoreEntry, PainelistasPunicaoEntry } from '../types/painelistas';
import { STORAGE_KEYS } from '../constants';

export const loadVerdadesAbsurdasScores = (): VerdadesAbsurdasScoreEntry[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.VERDADES_ABSURDAS_SCORES);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as VerdadesAbsurdasScoreEntry[]) : [];
    } catch {
        return [];
    }
};

export const appendVerdadesAbsurdasScore = (entry: VerdadesAbsurdasScoreEntry): void => {
    try {
        const scores = loadVerdadesAbsurdasScores();
        scores.push(entry);
        localStorage.setItem(STORAGE_KEYS.VERDADES_ABSURDAS_SCORES, JSON.stringify(scores));
    } catch {
        // noop
    }
};

export const clearVerdadesAbsurdasScores = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.VERDADES_ABSURDAS_SCORES);
    } catch {
        // Ignorar erros de localStorage
    }
};

export const loadDicionarioSurrealScores = (): DicionarioScoreEntry[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.DICIONARIO_SURREAL_SCORES);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as DicionarioScoreEntry[]) : [];
    } catch {
        return [];
    }
};

export const appendDicionarioSurrealScore = (entry: DicionarioScoreEntry): void => {
    try {
        const list = loadDicionarioSurrealScores();
        list.push(entry);
        localStorage.setItem(STORAGE_KEYS.DICIONARIO_SURREAL_SCORES, JSON.stringify(list));
    } catch {
        // noop
    }
};

export const clearDicionarioSurrealScores = (): void => {
    try { localStorage.removeItem(STORAGE_KEYS.DICIONARIO_SURREAL_SCORES); } catch {
        // Ignorar erros de localStorage
    }
};

export const loadPainelistasScores = (): PainelistasScoreEntry[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.PAINELISTAS_SCORES);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as PainelistasScoreEntry[]) : [];
    } catch {
        return [];
    }
};

export const appendPainelistasScore = (entry: PainelistasScoreEntry): void => {
    try {
        const list = loadPainelistasScores();
        list.push(entry);
        localStorage.setItem(STORAGE_KEYS.PAINELISTAS_SCORES, JSON.stringify(list));
    } catch { /* noop */ }
};

export const clearPainelistasScores = (): void => {
    try { localStorage.removeItem(STORAGE_KEYS.PAINELISTAS_SCORES); } catch {
        // Ignorar erros de localStorage
    }
};

// Funções para punições
export const loadPainelistasPunicoes = (): PainelistasPunicaoEntry[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.PAINELISTAS_PUNICOES);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as PainelistasPunicaoEntry[]) : [];
    } catch {
        return [];
    }
};

export const appendPainelistasPunicao = (entry: PainelistasPunicaoEntry): void => {
    try {
        const list = loadPainelistasPunicoes();
        list.push(entry);
        localStorage.setItem(STORAGE_KEYS.PAINELISTAS_PUNICOES, JSON.stringify(list));
    } catch { /* noop */ }
};

export const removePainelistasPunicao = (participanteId: string): void => {
    try {
        const list = loadPainelistasPunicoes();
        const filtered = list.filter(p => p.participanteId !== participanteId);
        localStorage.setItem(STORAGE_KEYS.PAINELISTAS_PUNICOES, JSON.stringify(filtered));
    } catch { /* noop */ }
};

export const clearPainelistasPunicoes = (): void => {
    try { localStorage.removeItem(STORAGE_KEYS.PAINELISTAS_PUNICOES); } catch {
        // Ignorar erros de localStorage
    }
};

