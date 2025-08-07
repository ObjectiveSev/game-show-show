// Utilitários para ler/escrever o arquivo teams.json físico

const DEFAULT_TEAMS_CONFIG = {
    "teams": {
        "teamA": {
            "id": "A",
            "name": "",
            "captain": "",
            "members": []
        },
        "teamB": {
            "id": "B",
            "name": "",
            "captain": "",
            "members": []
        }
    }
};

// Função para ler do localStorage
export const readTeamsFile = async (): Promise<any> => {
    try {
        // Ler do localStorage
        const savedFile = localStorage.getItem('teamsJsonFile');

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
export const writeTeamsFile = async (data: any): Promise<void> => {
    try {
        const jsonString = JSON.stringify(data, null, 4);

        // Salvar no localStorage
        localStorage.setItem('teamsJsonFile', jsonString);

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

