

interface GameInfo {
    id: string;
    name: string;
    emoji: string;
    description: string;
    configFile: string;
}

export const carregarGameInfo = async (gameId: string): Promise<GameInfo | null> => {
    try {
        const response = await fetch('/config/games.json');
        const data = await response.json();

        const game = data.games.find((g: GameInfo) => g.id === gameId);
        return game || null;
    } catch (error) {
        console.error('Erro ao carregar informações do jogo:', error);
        return null;
    }
};
