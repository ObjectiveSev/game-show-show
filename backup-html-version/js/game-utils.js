// Utilitários compartilhados para todos os jogos do Game Show Show

// Carregar pontuação atual
function loadCurrentScores() {
    const scores = JSON.parse(localStorage.getItem('gameShowScores') || '{"teamA": 0, "teamB": 0}');
    const teamNames = JSON.parse(localStorage.getItem('gameShowTeamNames') || '{"teamA": "Time A", "teamB": "Time B"}');
    
    return { scores, teamNames };
}

// Atualizar display de pontuação
function updateScoreDisplay() {
    const { scores, teamNames } = loadCurrentScores();
    
    // Atualizar elementos se existirem
    const scoreA = document.getElementById('scoreA');
    const scoreB = document.getElementById('scoreB');
    const teamAName = document.getElementById('teamAName');
    const teamBName = document.getElementById('teamBName');
    
    if (scoreA) scoreA.textContent = scores.teamA;
    if (scoreB) scoreB.textContent = scores.teamB;
    if (teamAName) teamAName.textContent = teamNames.teamA;
    if (teamBName) teamBName.textContent = teamNames.teamB;
}

// Adicionar pontos
function addPoints(team, points) {
    const { scores } = loadCurrentScores();
    
    if (team === 'A') {
        scores.teamA += points;
    } else if (team === 'B') {
        scores.teamB += points;
    }
    
    localStorage.setItem('gameShowScores', JSON.stringify(scores));
    updateScoreDisplay();
    
    // Efeito visual
    const scoreElement = team === 'A' ? document.getElementById('scoreA') : document.getElementById('scoreB');
    if (scoreElement) {
        scoreElement.style.transform = 'scale(1.2)';
        scoreElement.style.color = points > 0 ? '#28a745' : '#dc3545';
        setTimeout(() => {
            scoreElement.style.transform = 'scale(1)';
            scoreElement.style.color = '';
        }, 300);
    }
    
    // Feedback sonoro
    playScoreSound(points > 0);
}

// Tocar som de pontuação
function playScoreSound(positive) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (positive) {
            // Som de sucesso (frequência ascendente)
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
        } else {
            // Som de erro (frequência descendente)
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        }
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        console.log('Áudio não suportado');
    }
}

// Criar efeito de partículas
function createParticles(element, color = '#ffd700') {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            left: ${centerX}px;
            top: ${centerY}px;
            animation: particle-fall 1.5s linear forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1500);
    }
}

// Adicionar CSS para animações de partículas
function addParticleCSS() {
    if (!document.getElementById('particle-css')) {
        const style = document.createElement('style');
        style.id = 'particle-css';
        style.textContent = `
            @keyframes particle-fall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Mostrar notificação
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após duração
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Gerar número aleatório entre min e max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Embaralhar array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Formatar tempo (segundos para MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Salvar dados do jogo
function saveGameData(gameName, data) {
    const gameData = JSON.parse(localStorage.getItem('gameShowGameData') || '{}');
    gameData[gameName] = {
        ...data,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('gameShowGameData', JSON.stringify(gameData));
}

// Carregar dados do jogo
function loadGameData(gameName) {
    const gameData = JSON.parse(localStorage.getItem('gameShowGameData') || '{}');
    return gameData[gameName] || null;
}

// Atalhos de teclado padrão
function setupDefaultShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Ctrl + 1/2 para pontuação
        if (event.ctrlKey) {
            if (event.key === '1') {
                event.preventDefault();
                addPoints('A', 1);
            } else if (event.key === '2') {
                event.preventDefault();
                addPoints('B', 1);
            } else if (event.key === 'z') {
                event.preventDefault();
                addPoints('A', -1);
            } else if (event.key === 'x') {
                event.preventDefault();
                addPoints('B', -1);
            }
        }
        
        // Escape para fechar
        if (event.key === 'Escape') {
            window.close();
        }
    });
}

// Inicializar utilitários
function initGameUtils() {
    addParticleCSS();
    setupDefaultShortcuts();
    updateScoreDisplay();
    
    console.log('🎮 Utilitários do jogo carregados!');
}

// Exportar funções para uso global
window.GameShowUtils = {
    loadCurrentScores,
    updateScoreDisplay,
    addPoints,
    playScoreSound,
    createParticles,
    showNotification,
    randomInt,
    shuffleArray,
    formatTime,
    saveGameData,
    loadGameData,
    initGameUtils
};

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    initGameUtils();
}); 