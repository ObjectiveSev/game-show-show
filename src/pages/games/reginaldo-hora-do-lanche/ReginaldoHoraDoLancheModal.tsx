import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../../components/base-modal/BaseModal';
import { TeamSelector } from '../../../components/team-selector/TeamSelector';
import { Button } from '../../../components/button/Button';
import { soundManager } from '../../../utils/soundManager';
import { saveReginaldoHoraDoLancheScore } from '../../../utils/scoreStorage';
import type { Team } from '../../../types';
import type { Comida, ReginaldoHoraDoLancheConfig } from '../../../types/reginaldoHoraDoLanche';
import { ButtonType } from '../../../types';
import './ReginaldoHoraDoLancheModal.css';

interface ReginaldoHoraDoLancheModalProps {
    isOpen: boolean;
    onClose: () => void;
    comida: Comida;
    config: ReginaldoHoraDoLancheConfig;
    gameState: {
        teams: {
            teamA: Team;
            teamB: Team;
        };
        syncPoints: () => void;
    };
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
    onSaveComida: (comidaId: string, teamId: 'A' | 'B', resultado: 'acerto' | 'erro', pontos: number) => void;
    isAlreadyPlayed: boolean;
}

export const ReginaldoHoraDoLancheModal: React.FC<ReginaldoHoraDoLancheModalProps> = ({
    isOpen,
    onClose,
    comida,
    config,
    gameState,
    addGamePoints,
    addPoints,
    onSaveComida,
    isAlreadyPlayed
}) => {
    const [selectedTeam, setSelectedTeam] = useState<'A' | 'B' | ''>('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [currentResult, setCurrentResult] = useState<'acerto' | 'erro' | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Só tocar música se não foi jogado antes
            if (!isAlreadyPlayed) {
                soundManager.playGameSound('reginaldo-hora-do-lanche');
            }

            // Se já foi jogado, abrir revelado
            if (isAlreadyPlayed) {
                setIsRevealed(true);
                setIsAnswered(true);
            }
        }
    }, [isOpen, isAlreadyPlayed]);

    const handleClose = () => {
        // Resetar estado ao fechar
        setSelectedTeam('');
        setIsAnswered(false);
        setIsRevealed(false);
        setCurrentResult(null);
        onClose();
    };

    const handleAcerto = () => {
        setIsAnswered(true);
        setIsRevealed(true);
        setCurrentResult('acerto');
        soundManager.playSuccessSound();
    };

    const handleErro = () => {
        setIsAnswered(true);
        setIsRevealed(true);
        setCurrentResult('erro');
        soundManager.playErrorSound();
    };

    const handleReset = () => {
        setIsAnswered(false);
        setIsRevealed(false);
        setCurrentResult(null);
        setSelectedTeam('');
    };

    const handleSalvar = () => {
        if (currentResult && selectedTeam) {
            const pontos = currentResult === 'acerto' ? config.pontuacao.acerto : config.pontuacao.erro;

            // Salvar pontuação
            addGamePoints('reginaldo-hora-do-lanche', selectedTeam, pontos);
            addPoints(selectedTeam, pontos);

            // Salvar no storage específico
            saveReginaldoHoraDoLancheScore({
                id: comida.id,
                nome: comida.nome,
                timeAdivinhador: selectedTeam,
                resultado: currentResult,
                pontos,
                timestamp: Date.now()
            });

            // Chamar callback para atualizar estado
            onSaveComida(comida.id, selectedTeam, currentResult, pontos);

            handleClose();
        }
    };

    const getImageSrc = () => {
        if (isRevealed || isAlreadyPlayed) {
            return `/food-zoom/${comida.id} real.jpg`;
        }
        return `/food-zoom/${comida.id} close.jpg`;
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title={isAlreadyPlayed ? comida.nome : 'Reginaldo Hora do Lanche'}
        >
            <div className="modal-content">
                <div className="comida-image-container">
                    <img
                        src={getImageSrc()}
                        alt={isRevealed || isAlreadyPlayed ? `Foto real de ${comida.nome}` : `Foto com zoom de ${comida.nome}`}
                        className="comida-image"
                    />
                </div>

                <div className="game-controls">
                    {!isAlreadyPlayed && (
                        <div className="team-selection">
                            <h3>Qual time está adivinhando?</h3>
                            <TeamSelector
                                value={selectedTeam}
                                onChange={setSelectedTeam}
                                teams={gameState.teams}
                            />
                        </div>
                    )}

                    {selectedTeam && !isAnswered && !isAlreadyPlayed && (
                        <div className="answer-buttons">
                            <Button type={ButtonType.SUCCESS} onClick={handleAcerto} disabled={!selectedTeam} />
                            <Button type={ButtonType.ERROR} onClick={handleErro} disabled={!selectedTeam} />
                        </div>
                    )}

                    {isAnswered && currentResult && (
                        <div className="result-actions">
                            <div className="comida-info">
                                <h3>
                                    {currentResult === 'acerto' ? comida.nome : `Comida #${comida.id}`}
                                </h3>
                                <p className={currentResult === 'acerto' ? 'positive-points' : 'negative-points'}>
                                    {currentResult === 'acerto'
                                        ? `✅ Acerto! +${config.pontuacao.acerto} pontos`
                                        : `❌ Erro! ${config.pontuacao.erro} pontos`
                                    }
                                </p>
                            </div>
                            <div className="action-buttons">
                                <Button type={ButtonType.RESET} onClick={handleReset} />
                                <Button type={ButtonType.SAVE} onClick={handleSalvar} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BaseModal>
    );
};
