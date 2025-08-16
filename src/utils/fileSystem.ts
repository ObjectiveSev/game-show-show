// Utilitários para ler/escrever o arquivo teams.json físico
import type { Team } from '../types';
import { STORAGE_KEYS, TEAM_COLORS } from '../constants';

interface TeamsConfig {
    teams: {
        teamA: Team;
        teamB: Team;
    };
}

const DEFAULT_TEAMS_CONFIG: TeamsConfig = {
    "teams": {
        "teamA": {
            "id": "A",
            "name": "",
            "captain": "",
            "members": [],
            "color": TEAM_COLORS.TEAM_A.color,
            "gradient": TEAM_COLORS.TEAM_A.gradient,
            "score": 0
        },
        "teamB": {
            "id": "B",
            "name": "",
            "captain": "",
            "members": [],
            "color": TEAM_COLORS.TEAM_B.color,
            "gradient": TEAM_COLORS.TEAM_B.gradient,
            "score": 0
        }
    }
};

// Função para ler do localStorage
export const readTeamsFile = async (): Promise<TeamsConfig> => {
    try {
        // Ler do localStorage
        const savedFile = localStorage.getItem(STORAGE_KEYS.TEAMS_CONFIG);

        if (savedFile) {
            const data = JSON.parse(savedFile);
            return data;
        }

        // Se não existe no localStorage, retorna a configuração padrão
        return DEFAULT_TEAMS_CONFIG;
    } catch (error) {
        console.error('❌ Erro ao ler localStorage:', error);
        return DEFAULT_TEAMS_CONFIG;
    }
};

// Função para salvar no localStorage
export const writeTeamsFile = async (data: TeamsConfig): Promise<void> => {
    try {
        const jsonString = JSON.stringify(data, null, 4);

        // Salvar no localStorage
        localStorage.setItem(STORAGE_KEYS.TEAMS_CONFIG, jsonString);

    } catch (error) {
        console.error('❌ Erro ao salvar no localStorage:', error);
        throw error;
    }
};

// Função para resetar para o padrão
export const resetTeamsFile = async (): Promise<void> => {
    await writeTeamsFile(DEFAULT_TEAMS_CONFIG);
};

// Função para limpar todo o localStorage
export const clearAllLocalStorage = (): void => {
    try {
        localStorage.clear();
        console.log('🗑️ Todo o localStorage foi limpo!');
    } catch (error) {
        console.error('❌ Erro ao limpar localStorage:', error);
    }
};

