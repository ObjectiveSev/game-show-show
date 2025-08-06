// Variáveis do buzzer
let buzzerActive = true;
let winner = null;
let timerInterval = null;
let timeLeft = 0;

// Elementos DOM
const statusText = document.getElementById('statusText');
const winnerDisplay = document.getElementById('winnerDisplay');
const timerDisplay = document.getElementById('timer');
const buzzerA = document.getElementById('buzzerA');
const buzzerB = document.getElementById('buzzerB');

// Contexto de áudio
let audioContext;
let buzzerSound;

// Inicializar áudio
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        createBuzzerSound();
    } catch (error) {
        console.log('Áudio não suportado neste navegador');
    }
}

// Criar som do buzzer
function createBuzzerSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Função principal do buzzer
function buzz(team) {
    if (!buzzerActive) return;
    
    buzzerActive = false;
    winner = team;
    
    // Tocar som
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    createBuzzerSound();
    
    // Efeitos visuais
    const buzzerButton = team === 'A' ? buzzerA : buzzerB;
    buzzerButton.classList.add('winner');
    buzzerButton.classList.add('buzzing');
    
    // Atualizar display
    statusText.textContent = 'Buzzer acionado!';
    winnerDisplay.textContent = `🏆 Time ${team} venceu!`;
    
    // Criar partículas
    createParticles(buzzerButton);
    
    // Desabilitar botões
    buzzerA.disabled = true;
    buzzerB.disabled = true;
    
    // Parar timer se estiver rodando
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Auto-reset após 3 segundos
    setTimeout(() => {
        resetBuzzer();
    }, 3000);
}

// Resetar buzzer
function resetBuzzer() {
    buzzerActive = true;
    winner = null;
    
    // Limpar classes
    buzzerA.classList.remove('winner', 'buzzing');
    buzzerB.classList.remove('winner', 'buzzing');
    
    // Reabilitar botões
    buzzerA.disabled = false;
    buzzerB.disabled = false;
    
    // Limpar display
    statusText.textContent = 'Aguardando buzzer...';
    winnerDisplay.textContent = '';
    timerDisplay.textContent = '';
    
    // Parar timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Iniciar timer
function startTimer(seconds) {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timeLeft = seconds;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            statusText.textContent = '⏰ Tempo esgotado!';
            buzzerActive = false;
            
            // Desabilitar botões
            buzzerA.disabled = true;
            buzzerB.disabled = true;
            
            // Auto-reset após 2 segundos
            setTimeout(() => {
                resetBuzzer();
            }, 2000);
        }
    }, 1000);
}

// Atualizar display do timer
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Mudar cor baseado no tempo restante
    if (timeLeft <= 5) {
        timerDisplay.style.color = '#ff4757';
        timerDisplay.style.animation = 'pulse 0.5s infinite';
    } else if (timeLeft <= 10) {
        timerDisplay.style.color = '#ffa502';
    } else {
        timerDisplay.style.color = '#ffd700';
        timerDisplay.style.animation = 'none';
    }
}

// Criar partículas
function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.animationDelay = Math.random() * 0.5 + 's';
        
        document.body.appendChild(particle);
        
        // Remover partícula após animação
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 2000);
    }
}

// Atalhos de teclado
document.addEventListener('keydown', function(event) {
    // Q para Time A
    if (event.key.toLowerCase() === 'q' && buzzerActive) {
        event.preventDefault();
        buzz('A');
    }
    
    // P para Time B
    if (event.key.toLowerCase() === 'p' && buzzerActive) {
        event.preventDefault();
        buzz('B');
    }
    
    // R para resetar
    if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        resetBuzzer();
    }
    
    // Espaço para timer de 10s
    if (event.key === ' ') {
        event.preventDefault();
        startTimer(10);
    }
    
    // Escape para fechar
    if (event.key === 'Escape') {
        window.close();
    }
});

// Efeitos de hover nos botões
buzzerA.addEventListener('mouseenter', function() {
    if (buzzerActive) {
        this.style.transform = 'scale(1.05)';
    }
});

buzzerA.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

buzzerB.addEventListener('mouseenter', function() {
    if (buzzerActive) {
        this.style.transform = 'scale(1.05)';
    }
});

buzzerB.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// Função para vibrar (se suportado)
function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
}

// Adicionar vibração ao buzzer
function buzzWithVibration(team) {
    vibrate();
    buzz(team);
}

// Função para modo de teste
function testMode() {
    const testMode = !document.body.classList.contains('test-mode');
    document.body.classList.toggle('test-mode', testMode);
    
    if (testMode) {
        statusText.textContent = '🧪 Modo de teste ativado';
        buzzerA.style.opacity = '0.7';
        buzzerB.style.opacity = '0.7';
    } else {
        statusText.textContent = 'Aguardando buzzer...';
        buzzerA.style.opacity = '1';
        buzzerB.style.opacity = '1';
    }
}

// Função para estatísticas
let stats = {
    teamA: 0,
    teamB: 0,
    totalRounds: 0
};

function updateStats(team) {
    if (team === 'A') {
        stats.teamA++;
    } else {
        stats.teamB++;
    }
    stats.totalRounds++;
    
    // Salvar no localStorage
    localStorage.setItem('buzzerStats', JSON.stringify(stats));
}

function showStats() {
    const teamAPercentage = stats.totalRounds > 0 ? Math.round((stats.teamA / stats.totalRounds) * 100) : 0;
    const teamBPercentage = stats.totalRounds > 0 ? Math.round((stats.teamB / stats.totalRounds) * 100) : 0;
    
    const statsText = `
📊 Estatísticas do Buzzer:

🏆 Total de rodadas: ${stats.totalRounds}
📈 Time A: ${stats.teamA} vitórias (${teamAPercentage}%)
📉 Time B: ${stats.teamB} vitórias (${teamBPercentage}%)

${stats.teamA > stats.teamB ? '🥇 Time A está na frente!' : 
  stats.teamB > stats.teamA ? '🥇 Time B está na frente!' : 
  '🤝 Empate!'}
    `;
    
    alert(statsText);
}

// Carregar estatísticas salvas
function loadStats() {
    const savedStats = localStorage.getItem('buzzerStats');
    if (savedStats) {
        stats = JSON.parse(savedStats);
    }
}

// Função para exportar estatísticas
function exportStats() {
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `buzzer-stats-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initAudio();
    loadStats();
    
    // Adicionar atalhos extras
    document.addEventListener('keydown', function(event) {
        // Ctrl + T para modo de teste
        if (event.ctrlKey && event.key === 't') {
            event.preventDefault();
            testMode();
        }
        
        // Ctrl + S para estatísticas
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            showStats();
        }
        
        // Ctrl + E para exportar estatísticas
        if (event.ctrlKey && event.key === 'e') {
            event.preventDefault();
            exportStats();
        }
    });
    
    console.log('🔔 Sistema de Buzzer carregado!');
    console.log('⌨️ Atalhos: Q/P (buzzer), R (reset), Espaço (timer 10s), Ctrl+T (teste)');
});

// Função para modo de apresentação (tela cheia)
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Adicionar botão de tela cheia
document.addEventListener('keydown', function(event) {
    if (event.key === 'F11') {
        event.preventDefault();
        toggleFullscreen();
    }
}); 