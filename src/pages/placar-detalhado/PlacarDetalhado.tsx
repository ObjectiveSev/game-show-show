import React, { useEffect, useState } from 'react';
import type { AppState } from '../../types';
import type { GamesConfig } from '../../types/games';
import { carregarConfiguracaoJogos } from '../../utils/gamesLoader';
import { getTeamNameFromString } from '../../utils/teamUtils';
import { BackButton } from '../../components/back-button/BackButton';
import { GAME_IDS } from '../../constants';
import { VerdadesAbsurdasScoreSection } from './sections/VerdadesAbsurdasScoreSection';
import { PainelistasExcentricosScoreSection } from './sections/PainelistasExcentricosScoreSection';
import { DicionarioSurrealScoreSection } from './sections/DicionarioSurrealScoreSection';
import { NoticiasExtraordinariasScoreSection } from './sections/NoticiasExtraordinariasScoreSection';
import { CaroPraChuchuScoreSection } from './sections/CaroPraChuchuScoreSection';
import { OvoOuGalinhaScoreSection } from './sections/OvoOuGalinhaScoreSection';
import { QuemEEssePokemonScoreSection } from './sections/QuemEEssePokemonScoreSection';
import { ReginaldoHoraDoLancheScoreSection } from './sections/ReginaldoHoraDoLancheScoreSection';
import { MaestroBillyScoreSection } from './sections/MaestroBillyScoreSection';
import { HostExtraPointsScoreSection } from './sections/HostExtraPointsScoreSection';
import './PlacarDetalhado.css';

interface Props {
    gameState: AppState;
}

export const PlacarDetalhado: React.FC<Props> = ({ gameState }) => {
    const [gamesConfig, setGamesConfig] = useState<GamesConfig | null>(null);

    useEffect(() => {
        let isMounted = true;

        // Carregar apenas a configuração dos jogos para definir a ordem
        const loadGamesConfig = async () => {
            try {
                const games = await carregarConfiguracaoJogos();
                if (!isMounted) return;
                setGamesConfig(games);
            } catch (error) {
                if (isMounted) {
                    console.warn('Erro ao carregar configuração dos jogos:', error);
                }
            }
        };

        loadGamesConfig();

        return () => {
            isMounted = false;
        };
    }, []);

    const getGameEmoji = (gameId: string) => {
        if (!gamesConfig) return '🎮';
        const game = gamesConfig.games.find((g: { id: string; emoji: string }) => g.id === gameId);
        return game?.emoji || '🎮';
    };

    const renderGameSection = (gameId: string) => {
        switch (gameId) {
            case 'verdades-absurdas':
                return (
                    <VerdadesAbsurdasScoreSection
                        key={gameId}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'painelistas-excentricos':
                return (
                    <PainelistasExcentricosScoreSection
                        key={gameId}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'dicionario-surreal':
                return (
                    <DicionarioSurrealScoreSection
                        key={gameId}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'noticias-extraordinarias':
                return (
                    <NoticiasExtraordinariasScoreSection
                        key={gameId}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'caro-pra-chuchu':
                return (
                    <CaroPraChuchuScoreSection
                        key={gameId}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'ovo-ou-galinha':
                return (
                    <OvoOuGalinhaScoreSection
                        key={gameId}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'quem-e-esse-pokemon':
                return (
                    <QuemEEssePokemonScoreSection
                        key={gameId}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case 'reginaldo-hora-do-lanche':
                return (
                    <ReginaldoHoraDoLancheScoreSection
                        key={gameId}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            case GAME_IDS.MAESTRO_BILLY:
                return (
                    <MaestroBillyScoreSection
                        key={gameId}
                        gameState={gameState}
                        getGameEmoji={getGameEmoji}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="placar-detalhado">
            <BackButton />
            <div className="pd-header">
                <h1>🏆 Placar Detalhado</h1>
                <p>Histórico completo de todas as pontuações</p>
            </div>

            <div className="historico-principal-section">
                <h2>🏆 Placar Geral</h2>
                <div className="totais-container">
                    <div className="total-card">
                        <span className="label">{getTeamNameFromString('A', gameState.teams)}</span>
                        <span className="placar-valor">{gameState.teams.teamA.score} pontos</span>
                    </div>
                    <div className="total-card">
                        <span className="label">{getTeamNameFromString('B', gameState.teams)}</span>
                        <span className="placar-valor">{gameState.teams.teamB.score} pontos</span>
                    </div>
                </div>

                <h2>📰 Histórico Detalhado</h2>
                <p className="historico-descricao">Registro completo de todas as pontuações por jogo</p>

                {/* Pontuação Extra do Host - Agora como seção independente */}
                <HostExtraPointsScoreSection gameState={gameState} />

                {/* Seções dos jogos renderizadas dinamicamente baseadas no games.json */}
                {gamesConfig?.games.map((game) => renderGameSection(game.id))}
            </div>
        </div>
    );
};