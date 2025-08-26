import type { VerdadesAbsurdasScoreEntry } from '../types/verdadesAbsurdas';
import type { DicionarioScoreEntry } from '../types/dicionarioSurreal';
import type { PainelistasScoreEntry, PainelistasPunicaoEntry } from '../types/painelistas';
import type { NoticiasExtraordinariasScoreEntry } from '../types/noticiasExtraordinarias';
import type { CaroPraChuchuScoreEntry } from '../types/caroPraChuchu';
import type { OvoOuGalinhaScoreEntry } from '../types/ovoOuGalinha';
import type { QuemEEssePokemonScoreEntry } from '../types/quemEEssePokemon';
import type { ReginaldoHoraDoLancheScoreEntry } from '../types/reginaldoHoraDoLanche';
import type { MaestroBillyScoreEntry } from '../types/maestroBilly';
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

export const removeVerdadesAbsurdasScore = (textoId: string): void => {
    try {
        const scores = loadVerdadesAbsurdasScores();
        const filtered = scores.filter(score => score.textoId !== textoId);
        localStorage.setItem(STORAGE_KEYS.VERDADES_ABSURDAS_SCORES, JSON.stringify(filtered));
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

// Notícias Extraordinárias
export const saveNoticiasExtraordinariasScore = (entry: NoticiasExtraordinariasScoreEntry): void => {
    try {
        const existing = loadNoticiasExtraordinariasScores();
        const updated = [...existing, entry];
        localStorage.setItem(STORAGE_KEYS.NOTICIAS_EXTRAORDINARIAS_SCORES, JSON.stringify(updated));
    } catch (error) {
        console.error('Erro ao salvar pontuação das Notícias Extraordinárias:', error);
    }
};

export const loadNoticiasExtraordinariasScores = (): NoticiasExtraordinariasScoreEntry[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.NOTICIAS_EXTRAORDINARIAS_SCORES);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('Erro ao carregar pontuações das Notícias Extraordinárias:', error);
        return [];
    }
};

export const removeNoticiasExtraordinariasScore = (noticiaId: string): void => {
    try {
        const existing = loadNoticiasExtraordinariasScores();
        const updated = existing.filter(entry => entry.noticiaId !== noticiaId);
        localStorage.setItem(STORAGE_KEYS.NOTICIAS_EXTRAORDINARIAS_SCORES, JSON.stringify(updated));
    } catch (error) {
        console.error('Erro ao remover pontuação das Notícias Extraordinárias:', error);
    }
};

// ============================================================================
// CARO PRA CHUCHU SCORES
// ============================================================================

export const saveCaroPraChuchuScore = (entry: CaroPraChuchuScoreEntry): void => {
    try {
        const existing = loadCaroPraChuchuScores();
        existing.push(entry);
        localStorage.setItem(STORAGE_KEYS.CARO_PRA_CHUCHU_SCORES, JSON.stringify(existing));
    } catch (error) {
        console.error('Erro ao salvar score do Caro Pra Chuchu:', error);
    }
};

export const loadCaroPraChuchuScores = (): CaroPraChuchuScoreEntry[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.CARO_PRA_CHUCHU_SCORES);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('Erro ao carregar scores do Caro Pra Chuchu:', error);
        return [];
    }
};

export const removeCaroPraChuchuScore = (itemId: string): void => {
    try {
        const existing = loadCaroPraChuchuScores();
        const filtered = existing.filter(score => score.itemId !== itemId);
        localStorage.setItem(STORAGE_KEYS.CARO_PRA_CHUCHU_SCORES, JSON.stringify(filtered));
    } catch (error) {
        console.error('Erro ao remover score do Caro Pra Chuchu:', error);
    }
};

// ============================================================================
// OVO OU A GALINHA SCORES
// ============================================================================

export const saveOvoOuGalinhaScore = (entry: OvoOuGalinhaScoreEntry): void => {
    try {
        const existing = loadOvoOuGalinhaScores();
        existing.push(entry);
        localStorage.setItem(STORAGE_KEYS.OVO_OU_GALINHA_SCORES, JSON.stringify(existing));
    } catch (error) {
        console.error('Erro ao salvar score do Ovo ou a Galinha:', error);
    }
};

export const loadOvoOuGalinhaScores = (): OvoOuGalinhaScoreEntry[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.OVO_OU_GALINHA_SCORES);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('Erro ao carregar scores do Ovo ou a Galinha:', error);
        return [];
    }
};

export const removeOvoOuGalinhaScore = (trioId: number): void => {
    try {
        const existing = loadOvoOuGalinhaScores();
        const filtered = existing.filter(score => score.trioId !== trioId);
        localStorage.setItem(STORAGE_KEYS.OVO_OU_GALINHA_SCORES, JSON.stringify(filtered));
    } catch (error) {
        console.error('Erro ao remover score do Ovo ou a Galinha:', error);
    }
};

export const clearOvoOuGalinhaScores = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.OVO_OU_GALINHA_SCORES);
    } catch {
        // Ignorar erros de localStorage
    }
};

// ============================================================================
// QUEM É ESSE POKÉMON SCORES
// ============================================================================

export const saveQuemEEssePokemonScore = (entry: QuemEEssePokemonScoreEntry): void => {
    try {
        const existing = loadQuemEEssePokemonScores();
        existing.push(entry);
        localStorage.setItem(STORAGE_KEYS.QUEM_E_ESSE_POKEMON_SCORES, JSON.stringify(existing));
    } catch (error) {
        console.error('Erro ao salvar score do Quem é esse Pokémon:', error);
    }
};

export const loadQuemEEssePokemonScores = (): QuemEEssePokemonScoreEntry[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.QUEM_E_ESSE_POKEMON_SCORES);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('Erro ao carregar scores do Quem é esse Pokémon:', error);
        return [];
    }
};

export const removeQuemEEssePokemonScore = (pokemonId: string): void => {
    try {
        const existing = loadQuemEEssePokemonScores();
        const filtered = existing.filter(score => score.pokemonId !== pokemonId);
        localStorage.setItem(STORAGE_KEYS.QUEM_E_ESSE_POKEMON_SCORES, JSON.stringify(filtered));
    } catch (error) {
        console.error('Erro ao remover score do Quem é esse Pokémon:', error);
    }
};

export const clearQuemEEssePokemonScores = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.QUEM_E_ESSE_POKEMON_SCORES);
    } catch {
        // Ignorar erros de localStorage
    }
};

// ============================================================================
// REGINALDO HORA DO LANCHE SCORES
// ============================================================================

export const saveReginaldoHoraDoLancheScore = (entry: ReginaldoHoraDoLancheScoreEntry): void => {
    try {
        const existing = loadReginaldoHoraDoLancheScores();
        existing.push(entry);
        localStorage.setItem(STORAGE_KEYS.REGINALDO_HORA_DO_LANCHE_SCORES, JSON.stringify(existing));
    } catch (error) {
        console.error('Erro ao salvar score do Reginaldo Hora do Lanche:', error);
    }
};

export const loadReginaldoHoraDoLancheScores = (): ReginaldoHoraDoLancheScoreEntry[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.REGINALDO_HORA_DO_LANCHE_SCORES);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('Erro ao carregar scores do Reginaldo Hora do Lanche:', error);
        return [];
    }
};

export const removeReginaldoHoraDoLancheScore = (comidaId: string): void => {
    try {
        const existing = loadReginaldoHoraDoLancheScores();
        const filtered = existing.filter(score => score.id !== comidaId);
        localStorage.setItem(STORAGE_KEYS.REGINALDO_HORA_DO_LANCHE_SCORES, JSON.stringify(filtered));
    } catch (error) {
        console.error('Erro ao remover score do Reginaldo Hora do Lanche:', error);
    }
};

export const clearReginaldoHoraDoLancheScores = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.REGINALDO_HORA_DO_LANCHE_SCORES);
    } catch {
        // Ignorar erros de localStorage
    }
};

// ============================================================================
// MAESTRO BILLY SCORES
// ============================================================================

export const saveMaestroBillyScore = (entry: MaestroBillyScoreEntry): void => {
    try {
        const existing = loadMaestroBillyScores();
        existing.push(entry);
        localStorage.setItem(STORAGE_KEYS.MAESTRO_BILLY_SCORES, JSON.stringify(existing));
    } catch (error) {
        console.error('Erro ao salvar score do Maestro Billy:', error);
    }
};

export const loadMaestroBillyScores = (): MaestroBillyScoreEntry[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.MAESTRO_BILLY_SCORES);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('Erro ao carregar scores do Maestro Billy:', error);
        return [];
    }
};

export const removeMaestroBillyScore = (musicaId: string): void => {
    try {
        const existing = loadMaestroBillyScores();
        const filtered = existing.filter(score => score.musicaId !== musicaId);
        localStorage.setItem(STORAGE_KEYS.MAESTRO_BILLY_SCORES, JSON.stringify(filtered));
    } catch (error) {
        console.error('Erro ao remover score do Maestro Billy:', error);
    }
};

export const clearMaestroBillyScores = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.MAESTRO_BILLY_SCORES);
    } catch {
        // Ignorar erros de localStorage
    }
};

