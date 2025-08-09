import type { VerdadesAbsurdasScoreEntry } from '../types/verdadesAbsurdas';
import type { DicionarioScoreEntry } from '../types/dicionarioSurreal';

const SCORES_KEY = 'verdadesAbsurdasScores';
const DICIONARIO_SCORES_KEY = 'dicionarioSurrealScores';

export const loadVerdadesAbsurdasScores = (): VerdadesAbsurdasScoreEntry[] => {
    try {
        const raw = localStorage.getItem(SCORES_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as VerdadesAbsurdasScoreEntry[];
        return [];
    } catch {
        return [];
    }
};

export const appendVerdadesAbsurdasScore = (entry: VerdadesAbsurdasScoreEntry): void => {
    try {
        const scores = loadVerdadesAbsurdasScores();
        scores.push(entry);
        localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
    } catch {
        // noop
    }
};

export const clearVerdadesAbsurdasScores = (): void => {
    try {
        localStorage.removeItem(SCORES_KEY);
    } catch {
        // noop
    }
};

export const loadDicionarioSurrealScores = (): DicionarioScoreEntry[] => {
    try {
        const raw = localStorage.getItem(DICIONARIO_SCORES_KEY);
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
        localStorage.setItem(DICIONARIO_SCORES_KEY, JSON.stringify(list));
    } catch {
        // noop
    }
};

export const clearDicionarioSurrealScores = (): void => {
    try { localStorage.removeItem(DICIONARIO_SCORES_KEY); } catch { }
};

