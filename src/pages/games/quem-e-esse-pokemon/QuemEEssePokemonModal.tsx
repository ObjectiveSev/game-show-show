import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../../components/base-modal/BaseModal';
import { TeamSelector } from '../../../components/team-selector/TeamSelector';
import { Button } from '../../../components/button/Button';
import { ButtonType } from '../../../types';
import type { Team } from '../../../types';
import { soundManager } from '../../../utils/soundManager';
import { saveQuemEEssePokemonScore } from '../../../utils/scoreStorage';
import './QuemEEssePokemonModal.css';

interface Pokemon {
    id: string;
    nome: string;
}

interface QuemEEssePokemonConfig {
    pontuacao: {
        acerto: number;
        erro: number;
    };
    pokemons: Pokemon[];
}

interface QuemEEssePokemonModalProps {
    isOpen: boolean;
    onClose: () => void;
    pokemon: Pokemon;
    config: QuemEEssePokemonConfig;
    gameState: {
        teams: {
            teamA: Team;
            teamB: Team;
        };
    };
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
    onSavePokemon: (pokemonId: string, teamId: 'A' | 'B', resultado: 'acerto' | 'erro', pontos: number) => void;
    isAlreadyPlayed?: boolean;
}

export const QuemEEssePokemonModal: React.FC<QuemEEssePokemonModalProps> = ({
    isOpen,
    onClose,
    pokemon,
    config,
    gameState,
    addGamePoints,
    addPoints,
    onSavePokemon,
    isAlreadyPlayed = false
}) => {
    const [selectedTeam, setSelectedTeam] = useState<'A' | 'B' | ''>('');
    const [isRevealed, setIsRevealed] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [currentResult, setCurrentResult] = useState<'acerto' | 'erro' | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Só tocar música se não foi jogado antes
            if (!isAlreadyPlayed) {
                soundManager.playGameSound('quem-e-esse-pokemon');
            }

            // Se já foi jogado, abrir revelado
            if (isAlreadyPlayed) {
                setIsRevealed(true);
                setIsAnswered(false);
                setCurrentResult(null);
                setSelectedTeam('');
            } else {
                // Resetar estado para novo jogo
                setIsRevealed(false);
                setIsAnswered(false);
                setCurrentResult(null);
                setSelectedTeam('');
            }
        }
    }, [isOpen, pokemon.id, isAlreadyPlayed]);

    const handleTeamSelect = (teamId: 'A' | 'B' | '') => {
        setSelectedTeam(teamId);
    };

    const handleAcerto = () => {
        if (!selectedTeam || isAnswered) return;

        setIsAnswered(true);
        setIsRevealed(true);
        setCurrentResult('acerto');

        // Tocar som de acerto
        soundManager.playSuccessSound();
    };

    const handleErro = () => {
        if (!selectedTeam || isAnswered) return;

        setIsAnswered(true);
        setIsRevealed(true);
        setCurrentResult('erro');

        // Tocar som de erro
        soundManager.playErrorSound();
    };

    const handleReset = () => {
        // Resetar para estado inicial
        setIsRevealed(false);
        setIsAnswered(false);
        setCurrentResult(null);
        setSelectedTeam('');
    };

    const handleSalvar = () => {
        if (!selectedTeam || !currentResult) return;

        const pontos = currentResult === 'acerto' ? config.pontuacao.acerto : config.pontuacao.erro;

        // Atualizar pontuação do jogo específico
        addGamePoints('quem-e-esse-pokemon', selectedTeam, pontos);

        // Atualizar pontuação geral do time
        addPoints(selectedTeam, pontos);

        // Salvar pontuação detalhada no localStorage
        const scoreEntry = {
            pokemonId: pokemon.id,
            timeAdivinhador: selectedTeam,
            resultado: currentResult,
            pontos: pontos,
            timestamp: Date.now()
        };
        saveQuemEEssePokemonScore(scoreEntry);

        // Notificar o componente pai para atualizar o estado
        onSavePokemon(pokemon.id, selectedTeam, currentResult, pontos);

        // Fechar modal
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    const getImageSrc = () => {
        if (isRevealed) {
            return `/pokemon/${pokemon.id}-reveal.png`;
        }
        return `/pokemon/${pokemon.id}-shadow.png`;
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={isAlreadyPlayed ? pokemon.nome : `Quem É Esse Pokémon?`}
        >
            <div className="modal-content">
                <div className="pokemon-image-container">
                    <img
                        src={getImageSrc()}
                        alt={isRevealed ? `Pokémon ${pokemon.id} revelado` : `Pokémon ${pokemon.id} sombra`}
                        className="pokemon-image"
                    />
                </div>

                <div className="game-controls">
                    {!isAlreadyPlayed && (
                        <div className="team-selection">
                            <h3>Selecione o Time:</h3>
                            <TeamSelector
                                teams={gameState.teams}
                                value={selectedTeam}
                                onChange={handleTeamSelect}
                                disabled={isAnswered}
                            />
                        </div>
                    )}

                    {selectedTeam && !isAnswered && !isAlreadyPlayed && (
                        <div className="answer-buttons">
                            <Button
                                type={ButtonType.SUCCESS}
                                onClick={handleAcerto}
                                disabled={!selectedTeam}
                            />
                            <Button
                                type={ButtonType.ERROR}
                                onClick={handleErro}
                                disabled={!selectedTeam}
                            />
                        </div>
                    )}

                    {isAnswered && currentResult && (
                        <div className="result-actions">
                            <div className="pokemon-info">
                                <h3>
                                    {currentResult === 'acerto' ?
                                        `${pokemon.nome}` :
                                        `Pokémon #${pokemon.id}`
                                    }
                                </h3>
                                <p className={
                                    currentResult === 'acerto' ? 'positive-points' : 'negative-points'
                                }>
                                    {currentResult === 'acerto' ?
                                        `✅ Acerto! +${config.pontuacao.acerto} pontos` :
                                        `❌ Erro! ${config.pontuacao.erro} pontos`
                                    }
                                </p>
                            </div>

                            <div className="action-buttons">
                                <Button
                                    type={ButtonType.RESET}
                                    onClick={handleReset}
                                />
                                <Button
                                    type={ButtonType.SAVE}
                                    onClick={handleSalvar}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BaseModal>
    );
};
