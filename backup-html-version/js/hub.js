// Sistema de pontuação
let scores = {
    teamA: 0,
    teamB: 0
};

// Carregar pontuação salva
function loadScores() {
    const savedScores = localStorage.getItem('gameShowScores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
        updateScoreDisplay();
    }
}

// Salvar pontuação
function saveScores() {
    localStorage.setItem('gameShowScores', JSON.stringify(scores));
}

// Atualizar display de pontuação
function updateScoreDisplay() {
    document.getElementById('scoreA').textContent = scores.teamA;
    document.getElementById('scoreB').textContent = scores.teamB;
}

// Adicionar pontos
function addPoints(team, points) {
    if (team === 'A') {
        scores.teamA += points;
    } else if (team === 'B') {
        scores.teamB += points;
    }
    updateScoreDisplay();
    saveScores();
    
    // Efeito visual
    const scoreElement = team === 'A' ? document.getElementById('scoreA') : document.getElementById('scoreB');
    scoreElement.style.transform = 'scale(1.2)';
    scoreElement.style.color = points > 0 ? '#28a745' : '#dc3545';
    setTimeout(() => {
        scoreElement.style.transform = 'scale(1)';
        scoreElement.style.color = '';
    }, 300);
}

// Resetar pontuação
function resetScores() {
    if (confirm('Tem certeza que deseja resetar a pontuação?')) {
        scores.teamA = 0;
        scores.teamB = 0;
        updateScoreDisplay();
        saveScores();
        
        // Feedback visual
        const scoreElements = document.querySelectorAll('.score');
        scoreElements.forEach(el => {
            el.style.transform = 'scale(0.8)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        });
    }
}

// Navegação para jogos
function openGame(gameName) {
    const gameUrls = {
        'verdades-absurdas': 'games/verdades-absurdas.html',
        'dicionario-surreal': 'games/dicionario-surreal.html',
        'painelistas-excentricos': 'games/painelistas-excentricos.html',
        'noticias-extraordinarias': 'games/noticias-extraordinarias.html',
        'caro-pra-chuchu': 'games/caro-pra-chuchu.html',
        'ovo-ou-galinha': 'games/ovo-ou-galinha.html',
        'maestro-billy': 'games/maestro-billy.html',
        'pokemon-impossivel': 'games/pokemon-impossivel.html',
        'campainha-musical': 'games/campainha-musical.html',
        'qual-comida': 'games/qual-comida.html',
        'timeline-maluco': 'games/timeline-maluco.html'
    };
    
    const url = gameUrls[gameName];
    if (url) {
        // Verificar se o arquivo existe
        fetch(url, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    window.open(url, '_blank');
                } else {
                    showGameNotReady(gameName);
                }
            })
            .catch(() => {
                showGameNotReady(gameName);
            });
    }
}

// Mostrar mensagem de jogo não pronto
function showGameNotReady(gameName) {
    const gameNames = {
        'verdades-absurdas': 'Verdades Absurdas',
        'dicionario-surreal': 'Dicionário Surreal',
        'painelistas-excentricos': 'Painelistas Excêntricos',
        'noticias-extraordinarias': 'Notícias Extraordinárias',
        'caro-pra-chuchu': 'Caro Pra Chuchu',
        'ovo-ou-galinha': 'O Ovo ou a Galinha',
        'maestro-billy': 'Maestro Billy',
        'pokemon-impossivel': 'Quem É Esse Pokémon',
        'campainha-musical': 'Toca a Campainha Musical',
        'qual-comida': 'Qual É a Comida?',
        'timeline-maluco': 'Timeline Maluco'
    };
    
    alert(`🎮 ${gameNames[gameName] || gameName}\n\nEste jogo ainda está em desenvolvimento!\n\nEm breve estará disponível para jogar.`);
}

// Abrir scoreboard
function openScoreboard() {
    window.open('scoreboard.html', '_blank');
}

// Abrir buzzer
function openBuzzer() {
    window.open('buzzer.html', '_blank');
}

// Atalhos de teclado
document.addEventListener('keydown', function(event) {
    // Ctrl + 1: +1 ponto Time A
    if (event.ctrlKey && event.key === '1') {
        event.preventDefault();
        addPoints('A', 1);
    }
    
    // Ctrl + 2: +1 ponto Time B
    if (event.ctrlKey && event.key === '2') {
        event.preventDefault();
        addPoints('B', 1);
    }
    
    // Ctrl + Z: -1 ponto Time A
    if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        addPoints('A', -1);
    }
    
    // Ctrl + X: -1 ponto Time B
    if (event.ctrlKey && event.key === 'x') {
        event.preventDefault();
        addPoints('B', -1);
    }
    
    // Ctrl + B: Abrir buzzer
    if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        openBuzzer();
    }
    
    // Ctrl + S: Abrir scoreboard
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        openScoreboard();
    }
    
    // Ctrl + R: Resetar pontuação
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        resetScores();
    }
});

// Função para compartilhar pontuação
function shareScore() {
    const text = `🎯 Game Show Show - Placar Atual:\n\nTime A: ${scores.teamA} pontos\nTime B: ${scores.teamB} pontos\n\n${scores.teamA > scores.teamB ? '🏆 Time A está na frente!' : scores.teamB > scores.teamA ? '🏆 Time B está na frente!' : '🤝 Empate!'}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Game Show Show - Placar',
            text: text
        });
    } else {
        // Fallback para copiar para clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('Placar copiado para a área de transferência!');
        });
    }
}

// Função para exportar dados do jogo
function exportGameData() {
    const gameData = {
        scores: scores,
        timestamp: new Date().toISOString(),
        games: [
            'Verdades Absurdas',
            'Dicionário Surreal',
            'Painelistas Excêntricos',
            'Notícias Extraordinárias',
            'Caro Pra Chuchu',
            'O Ovo ou a Galinha',
            'Maestro Billy'
        ]
    };
    
    const dataStr = JSON.stringify(gameData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `game-show-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Função para importar dados do jogo
function importGameData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.scores) {
                        scores = data.scores;
                        updateScoreDisplay();
                        saveScores();
                        alert('Dados importados com sucesso!');
                    }
                } catch (error) {
                    alert('Erro ao importar dados. Verifique se o arquivo é válido.');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadScores();
    
    // Adicionar efeitos de hover nos cards
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Adicionar efeitos nos botões de ferramentas
    const toolButtons = document.querySelectorAll('.tool-button');
    toolButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    console.log('🎯 Game Show Show - Hub carregado com sucesso!');
    console.log('⌨️ Atalhos disponíveis: Ctrl+1/2 (pontos), Ctrl+Z/X (menos pontos), Ctrl+B (buzzer), Ctrl+S (scoreboard)');
});

// Função para mostrar estatísticas
function showStats() {
    const totalPoints = scores.teamA + scores.teamB;
    const teamAPercentage = totalPoints > 0 ? Math.round((scores.teamA / totalPoints) * 100) : 0;
    const teamBPercentage = totalPoints > 0 ? Math.round((scores.teamB / totalPoints) * 100) : 0;
    
    const stats = `
📊 Estatísticas do Game Show:

🏆 Pontuação Total: ${totalPoints} pontos
📈 Time A: ${scores.teamA} pontos (${teamAPercentage}%)
📉 Time B: ${scores.teamB} pontos (${teamBPercentage}%)

${scores.teamA > scores.teamB ? '🥇 Time A está liderando!' : 
  scores.teamB > scores.teamA ? '🥇 Time B está liderando!' : 
  '🤝 Empate técnico!'}
    `;
    
    alert(stats);
}

// Função para modo escuro (experimental)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

// Carregar preferência de tema
function loadThemePreference() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Inicializar tema
loadThemePreference(); 