import React, { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { SettingsModal } from './components/SettingsModal';
import { useGameState } from './hooks/useGameState';
import './styles/Dashboard.css';
import './styles/SettingsModal.css';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'scoreboard' | 'buzzer' | 'settings'>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { gameState, updateTeamConfig, saveConfig, reloadConfig, addPoints, resetScores } = useGameState();
  const [renderKey, setRenderKey] = useState(0);

  const handleOpenScoreboard = () => {
    setCurrentView('scoreboard');
    alert('Scoreboard será implementado em breve!');
    setCurrentView('dashboard');
  };

  const handleOpenBuzzer = () => {
    setCurrentView('buzzer');
    alert('Sistema de Buzzer será implementado em breve!');
    setCurrentView('dashboard');
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleSaveConfig = () => {
    saveConfig();
    setRenderKey(prev => prev + 1); // Força re-renderização
  };

  const handleGameClick = (gameId: string) => {
    alert(`Jogo "${gameId}" será implementado em breve!`);
  };

  return (
    <div className="App">
      <Dashboard
        key={renderKey}
        onOpenScoreboard={handleOpenScoreboard}
        onOpenBuzzer={handleOpenBuzzer}
        onOpenSettings={handleOpenSettings}
        onGameClick={handleGameClick}
        gameState={gameState}
        addPoints={addPoints}
        resetScores={resetScores}
      />

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
  );
}

export default App;
