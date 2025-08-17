import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useGameState } from './hooks/useGameState';
import type { Team } from './types';
import { Dashboard } from './pages/Dashboard';
import { VerdadesAbsurdas } from './pages/VerdadesAbsurdas';
import { DicionarioSurreal } from './pages/DicionarioSurreal';
import { Painelistas } from './pages/Painelistas';
import { NoticiasExtraordinarias } from './pages/NoticiasExtraordinarias';
import { PlacarDetalhado } from './pages/PlacarDetalhado';
import { SettingsModal } from './components/SettingsModal';
import { clearAllLocalStorage } from './utils/fileSystem';
import './styles/Dashboard.css';
import './styles/SettingsModal.css';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { gameState, updateTeamConfig, addGamePoints, addPoints, resetScores, syncPoints } = useGameState();

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
      case 'noticias-extraordinarias':
        window.location.href = '/noticias-extraordinarias';
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

  const handleUpdateTeams = async (teams: Team[]) => {
    try {
      await updateTeamConfig('A', teams[0]);
      await updateTeamConfig('B', teams[1]);
    } catch (error) {
      console.error('Erro ao atualizar configuração dos times:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <Dashboard
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
          <Route path="/verdades-absurdas" element={
            <VerdadesAbsurdas
              gameState={{ ...gameState, syncPoints }}
              addGamePoints={addGamePoints}
              addPoints={addPoints}
            />
          } />
          <Route path="/dicionario-surreal" element={
            <DicionarioSurreal
              gameState={gameState}
              addGamePoints={addGamePoints}
              addPoints={addPoints}
            />
          } />
          <Route path="/painelistas-excentricos" element={
            <Painelistas
              gameState={{ ...gameState, syncPoints }}
              addGamePoints={addGamePoints}
              addPoints={addPoints}
            />
          } />
          <Route path="/noticias-extraordinarias" element={
            <NoticiasExtraordinarias
              gameState={gameState}
              addGamePoints={addGamePoints}
              addPoints={addPoints}
            />
          } />
          <Route path="/placar-detalhado" element={
            <PlacarDetalhado gameState={gameState} />
          } />
        </Routes>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          teams={[gameState.teams.teamA, gameState.teams.teamB]}
          onUpdateTeams={handleUpdateTeams}
        />
      </div>
    </Router>
  );
}

export default App;
