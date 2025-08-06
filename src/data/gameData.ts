import { Team, Game } from '../types';

// Dados dos times
export const initialTeams: { teamA: Team; teamB: Team } = {
    teamA: {
        id: 'A',
        name: 'Time A',
        captain: 'Baby',
        members: ['Baby', 'João', 'Álan', 'Matheus'],
        color: '#ff6b6b',
        gradient: 'linear-gradient(145deg, #ff6b6b, #ee5a52)',
        score: 0
    },
    teamB: {
        id: 'B',
        name: 'Time B',
        captain: 'Victor',
        members: ['Victor', 'Átila', 'Bruno', 'Sand'],
        color: '#4ecdc4',
        gradient: 'linear-gradient(145deg, #4ecdc4, #44a08d)',
        score: 0
    }
};

// Lista de jogos
export const games: Game[] = [
    {
        id: 'verdades-absurdas',
        name: 'Verdades Absurdas',
        icon: '🤔',
        description: 'Encontre as 5 verdades escondidas no texto',
        points: '+1/-1 pontos',
        status: 'completed'
    },
    {
        id: 'dicionario-surreal',
        name: 'Dicionário Surreal',
        icon: '📚',
        description: 'Escolha a definição correta para palavras raras',
        points: '+3 pontos',
        status: 'pending'
    },
    {
        id: 'painelistas-excentricos',
        name: 'Painelistas Excêntricos',
        icon: '🎭',
        description: 'Fatos pessoais: verdade ou mentira?',
        points: '+4 pontos',
        status: 'pending'
    },
    {
        id: 'noticias-extraordinarias',
        name: 'Notícias Extraordinárias',
        icon: '📰',
        description: 'Manchetes reais vs falsas',
        points: '+4 pontos',
        status: 'pending'
    },
    {
        id: 'caro-pra-chuchu',
        name: 'Caro Pra Chuchu',
        icon: '💰',
        description: 'Adivinhe preços históricos',
        points: '+1/+3/+5 pontos',
        status: 'pending'
    },
    {
        id: 'ovo-ou-galinha',
        name: 'O Ovo ou a Galinha',
        icon: '🥚',
        description: 'Ordenação cronológica',
        points: '+2 pontos',
        status: 'pending'
    },
    {
        id: 'maestro-billy',
        name: 'Maestro Billy',
        icon: '🎵',
        description: 'Jogo musical com buzzer',
        points: '+1 a +3 pontos',
        status: 'in-development'
    },
    {
        id: 'pokemon-impossivel',
        name: 'Quem É Esse Pokémon',
        icon: '⚡',
        description: 'Versão impossível',
        points: '+2 pontos',
        status: 'pending'
    },
    {
        id: 'qual-comida',
        name: 'Reginaldo Hora do Lanche',
        icon: '🍕',
        description: 'Adivinhe pratos por descrição',
        points: '+3 pontos',
        status: 'pending'
    }
]; 