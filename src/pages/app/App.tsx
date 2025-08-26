import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useGameState } from '../../hooks/useGameState';
import { Dashboard } from '../dashboard/Dashboard';
import { VerdadesAbsurdas } from '../games/verdades-absurdas/VerdadesAbsurdas';
import { DicionarioSurreal } from '../games/dicionario-surreal/DicionarioSurreal';
import { PainelistasExcentricos } from '../games/painelistas-excentricos/PainelistasExcentricos';
import { NoticiasExtraordinarias } from '../games/noticias-extraordinarias/NoticiasExtraordinarias';
import { CaroPraChuchu } from '../games/caro-pra-chuchu/CaroPraChuchu';
import { OvoOuGalinha } from '../games/ovo-ou-galinha/OvoOuGalinha';
import { QuemEEssePokemon } from '../games/quem-e-esse-pokemon/QuemEEssePokemon';
import { ReginaldoHoraDoLanche } from '../games/reginaldo-hora-do-lanche/ReginaldoHoraDoLanche';
import { MaestroBilly } from '../games/maestro-billy/MaestroBilly';
import { PlacarDetalhado } from '../placar-detalhado/PlacarDetalhado';
import { TeamSettingsModal } from '../team-settings/TeamSettingsModal';
import { clearAllLocalStorage } from '../../utils/fileSystem';
import type { Team } from '../../types';


function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { gameState, updateTeamConfig, addGamePoints, removeGamePoints, addPoints, addExtraPoints, resetScores, syncPoints } = useGameState();
  const navigate = useNavigate();

  const handleOpenScoreboard = () => {
    navigate('/placar-detalhado');
  };



  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleGameClick = (gameId: string) => {
    switch (gameId) {
      case 'verdades-absurdas':
        navigate('/verdades-absurdas');
        break;
      case 'dicionario-surreal':
        navigate('/dicionario-surreal');
        break;
      case 'painelistas-excentricos':
        navigate('/painelistas-excentricos');
        break;
      case 'noticias-extraordinarias':
        navigate('/noticias-extraordinarias');
        break;
      case 'caro-pra-chuchu':
        navigate('/caro-pra-chuchu');
        break;
      case 'ovo-ou-galinha':
        navigate('/ovo-ou-galinha');
        break;
      case 'quem-e-esse-pokemon':
        navigate('/quem-e-esse-pokemon');
        break;
      case 'reginaldo-hora-do-lanche':
        navigate('/reginaldo-hora-do-lanche');
        break;
      case 'maestro-billy':
        navigate('/maestro-billy');
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
    <div className="App">
      <Routes>
        <Route path="/" element={
          <Dashboard
            onOpenScoreboard={handleOpenScoreboard}
            onOpenSettings={handleOpenSettings}
            onGameClick={handleGameClick}
            gameState={gameState}
            addPoints={addPoints}
            resetScores={resetScores}
            onClearLocalStorage={handleClearLocalStorage}
            addExtraPoints={addExtraPoints}
          />
        } />
        <Route path="/verdades-absurdas" element={
          <VerdadesAbsurdas
            gameState={{ ...gameState, syncPoints }}
            addGamePoints={addGamePoints}
            removeGamePoints={removeGamePoints}
            addPoints={addPoints}
          />
        } />
        <Route path="/dicionario-surreal" element={
          <DicionarioSurreal
            gameState={{ ...gameState, syncPoints }}
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
          <OvoOuGalinha
            gameState={{ ...gameState, syncPoints }}
            addGamePoints={addGamePoints}
            addPoints={addPoints}
          />
        } />
        <Route path="/quem-e-esse-pokemon" element={
          <QuemEEssePokemon
            gameState={{ ...gameState, syncPoints }}
            addGamePoints={addGamePoints}
            addPoints={addPoints}
          />
        } />
        <Route path="/reginaldo-hora-do-lanche" element={
          <ReginaldoHoraDoLanche
            gameState={{ ...gameState, syncPoints }}
            addGamePoints={addGamePoints}
            addPoints={addPoints}
          />
        } />
        <Route path="/maestro-billy" element={
          <MaestroBilly
            gameState={{ ...gameState, syncPoints }}
            addGamePoints={addGamePoints}
            addPoints={addPoints}
          />
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
  );
}

function App() {
  return (
    <Router
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true
      }}
    >
      <AppContent />
    </Router>
  );
}

export default App;
