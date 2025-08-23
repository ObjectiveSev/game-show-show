import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useGameState } from '../../hooks/useGameState';
import { Dashboard } from '../dashboard/Dashboard';
import { VerdadesAbsurdas } from '../games/verdades-absurdas/VerdadesAbsurdas';
import { DicionarioSurreal } from '../games/dicionario-surreal/DicionarioSurreal';
import { PainelistasExcentricos } from '../games/painelistas-excentricos/PainelistasExcentricos';
import { NoticiasExtraordinarias } from '../games/noticias-extraordinarias/NoticiasExtraordinarias';
import { CaroPraChuchu } from '../games/caro-pra-chuchu/CaroPraChuchu';
import { OvoOuGalinha } from '../games/ovo-ou-galinha/OvoOuGalinha';
import { PlacarDetalhado } from '../placar-detalhado/PlacarDetalhado';
import { TeamSettingsModal } from '../team-settings/TeamSettingsModal';
import { clearAllLocalStorage } from '../../utils/fileSystem';
import type { Team } from '../../types';


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
      case 'caro-pra-chuchu':
        window.location.href = '/caro-pra-chuchu';
        break;
      case 'ovo-ou-galinha':
        window.location.href = '/ovo-ou-galinha';
        break;
      default:
        alert(`Jogo "${gameId}" será implementado em breve!`);
    }
  };

  const handleClearLocalStorage = () => {
    // Usar uma abordagem mais segura para evitar problemas com message channel
    const shouldClear = window.confirm('Tem certeza que deseja limpar todo o localStorage? Isso irá apagar todas as configurações e pontuações.');
    if (shouldClear) {
      clearAllLocalStorage();
      window.location.reload();
    }
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
    <Router
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true
      }}
    >
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
            <PainelistasExcentricos
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
          <Route path="/caro-pra-chuchu" element={
            <CaroPraChuchu
              gameState={gameState}
              addGamePoints={addGamePoints}
              addPoints={addPoints}
            />
          } />
          <Route path="/ovo-ou-galinha" element={
            <OvoOuGalinha />
          } />
          <Route path="/placar-detalhado" element={
            <PlacarDetalhado gameState={gameState} />
          } />
        </Routes>

        <TeamSettingsModal
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
