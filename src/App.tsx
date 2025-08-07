import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { VerdadesAbsurdas } from './pages/VerdadesAbsurdas';
import { SettingsModal } from './components/SettingsModal';
import { useGameState } from './hooks/useGameState';
import { clearAllLocalStorage } from './utils/fileSystem';
import './styles/Dashboard.css';
import './styles/SettingsModal.css';

function App() {

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { gameState, updateTeamConfig, saveConfig, reloadConfig, addPoints, resetScores } = useGameState();
  const [renderKey, setRenderKey] = useState(0);



  const handleOpenScoreboard = () => {
    alert('Scoreboard será implementado em breve!');
  };

  const handleOpenBuzzer = () => {
    alert('Sistema de Buzzer será implementado em breve!');
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleSaveConfig = async (customData?: any) => {
    await saveConfig(customData);
    setRenderKey(prev => prev + 1); // Força re-renderização
  };

  const handleGameClick = (gameId: string) => {
    switch (gameId) {
      case 'verdades-absurdas':
        window.location.href = '/verdades-absurdas';
        break;
      default:
        alert(`Jogo "${gameId}" será implementado em breve!`);
    }
  };

  const handleClearLocalStorage = () => {
    if (confirm('Tem certeza que deseja limpar todo o localStorage? Isso irá apagar todas as configurações e pontuações.')) {
      clearAllLocalStorage();
      window.location.reload();
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <Dashboard
              key={renderKey}
              onOpenScoreboard={handleOpenScoreboard}
              onOpenBuzzer={handleOpenBuzzer}
              onOpenSettings={handleOpenSettings}
              onGameClick={handleGameClick}
              gameState={gameState}
              addPoints={addPoints}
              resetScores={resetScores}
              onClearLocalStorage={handleClearLocalStorage}
            />
          } />
          <Route path="/verdades-absurdas" element={<VerdadesAbsurdas />} />
        </Routes>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          teamA={gameState.teams.teamA}
          teamB={gameState.teams.teamB}
          onUpdateTeamConfig={updateTeamConfig}
          onSaveConfig={handleSaveConfig}
          onReloadConfig={reloadConfig}
        />
      </div>
    </Router>
  );
}

export default App;
