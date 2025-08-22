import type { Team } from '../types';

/**
 * Obtém o nome do time baseado no ID
 * @param teamId - ID do time ('A' ou 'B')
 * @param teams - Objeto contendo teamA e teamB
 * @returns Nome customizado do time ou "Time A"/"Time B" se não houver nome customizado
 */
export const getTeamName = (teamId: 'A' | 'B', teams: { teamA: Team; teamB: Team }): string => {
    const team = teamId === 'A' ? teams.teamA : teams.teamB;

    // Se o time tem um nome customizado, retorna ele
    if (team.name && team.name.trim() !== '') {
        return team.name;
    }

    // Caso contrário, retorna "Time A" ou "Time B"
    return `Time ${teamId}`;
};

/**
 * Obtém o nome do time a partir de uma string que pode ser 'A' ou 'B'
 * @param teamId - ID do time como string
 * @param teams - Objeto contendo teamA e teamB
 * @returns Nome customizado do time ou "Time A"/"Time B" se não houver nome customizado
 */
export const getTeamNameFromString = (teamId: string, teams: { teamA: Team; teamB: Team }): string => {
    if (teamId === 'A' || teamId === 'B') {
        return getTeamName(teamId, teams);
    }

    // Fallback para casos onde o ID não é válido
    return 'Time Desconhecido';
}; 