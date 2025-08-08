import type { VerdadesAbsurdasScoreEntry } from '../types/verdadesAbsurdas';

const SCORES_KEY = 'verdadesAbsurdasScores';

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

