// Utilitário para sincronização de scores entre diferentes jogos e o estado principal

import type { GameScores } from '../types';
import { STORAGE_KEYS } from '../constants';
import {
    loadVerdadesAbsurdasScores,
    loadDicionarioSurrealScores,
    loadPainelistasScores,
    loadPainelistasPunicoes,
    loadNoticiasExtraordinariasScores,
    loadCaroPraChuchuScores,
    loadOvoOuGalinhaScores,
    loadQuemEEssePokemonScores,
    loadReginaldoHoraDoLancheScores
} from './scoreStorage';

/**
 * Sincroniza os scores dos jogos individuais com o estado principal
 */
export const syncGameScores = (): GameScores => {
    try {
        // Carregar pontuações de todos os jogos
        const verdadesAbsurdasScores = loadVerdadesAbsurdasScores();
        const dicionarioScores = loadDicionarioSurrealScores();
        const painelistasScores = loadPainelistasScores();
        const noticiasExtraordinariasScores = loadNoticiasExtraordinariasScores();
        const caroPraChuchuScores = loadCaroPraChuchuScores();
        const ovoOuGalinhaScores = loadOvoOuGalinhaScores();
        const quemEEssePokemonScores = loadQuemEEssePokemonScores();

        // Carregar punições do Painelistas
        const painelistasPunicoes = loadPainelistasPunicoes();

        // Calcular pontos por time para cada jogo
        const verdadesAbsurdas = verdadesAbsurdasScores.reduce((acc: { [key: string]: number }, entry) => {
            if (entry.timeLeitor === 'A') acc.A = (acc.A || 0) + (entry.pontosLeitor || 0);
            if (entry.timeLeitor === 'B') acc.B = (acc.B || 0) + (entry.pontosLeitor || 0);
            if (entry.timeAdivinhador === 'A') acc.A = (acc.A || 0) + (entry.pontosAdivinhador || 0);
            if (entry.timeAdivinhador === 'B') acc.B = (acc.B || 0) + (entry.pontosAdivinhador || 0);
            return acc;
        }, {} as { A: number; B: number });

        const dicionario = dicionarioScores.reduce((acc: { [key: string]: number }, entry) => {
            if (entry.timeAdivinhador === 'A') acc.A = (acc.A || 0) + (entry.pontos || 0);
            if (entry.timeAdivinhador === 'B') acc.B = (acc.B || 0) + (entry.pontos || 0);
            return acc;
        }, {} as { A: number; B: number });

        const painelistas = painelistasScores.reduce((acc: { [key: string]: number }, entry) => {
            if (entry.timeAdivinhador === 'A') acc.A = (acc.A || 0) + (entry.pontos || 0);
            if (entry.timeAdivinhador === 'B') acc.B = (acc.B || 0) + (entry.pontos || 0);
            return acc;
        }, {} as { A: number; B: number });

        const noticiasExtraordinarias = noticiasExtraordinariasScores.reduce((acc: { [key: string]: number }, entry) => {
            if (entry.timeAdivinhador === 'A') acc.A = (acc.A || 0) + entry.pontos;
            if (entry.timeAdivinhador === 'B') acc.B = (acc.B || 0) + entry.pontos;
            return acc;
        }, {} as { A: number; B: number });

        const caroPraChuchu = caroPraChuchuScores.reduce((acc: { [key: string]: number }, entry) => {
            if (entry.timeAdivinhador === 'A') acc.A = (acc.A || 0) + entry.pontos;
            if (entry.timeAdivinhador === 'B') acc.B = (acc.B || 0) + entry.pontos;
            return acc;
        }, {} as { A: number; B: number });

        const ovoOuGalinha = ovoOuGalinhaScores.reduce((acc: { [key: string]: number }, entry) => {
            if (entry.timeAdivinhador === 'A') acc.A = (acc.A || 0) + entry.pontos;
            if (entry.timeAdivinhador === 'B') acc.B = (acc.B || 0) + entry.pontos;
            return acc;
        }, {} as { A: number; B: number });

        const quemEEssePokemon = quemEEssePokemonScores.reduce((acc: { [key: string]: number }, entry) => {
            if (entry.timeAdivinhador === 'A') acc.A = (acc.A || 0) + entry.pontos;
            if (entry.timeAdivinhador === 'B') acc.B = (acc.B || 0) + entry.pontos;
            return acc;
        }, {} as { A: number; B: number });

        const reginaldoHoraDoLanche = loadReginaldoHoraDoLancheScores().reduce((acc: { [key: string]: number }, entry) => {
            if (entry.timeAdivinhador === 'A') acc.A = (acc.A || 0) + entry.pontos;
            if (entry.timeAdivinhador === 'B') acc.B = (acc.B || 0) + entry.pontos;
            return acc;
        }, {} as { A: number; B: number });

        // Calcular pontos das punições
        const punicoes = painelistasPunicoes.reduce((acc: { [key: string]: number }, entry) => {
            if (entry.time === 'A') acc.A = (acc.A || 0) + entry.pontos;
            if (entry.time === 'B') acc.B = (acc.B || 0) + entry.pontos;
            return acc;
        }, {} as { A: number; B: number });

        // Combinar pontuações do Painelistas (scores + punições)
        const painelistasCompleto = {
            teamA: (painelistas.A || 0) + (punicoes.A || 0),
            teamB: (painelistas.B || 0) + (punicoes.B || 0)
        };

        // Consolidar todas as pontuações
        const consolidatedScores: GameScores = {
            'verdades-absurdas': {
                teamA: verdadesAbsurdas.A || 0,
                teamB: verdadesAbsurdas.B || 0
            },
            'dicionario-surreal': {
                teamA: dicionario.A || 0,
                teamB: dicionario.B || 0
            },
            'painelistas-excentricos': painelistasCompleto,
            'noticias-extraordinarias': {
                teamA: noticiasExtraordinarias.A || 0,
                teamB: noticiasExtraordinarias.B || 0
            },
            'caro-pra-chuchu': {
                teamA: caroPraChuchu.A || 0,
                teamB: caroPraChuchu.B || 0
            },
            'ovo-ou-galinha': {
                teamA: ovoOuGalinha.A || 0,
                teamB: ovoOuGalinha.B || 0
            },
            'quem-e-esse-pokemon': {
                teamA: quemEEssePokemon.A || 0,
                teamB: quemEEssePokemon.B || 0
            },
            'reginaldo-hora-do-lanche': {
                teamA: reginaldoHoraDoLanche.A || 0,
                teamB: reginaldoHoraDoLanche.B || 0
            }
        };

        // Salvar no localStorage consolidado
        localStorage.setItem(STORAGE_KEYS.GAME_SCORES, JSON.stringify(consolidatedScores));

        return consolidatedScores;
    } catch (error) {
        console.error('Erro ao sincronizar pontuações dos jogos:', error);
        return {
            'verdades-absurdas': { teamA: 0, teamB: 0 },
            'dicionario-surreal': { teamA: 0, teamB: 0 },
            'painelistas-excentricos': { teamA: 0, teamB: 0 },
            'noticias-extraordinarias': { teamA: 0, teamB: 0 },
            'caro-pra-chuchu': { teamA: 0, teamB: 0 },
            'ovo-ou-galinha': { teamA: 0, teamB: 0 },
            'quem-e-esse-pokemon': { teamA: 0, teamB: 0 },
            'reginaldo-hora-do-lanche': { teamA: 0, teamB: 0 }
        };
    }
};

/**
 * Limpa todos os scores consolidados
 */
export const clearConsolidatedScores = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.GAME_SCORES);
        console.log('Scores consolidados limpos!');
    } catch (error) {
        console.error('Erro ao limpar scores consolidados:', error);
    }
}; 