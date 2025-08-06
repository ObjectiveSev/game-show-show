// Sistema de pontuação detalhado
let gameScores = {
    verdades: { teamA: 0, teamB: 0 },
    dicionario: { teamA: 0, teamB: 0 },
    painelistas: { teamA: 0, teamB: 0 },
    noticias: { teamA: 0, teamB: 0 },
    caro: { teamA: 0, teamB: 0 },
    ovo: { teamA: 0, teamB: 0 },
    maestro: { teamA: 0, teamB: 0 }
};

let teamNames = {
    teamA: 'Time A',
    teamB: 'Time B',
    captainA: 'Baby',
    captainB: 'Victor'
};

// Carregar dados salvos
function loadScoreboardData() {
    const savedScores = localStorage.getItem('gameShowDetailedScores');
    const savedNames = localStorage.getItem('gameShowTeamNames');
    
    if (savedScores) {
        gameScores = JSON.parse(savedScores);
    }
    
    if (savedNames) {
        teamNames = JSON.parse(savedNames);
        updateTeamNameInputs();
    }
    
    updateScoreboard();
}

// Salvar dados
function saveScoreboardData() {
    localStorage.setItem('gameShowDetailedScores', JSON.stringify(gameScores));
    localStorage.setItem('gameShowTeamNames', JSON.stringify(teamNames));
}

// Atualizar inputs de nomes dos times
function updateTeamNameInputs() {
    document.getElementById('teamAName').value = teamNames.teamA;
    document.getElementById('teamBName').value = teamNames.teamB;
    document.getElementById('teamACaptain').value = teamNames.captainA;
    document.getElementById('teamBCaptain').value = teamNames.captainB;
}

// Atualizar nomes dos times
function updateTeamNames() {
    teamNames.teamA = document.getElementById('teamAName').value;
    teamNames.teamB = document.getElementById('teamBName').value;
    teamNames.captainA = document.getElementById('teamACaptain').value;
    teamNames.captainB = document.getElementById('teamBCaptain').value;
    
    document.getElementById('teamAHeader').textContent = teamNames.teamA;
    document.getElementById('teamBHeader').textContent = teamNames.teamB;
    
    saveScoreboardData();
}

// Adicionar pontos gerais
function addPoints(team, points) {
    // Adicionar aos pontos gerais (compatibilidade com hub)
    const currentScores = JSON.parse(localStorage.getItem('gameShowScores') || '{"teamA": 0, "teamB": 0}');
    
    if (team === 'A') {
        currentScores.teamA += points;
    } else {
        currentScores.teamB += points;
    }
    
    localStorage.setItem('gameShowScores', JSON.stringify(currentScores));
    
    // Efeito visual
    const totalElement = team === 'A' ? document.getElementById('totalA') : document.getElementById('totalB');
    totalElement.style.transform = 'scale(1.2)';
    totalElement.style.color = points > 0 ? '#28a745' : '#dc3545';
    setTimeout(() => {
        totalElement.style.transform = 'scale(1)';
        totalElement.style.color = '';
    }, 300);
    
    updateScoreboard();
}

// Atualizar pontuação de jogo específico
function updateGameScore(game, points) {
    const pointsNum = parseInt(points) || 0;
    
    // Distribuir pontos entre os times (assumindo que pontos positivos vão para o time A)
    if (pointsNum > 0) {
        gameScores[game].teamA += pointsNum;
    } else if (pointsNum < 0) {
        gameScores[game].teamB += Math.abs(pointsNum);
    }
    
    saveScoreboardData();
    updateScoreboard();
    
    // Limpar input
    document.getElementById(game + 'Score').value = '';
}

// Atualizar tabela de pontuação
function updateScoreboard() {
    // Atualizar pontuações individuais
    Object.keys(gameScores).forEach(game => {
        document.getElementById(game + 'A').textContent = gameScores[game].teamA;
        document.getElementById(game + 'B').textContent = gameScores[game].teamB;
        
        const diff = gameScores[game].teamA - gameScores[game].teamB;
        const diffElement = document.getElementById(game + 'Diff');
        diffElement.textContent = diff;
        
        // Colorir diferença
        if (diff > 0) {
            diffElement.style.color = '#28a745';
            diffElement.textContent = '+' + diff;
        } else if (diff < 0) {
            diffElement.style.color = '#dc3545';
        } else {
            diffElement.style.color = '#666';
        }
    });
    
    // Calcular totais
    const totalA = Object.values(gameScores).reduce((sum, game) => sum + game.teamA, 0);
    const totalB = Object.values(gameScores).reduce((sum, game) => sum + game.teamB, 0);
    const totalDiff = totalA - totalB;
    
    document.getElementById('totalA').textContent = totalA;
    document.getElementById('totalB').textContent = totalB;
    
    const totalDiffElement = document.getElementById('totalDiff');
    totalDiffElement.textContent = totalDiff;
    
    // Colorir diferença total
    if (totalDiff > 0) {
        totalDiffElement.style.color = '#28a745';
        totalDiffElement.textContent = '+' + totalDiff;
    } else if (totalDiff < 0) {
        totalDiffElement.style.color = '#dc3545';
    } else {
        totalDiffElement.style.color = '#666';
    }
    
    // Destacar linha do vencedor
    const totalRow = document.querySelector('.total-row');
    totalRow.classList.remove('winner');
    
    if (totalA > totalB) {
        document.getElementById('totalA').parentElement.classList.add('winner');
    } else if (totalB > totalA) {
        document.getElementById('totalB').parentElement.classList.add('winner');
    }
    
    // Atualizar estatísticas
    updateStats(totalA, totalB, totalDiff);
    
    // Sincronizar com pontuação geral
    const generalScores = { teamA: totalA, teamB: totalB };
    localStorage.setItem('gameShowScores', JSON.stringify(generalScores));
}

// Atualizar estatísticas
function updateStats(teamA, teamB, difference) {
    document.getElementById('statTeamA').textContent = teamA;
    document.getElementById('statTeamB').textContent = teamB;
    document.getElementById('statDifference').textContent = difference;
    
    const leaderElement = document.getElementById('statLeader');
    if (teamA > teamB) {
        leaderElement.textContent = teamNames.teamA;
        leaderElement.style.color = '#ff6b6b';
    } else if (teamB > teamA) {
        leaderElement.textContent = teamNames.teamB;
        leaderElement.style.color = '#4ecdc4';
    } else {
        leaderElement.textContent = 'Empate';
        leaderElement.style.color = '#ffd700';
    }
}

// Resetar todas as pontuações
function resetAllScores() {
    if (confirm('Tem certeza que deseja resetar TODAS as pontuações?\n\nEsta ação não pode ser desfeita.')) {
        // Resetar pontuações detalhadas
        Object.keys(gameScores).forEach(game => {
            gameScores[game].teamA = 0;
            gameScores[game].teamB = 0;
        });
        
        // Resetar pontuação geral
        localStorage.setItem('gameShowScores', JSON.stringify({ teamA: 0, teamB: 0 }));
        
        // Limpar inputs de pontuação rápida
        const quickScoreInputs = document.querySelectorAll('.quick-score-item input');
        quickScoreInputs.forEach(input => input.value = '');
        
        saveScoreboardData();
        updateScoreboard();
        
        // Feedback visual
        const scoreElements = document.querySelectorAll('.team-a-score, .team-b-score');
        scoreElements.forEach(el => {
            el.style.transform = 'scale(0.8)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        });
    }
}

// Exportar tabela de pontuação
function exportScoreboard() {
    const exportData = {
        timestamp: new Date().toISOString(),
        teamNames: teamNames,
        gameScores: gameScores,
        totals: {
            teamA: Object.values(gameScores).reduce((sum, game) => sum + game.teamA, 0),
            teamB: Object.values(gameScores).reduce((sum, game) => sum + game.teamB, 0)
        }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `game-show-scoreboard-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    alert('📊 Tabela de pontuação exportada com sucesso!');
}

// Importar tabela de pontuação
function importScoreboard() {
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
                    
                    if (data.gameScores) {
                        gameScores = data.gameScores;
                    }
                    
                    if (data.teamNames) {
                        teamNames = data.teamNames;
                        updateTeamNameInputs();
                    }
                    
                    saveScoreboardData();
                    updateScoreboard();
                    
                    alert('📊 Tabela de pontuação importada com sucesso!');
                } catch (error) {
                    alert('❌ Erro ao importar dados. Verifique se o arquivo é válido.');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// Função para adicionar pontos específicos por jogo
function addGamePoints(game, team, points) {
    if (team === 'A') {
        gameScores[game].teamA += points;
    } else {
        gameScores[game].teamB += points;
    }
    
    saveScoreboardData();
    updateScoreboard();
    
    // Efeito visual
    const element = document.getElementById(game + (team === 'A' ? 'A' : 'B'));
    element.style.transform = 'scale(1.2)';
    element.style.color = points > 0 ? '#28a745' : '#dc3545';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.color = '';
    }, 300);
}

// Função para mostrar estatísticas detalhadas
function showDetailedStats() {
    const totalA = Object.values(gameScores).reduce((sum, game) => sum + game.teamA, 0);
    const totalB = Object.values(gameScores).reduce((sum, game) => sum + game.teamB, 0);
    const totalPoints = totalA + totalB;
    
    const teamAPercentage = totalPoints > 0 ? Math.round((totalA / totalPoints) * 100) : 0;
    const teamBPercentage = totalPoints > 0 ? Math.round((totalB / totalPoints) * 100) : 0;
    
    let statsText = `📊 Estatísticas Detalhadas:\n\n`;
    statsText += `🏆 Pontuação Total: ${totalPoints} pontos\n`;
    statsText += `📈 ${teamNames.teamA}: ${totalA} pontos (${teamAPercentage}%)\n`;
    statsText += `📉 ${teamNames.teamB}: ${totalB} pontos (${teamBPercentage}%)\n\n`;
    
    // Estatísticas por jogo
    statsText += `🎮 Pontuação por Jogo:\n`;
    Object.keys(gameScores).forEach(game => {
        const gameNames = {
            verdades: 'Verdades Absurdas',
            dicionario: 'Dicionário Surreal',
            painelistas: 'Painelistas Excêntricos',
            noticias: 'Notícias Extraordinárias',
            caro: 'Caro Pra Chuchu',
            ovo: 'O Ovo ou a Galinha',
            maestro: 'Maestro Billy'
        };
        
        const gameTotal = gameScores[game].teamA + gameScores[game].teamB;
        if (gameTotal > 0) {
            statsText += `• ${gameNames[game]}: ${gameTotal} pontos\n`;
        }
    });
    
    statsText += `\n${totalA > totalB ? '🥇 ' + teamNames.teamA + ' está liderando!' : 
                  totalB > totalA ? '🥇 ' + teamNames.teamB + ' está liderando!' : 
                  '🤝 Empate técnico!'}`;
    
    alert(statsText);
}

// Atalhos de teclado
document.addEventListener('keydown', function(event) {
    // Ctrl + R para resetar
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        resetAllScores();
    }
    
    // Ctrl + E para exportar
    if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        exportScoreboard();
    }
    
    // Ctrl + I para importar
    if (event.ctrlKey && event.key === 'i') {
        event.preventDefault();
        importScoreboard();
    }
    
    // Ctrl + S para estatísticas
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        showDetailedStats();
    }
});

// Função para gerar relatório em PDF (simulado)
function generatePDFReport() {
    const totalA = Object.values(gameScores).reduce((sum, game) => sum + game.teamA, 0);
    const totalB = Object.values(gameScores).reduce((sum, game) => sum + game.teamB, 0);
    
    const reportText = `
RELATÓRIO DO GAME SHOW SHOW
Data: ${new Date().toLocaleDateString('pt-BR')}

TIMES:
${teamNames.teamA} (Capitão: ${teamNames.captainA})
${teamNames.teamB} (Capitão: ${teamNames.captainB})

PONTUAÇÃO FINAL:
${teamNames.teamA}: ${totalA} pontos
${teamNames.teamB}: ${totalB} pontos

RESULTADO: ${totalA > totalB ? teamNames.teamA + ' VENCEU!' : 
            totalB > totalA ? teamNames.teamB + ' VENCEU!' : 'EMPATE!'}
    `;
    
    // Simular download de PDF
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `game-show-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('📄 Relatório gerado com sucesso!');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadScoreboardData();
    
    // Adicionar botão de relatório se não existir
    const controls = document.querySelector('.controls');
    if (controls && !document.querySelector('.report-button')) {
        const reportButton = document.createElement('button');
        reportButton.className = 'control-button report-button';
        reportButton.innerHTML = '<span>📄</span><span>Relatório</span>';
        reportButton.onclick = generatePDFReport;
        controls.appendChild(reportButton);
    }
    
    console.log('📊 Sistema de Pontuação carregado!');
    console.log('⌨️ Atalhos: Ctrl+R (reset), Ctrl+E (exportar), Ctrl+I (importar), Ctrl+S (estatísticas)');
}); 