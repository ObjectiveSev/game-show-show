import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../../components/base-modal/BaseModal';
import { Button } from '../../../components/button/Button';
import { TeamSelector } from '../../../components/team-selector/TeamSelector';
import { Counter } from '../../../components/counter/Counter';
import type { Musica, MusicaEstado, MaestroBillyConfig } from '../../../types/maestroBilly';
import type { Team } from '../../../types';
import { ButtonType } from '../../../types';
import { soundManager } from '../../../utils/soundManager';
import './MaestroBillyModal.css';

interface MaestroBillyModalProps {
    isOpen: boolean;
    onClose: () => void;
    musica: Musica;
    estado: MusicaEstado;
    config: MaestroBillyConfig;
    onSalvarPontuacao: (timeId: 'A' | 'B', pontosNome: number, pontosArtista: number, tentativa: number) => void;
    gameState: {
        teams: {
            teamA: Team;
            teamB: Team;
        };
    };
}

export const MaestroBillyModal: React.FC<MaestroBillyModalProps> = ({
    isOpen,
    onClose,
    musica,
    estado,
    config,
    onSalvarPontuacao,
    gameState
}) => {
    const [selectedTeam, setSelectedTeam] = useState<'A' | 'B' | ''>('');
    const [tentativaAtual, setTentativaAtual] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showResultado, setShowResultado] = useState(false);

    // Resetar estado quando modal abrir
    useEffect(() => {
        if (isOpen && !estado.lida) {
            setSelectedTeam('');
            setTentativaAtual(1);

            // Tocar som do Maestro Billy ao abrir modal não lido
            soundManager.playGameSound('maestro-billy');
        }
    }, [isOpen, estado.lida]);

    // Parar sons quando modal fechar
    useEffect(() => {
        if (!isOpen) {
            soundManager.stopCurrentSound();
            setIsPlaying(false);
        }
    }, [isOpen]);



    const handleTocarMusica = () => {
        // Tocar música local da pasta musicas
        const audioPath = `/musicas/${musica.arquivo}`;
        soundManager.playCustomSound(audioPath);
        setIsPlaying(true);
    };

    const handleStopMusica = () => {
        // Parar música que está tocando
        soundManager.stopCurrentSound();
        setIsPlaying(false);
    };

    const handleAcertoTimeAdivinhando = () => {
        if (!selectedTeam) return;
        setShowResultado(true);
    };

    const handleErroTimeAdivinhando = () => {
        if (!selectedTeam) return;

        onSalvarPontuacao(selectedTeam, config.pontuacao.erro, config.pontuacao.erro, tentativaAtual);
    };

    const handleAcertoTimeBatePronto = () => {
        if (!selectedTeam) return;
        setShowResultado(true);
    };

    const handleErroTimeBatePronto = () => {
        if (!selectedTeam) return;

        const timeBatePronto = selectedTeam === 'A' ? 'B' : 'A';
        onSalvarPontuacao(timeBatePronto, config.pontuacao.erro, config.pontuacao.erro, tentativaAtual);
    };

    const handleNinguemAcertou = () => {
        if (!selectedTeam) return;
        setShowResultado(true);
    };

    const handleResetar = () => {
        setShowResultado(false);
        setSelectedTeam('');
        setTentativaAtual(1);
        setIsPlaying(false);
        soundManager.stopCurrentSound();
    };

    const handleSalvarPontuacao = () => {
        if (!selectedTeam) return;

        // Aqui vamos implementar a lógica de pontuação depois
        // Por enquanto, vamos fechar o modal
        onClose();
    };

    if (estado.lida) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose} title="Resultado Final">
                <div className="maestro-billy-modal">
                    <div className="modal-header">
                        <h2>{musica.nome}</h2>
                        <p className="artista">{musica.artista}</p>
                    </div>

                    <div className="resultado-info">
                        <div className="pontuacao-final">
                            <h3>Pontuação Final</h3>
                            <div className="pontos-detalhados">
                                <div className={`ponto ${estado.pontosNome > 0 ? 'acerto' : 'erro'}`}>
                                    Nome: {estado.pontosNome > 0 ? `+${estado.pontosNome}` : '0'} pts
                                </div>
                                <div className={`ponto ${estado.pontosNome > 0 ? 'acerto' : 'erro'}`}>
                                    Artista: {estado.pontosArtista > 0 ? `+${estado.pontosArtista}` : '0'} pts
                                </div>
                            </div>
                            <div className="total-pontos">
                                Total: {estado.pontosNome + estado.pontosArtista} pts
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <Button type={ButtonType.RESET} text="Fechar" onClick={onClose} />
                    </div>
                </div>
            </BaseModal>
        );
    }

    // Tela de resultado quando alguém acertou ou ninguém acertou
    if (showResultado) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose} title="Resultado">
                <div className="maestro-billy-modal">
                    <div className="modal-header">
                        <h2>{musica.nome}</h2>
                        <p className="artista">{musica.artista}</p>
                    </div>

                    <div className="resultado-info">
                        <h3>🎵 Música Revelada!</h3>
                        <p>Nome: <strong>{musica.nome}</strong></p>
                        <p>Artista: <strong>{musica.artista}</strong></p>
                    </div>

                    <div className="modal-actions">
                        <Button type={ButtonType.RESET} text="🔄 Resetar" onClick={handleResetar} />
                        <Button type={ButtonType.SAVE} text="💾 Salvar Pontuação" onClick={handleSalvarPontuacao} />
                    </div>
                </div>
            </BaseModal>
        );
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={`Música #${musica.id}`}>
            <div className="maestro-billy-modal">

                <div className="controles-row">
                    <TeamSelector
                        teams={gameState.teams}
                        value={selectedTeam}
                        onChange={(v) => setSelectedTeam(v)}
                        label="Time adivinhador:"
                    />
                    <Counter
                        label="Tentativa Atual"
                        value={tentativaAtual}
                        onIncrement={() => setTentativaAtual(prev => Math.min(prev + 1, 3))}
                        onDecrement={() => setTentativaAtual(prev => Math.max(prev - 1, 1))}
                    />
                </div>


                <div className="modal-actions">
                    <Button type={ButtonType.PLAY} onClick={handleTocarMusica} disabled={isPlaying || !selectedTeam} />
                    <Button type={ButtonType.STOP} onClick={handleStopMusica} disabled={!isPlaying} />
                </div>
                <div className="modal-actions">
                    <Button type={ButtonType.SUCCESS} text="✅ Acerto Time Adivinhando" onClick={() => handleAcertoTimeAdivinhando()} disabled={!selectedTeam} />
                    <Button type={ButtonType.SUCCESS} text="✅ Acerto Time Bate-Pronto" onClick={() => handleAcertoTimeBatePronto()} disabled={!selectedTeam} />
                </div>
                <div className="modal-actions">
                    <Button type={ButtonType.ERROR} text="❌ Erro Time Adivinhando" onClick={() => handleErroTimeAdivinhando()} disabled={!selectedTeam} />
                    <Button type={ButtonType.ERROR} text="❌ Erro Time Bate-Pronto" onClick={() => handleErroTimeBatePronto()} disabled={!selectedTeam} />
                </div>
                <div className="modal-actions">
                    <Button type={ButtonType.RESET} text="❓ Ninguém Acertou" onClick={() => handleNinguemAcertou()} disabled={!selectedTeam} />
                </div>
            </div>
        </BaseModal>
    );
}
