import type { Game } from '../types';

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
        id: 'painelistas-excentricos',
        name: 'Painelistas Excêntricos',
        icon: '🎭',
        description: 'Fatos pessoais: verdade ou mentira?',
        points: '+4 pontos',
        status: 'pending'
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