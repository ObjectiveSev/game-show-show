// Configuração central do Game Show Show
// Modifique este arquivo para personalizar o sistema

const GameShowConfig = {
    // Configuração dos Times
    teams: {
        teamA: {
            name: "Time A",
            captain: "Baby",
            members: ["Baby", "João", "Álan", "Matheus"],
            color: "#ff6b6b",
            gradient: "linear-gradient(145deg, #ff6b6b, #ee5a52)"
        },
        teamB: {
            name: "Time B", 
            captain: "Victor",
            members: ["Victor", "Átila", "Bruno", "Sand"],
            color: "#4ecdc4",
            gradient: "linear-gradient(145deg, #4ecdc4, #44a08d)"
        }
    },

    // Configuração dos Jogos
    games: {
        "verdades-absurdas": {
            name: "Verdades Absurdas",
            icon: "🤔",
            description: "Encontre as 5 verdades escondidas no texto",
            points: "+1/-1 pontos",
            status: "completed",
            file: "games/verdades-absurdas.html"
        },
        "dicionario-surreal": {
            name: "Dicionário Surreal",
            icon: "📚",
            description: "Escolha a definição correta para palavras raras",
            points: "+3 pontos",
            status: "pending",
            file: "games/dicionario-surreal.html"
        },
        "painelistas-excentricos": {
            name: "Painelistas Excêntricos",
            icon: "🎭",
            description: "Fatos pessoais: verdade ou mentira?",
            points: "+4 pontos",
            status: "pending",
            file: "games/painelistas-excentricos.html"
        },
        "noticias-extraordinarias": {
            name: "Notícias Extraordinárias",
            icon: "📰",
            description: "Manchetes reais vs falsas",
            points: "+4 pontos",
            status: "pending",
            file: "games/noticias-extraordinarias.html"
        },
        "caro-pra-chuchu": {
            name: "Caro Pra Chuchu",
            icon: "💰",
            description: "Adivinhe preços históricos",
            points: "+1/+3/+5 pontos",
            status: "pending",
            file: "games/caro-pra-chuchu.html"
        },
        "ovo-ou-galinha": {
            name: "O Ovo ou a Galinha",
            icon: "🥚",
            description: "Ordenação cronológica",
            points: "+2 pontos",
            status: "pending",
            file: "games/ovo-ou-galinha.html"
        },
        "maestro-billy": {
            name: "Maestro Billy",
            icon: "🎵",
            description: "Jogo musical com buzzer",
            points: "+1 a +3 pontos",
            status: "in-development",
            file: "games/maestro-billy.html"
        },
        "pokemon-impossivel": {
            name: "Quem É Esse Pokémon",
            icon: "⚡",
            description: "Versão impossível",
            points: "+2 pontos",
            status: "pending",
            file: "games/pokemon-impossivel.html"
        },
        "campainha-musical": {
            name: "Toca a Campainha Musical",
            icon: "🔔",
            description: "Música com buzzer",
            points: "+2 pontos",
            status: "pending",
            file: "games/campainha-musical.html"
        },
        "qual-comida": {
            name: "Qual É a Comida?",
            icon: "🍕",
            description: "Adivinhe pratos por descrição",
            points: "+3 pontos",
            status: "pending",
            file: "games/qual-comida.html"
        },
        "timeline-maluco": {
            name: "Timeline Maluco",
            icon: "📅",
            description: "Eventos históricos em ordem",
            points: "+2 pontos",
            status: "pending",
            file: "games/timeline-maluco.html"
        }
    },

    // Configuração de Atalhos de Teclado
    shortcuts: {
        "teamA_plus": { key: "1", description: "+1 ponto Time A" },
        "teamB_plus": { key: "2", description: "+1 ponto Time B" },
        "teamA_minus": { key: "z", description: "-1 ponto Time A" },
        "teamB_minus": { key: "x", description: "-1 ponto Time B" },
        "buzzer": { key: "b", description: "Abrir Buzzer" },
        "scoreboard": { key: "s", description: "Abrir Scoreboard" },
        "reset": { key: "r", description: "Resetar Pontuação" }
    },

    // Configuração de Áudio
    audio: {
        enabled: true,
        volume: 0.3,
        sounds: {
            buzzer: { frequency: 800, duration: 0.1 },
            success: { frequency: [400, 800], duration: 0.1 },
            error: { frequency: [600, 200], duration: 0.1 }
        }
    },

    // Configuração de Visual
    visual: {
        theme: "default",
        animations: true,
        particles: true,
        colors: {
            primary: "#667eea",
            secondary: "#764ba2",
            success: "#28a745",
            error: "#dc3545",
            warning: "#ffc107",
            info: "#17a2b8"
        }
    },

    // Configuração de Dados
    data: {
        autoSave: true,
        saveInterval: 5000, // 5 segundos
        maxHistory: 100
    },

    // Configuração de Buzzer
    buzzer: {
        keys: {
            teamA: "q",
            teamB: "p"
        },
        timers: [5, 10, 30],
        autoReset: true,
        resetDelay: 3000
    },

    // Configuração de Pontuação
    scoring: {
        defaultPoints: 1,
        allowNegative: true,
        maxPoints: 10,
        showAnimations: true
    }
};

// Função para obter configuração
function getConfig(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], GameShowConfig);
}

// Função para atualizar configuração
function updateConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const obj = keys.reduce((obj, key) => obj[key], GameShowConfig);
    obj[lastKey] = value;
}

// Função para salvar configuração
function saveConfig() {
    localStorage.setItem('gameShowConfig', JSON.stringify(GameShowConfig));
}

// Função para carregar configuração
function loadConfig() {
    const saved = localStorage.getItem('gameShowConfig');
    if (saved) {
        Object.assign(GameShowConfig, JSON.parse(saved));
    }
}

// Exportar para uso global
window.GameShowConfig = GameShowConfig;
window.getConfig = getConfig;
window.updateConfig = updateConfig;
window.saveConfig = saveConfig;
window.loadConfig = loadConfig;

// Carregar configuração ao inicializar
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
    console.log('⚙️ Configuração do Game Show carregada!');
}); 