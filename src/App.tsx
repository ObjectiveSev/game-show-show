import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { VerdadesAbsurdas } from './pages/VerdadesAbsurdas';
import { PlacarDetalhado } from './pages/PlacarDetalhado';
import { DicionarioSurreal } from './pages/DicionarioSurreal';
import { SettingsModal } from './components/SettingsModal';
import { Painelistas } from './pages/Painelistas';
import { useGameState } from './hooks/useGameState';
import { clearAllLocalStorage } from './utils/fileSystem';
import './styles/Dashboard.css';
import './styles/SettingsModal.css';

function App() {

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { gameState, updateTeamConfig, addPoints, addGamePoints, resetScores } = useGameState();
  const [renderKey] = useState(0);

  const handleOpenScoreboard = () => {
    window.location.href = '/placar-detalhado';
  };

  const handleOpenBuzzer = () => {
    alert('Sistema de Buzzer será implementado em breve!');
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleGameClick = (gameId: string) => {
    switch (gameId) {
      case 'verdades-absurdas':
        window.location.href = '/verdades-absurdas';
        break;
      case 'dicionario-surreal':
        window.location.href = '/dicionario-surreal';
        break;
      case 'painelistas-excentricos':
        window.location.href = '/painelistas-excentricos';
        break;
      default:
        alert(`Jogo "${gameId}" será implementado em breve!`);
    }
  };

  const handleClearLocalStorage = () => {
    // Usar setTimeout para evitar problemas com message channel
    setTimeout(() => {
      if (confirm('Tem certeza que deseja limpar todo o localStorage? Isso irá apagar todas as configurações e pontuações.')) {
        clearAllLocalStorage();
        window.location.reload();
      }
    }, 0);
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
          <Route path="/verdades-absurdas" element={<VerdadesAbsurdas key={renderKey} gameState={gameState} addGamePoints={addGamePoints} addPoints={addPoints} />} />
          <Route path="/dicionario-surreal" element={<DicionarioSurreal key={renderKey} gameState={gameState} addGamePoints={addGamePoints} addPoints={addPoints} />} />
          <Route path="/placar-detalhado" element={<PlacarDetalhado key={renderKey} />} />
          <Route path="/painelistas-excentricos" element={<Painelistas key={renderKey} gameState={gameState} addGamePoints={addGamePoints} addPoints={addPoints} />} />
        </Routes>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          teams={[gameState.teams.teamA, gameState.teams.teamB]}
          onUpdateTeams={async (teams) => {
            await updateTeamConfig('A', teams[0]);
            await updateTeamConfig('B', teams[1]);
          }}
        />
      </div>
    </Router>
  );
}

export default App;
