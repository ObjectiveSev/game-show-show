import React, { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import './styles/Dashboard.css';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'scoreboard' | 'buzzer' | 'settings'>('dashboard');

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
    setCurrentView('settings');
    alert('Configurações serão implementadas em breve!');
    setCurrentView('dashboard');
  };

  const handleGameClick = (gameId: string) => {
    alert(`Jogo "${gameId}" será implementado em breve!`);
  };

  return (
    <div className="App">
      <Dashboard
        onOpenScoreboard={handleOpenScoreboard}
        onOpenBuzzer={handleOpenBuzzer}
        onOpenSettings={handleOpenSettings}
        onGameClick={handleGameClick}
      />
    </div>
  );
}

export default App;
