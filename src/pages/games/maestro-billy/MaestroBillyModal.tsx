import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../../components/base-modal/BaseModal';
import { Button } from '../../../components/button/Button';
import { TeamSelector } from '../../../components/team-selector/TeamSelector';
import { Counter } from '../../../components/counter/Counter';
import type { Musica, MusicaEstado, MaestroBillyConfig, MaestroBillyScoreEntry } from '../../../types/maestroBilly';
import type { Team } from '../../../types';
import { ButtonType } from '../../../types';
import { soundManager } from '../../../utils/soundManager';
import { STORAGE_KEYS, GAME_IDS } from '../../../constants';

import './MaestroBillyModal.css';

interface MaestroBillyModalProps {
    isOpen: boolean;
    onClose: () => void;
    musica: Musica;
    config: MaestroBillyConfig;
    gameState: {
        teams: {
            teamA: Team;
            teamB: Team;
        };
    };
    onUpdateEstado: (novoEstado: MusicaEstado) => void;
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
}

export const MaestroBillyModal: React.FC<MaestroBillyModalProps> = ({ isOpen, onClose, musica, config, gameState, onUpdateEstado, addGamePoints }) => {
    const [selectedTeam, setSelectedTeam] = useState<'A' | 'B' | null>(null);
    const [tentativaAtual, setTentativaAtual] = useState<number>(1);
    const [pontuacaoAcumulada, setPontuacaoAcumulada] = useState<{ timeA: number; timeB: number }>({ timeA: 0, timeB: 0 });
    const [batePronto, setBatePronto] = useState<boolean>(false);
    const [showResultado, setShowResultado] = useState<boolean>(false);
    const [hitType, setHitType] = useState<'none' | 'musica' | 'artista' | 'tudo' | 'erro' | 'ninguemAcertou'>('none');
    const [isPlaying, setIsPlaying] = useState(false);

    // Resetar estado quando modal abrir
    useEffect(() => {
        if (isOpen) {
            setSelectedTeam(null);
            setTentativaAtual(1);
            setBatePronto(false);
            setPontuacaoAcumulada({ timeA: 0, timeB: 0 });
            setShowResultado(false);
            setHitType('none');
            setIsPlaying(false);
            soundManager.playGameSound(GAME_IDS.MAESTRO_BILLY);
        } else {
            stopMusicAndCleanup();
        }
    }, [isOpen, musica.id]);

    // Parar sons quando modal fechar
    useEffect(() => {
        if (!isOpen) {
            soundManager.stopCurrentSound();
            setIsPlaying(false);

            // Forçar parada de todos os áudios como backup
            const allAudios = document.querySelectorAll('audio');
            allAudios.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        }
    }, [isOpen]);

    // Garantir que a música pare quando o modal fechar (backup)
    useEffect(() => {
        return () => {
            // Cleanup function - executa quando o componente é desmontado
            soundManager.stopCurrentSound();

            // Forçar parada de todos os áudios como backup
            const allAudios = document.querySelectorAll('audio');
            allAudios.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        };
    }, []);

    // Função para parar música e limpar estado
    const stopMusicAndCleanup = () => {
        soundManager.stopCurrentSound();
        setIsPlaying(false);
    };



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

    const handleAcertoMusica = () => {
        if (!selectedTeam) return;

        const timeQueAcertou = batePronto ? (selectedTeam === 'A' ? 'B' : 'A') : selectedTeam;
        const tentativaIndex = tentativaAtual - 1; // 1 -> 0, 2 -> 1, 3 -> 2
        const pontos = config.pontuacao[tentativaIndex].musica;

        setHitType('musica');
        setPontuacaoAcumulada(prev => ({
            ...prev,
            [timeQueAcertou === 'A' ? 'timeA' : 'timeB']: prev[timeQueAcertou === 'A' ? 'timeA' : 'timeB'] + pontos
        }));

        setShowResultado(true);
    };

    const handleAcertoArtista = () => {
        if (!selectedTeam) return;

        const timeQueAcertou = batePronto ? (selectedTeam === 'A' ? 'B' : 'A') : selectedTeam;
        const tentativaIndex = tentativaAtual - 1; // 1 -> 0, 2 -> 1, 3 -> 2
        const pontos = config.pontuacao[tentativaIndex].artista;

        setHitType('artista');
        setPontuacaoAcumulada(prev => ({
            ...prev,
            [timeQueAcertou === 'A' ? 'timeA' : 'timeB']: prev[timeQueAcertou === 'A' ? 'timeA' : 'timeB'] + pontos
        }));

        setShowResultado(true);
    };

    const handleAcertoTudo = () => {
        if (!selectedTeam) return;

        const timeQueAcertou = batePronto ? (selectedTeam === 'A' ? 'B' : 'A') : selectedTeam;
        const tentativaIndex = tentativaAtual - 1; // 1 -> 0, 2 -> 1, 3 -> 2
        const pontosNome = config.pontuacao[tentativaIndex].musica;
        const pontosArtista = config.pontuacao[tentativaIndex].artista;
        const pontosTotal = pontosNome + pontosArtista;

        setHitType('tudo');
        setPontuacaoAcumulada(prev => ({
            ...prev,
            [timeQueAcertou === 'A' ? 'timeA' : 'timeB']: prev[timeQueAcertou === 'A' ? 'timeA' : 'timeB'] + pontosTotal
        }));

        setShowResultado(true);
    };

    const handleErro = () => {
        if (!selectedTeam) return;

        const timeQueErrou = batePronto ? (selectedTeam === 'A' ? 'B' : 'A') : selectedTeam;
        const pontos = config.erro;

        setHitType('erro');
        setPontuacaoAcumulada(prev => ({
            ...prev,
            [timeQueErrou === 'A' ? 'timeA' : 'timeB']: prev[timeQueErrou === 'A' ? 'timeA' : 'timeB'] + pontos
        }));

        // Não altera nada, apenas marca o erro e continua o jogo
    };

    const handleNinguemAcertou = () => {
        if (!selectedTeam) return;
        setHitType('ninguemAcertou');
        setShowResultado(true);
    };

    const handleResetar = () => {
        setShowResultado(false);
        setSelectedTeam(null);
        setTentativaAtual(1);
        setBatePronto(false);
        setPontuacaoAcumulada({ timeA: 0, timeB: 0 });
        setHitType('none');
        stopMusicAndCleanup();
    };

    const handleSalvarPontuacao = () => {
        if (!selectedTeam) return;

        let acertouNome = false;
        let acertouArtista = false;
        let pontosNome = 0;
        let pontosArtista = 0;
        let totalPontos = 0;
        let ninguemAcertou = false;

        // Determinar o tipo de acerto baseado no hitType
        const tentativaIndex = tentativaAtual - 1; // 1 -> 0, 2 -> 1, 3 -> 2
        const pontosMaximos = config.pontuacao[tentativaIndex];

        if (hitType === 'musica') {
            acertouNome = true;
            pontosNome = pontosMaximos.musica;
            totalPontos = pontosMaximos.musica;
        } else if (hitType === 'artista') {
            acertouArtista = true;
            pontosArtista = pontosMaximos.artista;
            totalPontos = pontosMaximos.artista;
        } else if (hitType === 'tudo') {
            acertouNome = true;
            acertouArtista = true;
            pontosNome = pontosMaximos.musica;
            pontosArtista = pontosMaximos.artista;
            totalPontos = pontosMaximos.musica + pontosMaximos.artista;
        } else if (hitType === 'erro') {
            // Para erro, usar os pontos do JSON (-2)
            totalPontos = config.erro;
        } else if (hitType === 'ninguemAcertou') {
            totalPontos = 0;
            ninguemAcertou = true;
        }

        // Determinar qual time recebe os pontos baseado no bate-pronto
        // Se bate-pronto está OFF: pontos vão para o time selecionado no dropdown
        // Se bate-pronto está ON: pontos vão para o time contrário
        const timeQueRecebePontos = batePronto ? (selectedTeam === 'A' ? 'B' : 'A') : selectedTeam;

        const scoreEntry: MaestroBillyScoreEntry = {
            musicaId: musica.id,
            nomeMusica: musica.nome,
            artista: musica.artista,
            arquivo: musica.arquivo,
            timeAdivinhador: timeQueRecebePontos,
            tentativa: tentativaAtual,
            acertouNome: acertouNome,
            acertouArtista: acertouArtista,
            pontosNome: pontosNome,
            pontosArtista: pontosArtista,
            totalPontos: totalPontos,
            batePronto: batePronto,
            ninguemAcertou: ninguemAcertou
        };

        // Salvar score no localStorage
        const scores = JSON.parse(localStorage.getItem(STORAGE_KEYS.MAESTRO_BILLY_SCORES) || '[]');
        scores.push(scoreEntry);
        localStorage.setItem(STORAGE_KEYS.MAESTRO_BILLY_SCORES, JSON.stringify(scores));

        // Atualizar estado da música como lida
        const novoEstado: MusicaEstado = {
            id: musica.id,
            lida: true,
            tentativas: tentativaAtual,
            acertouNome,
            acertouArtista,
            pontosNome,
            pontosArtista,
            ninguemAcertou
        };

        // Atualizar estado da música como lida
        onUpdateEstado(novoEstado);

        // Aplicar TODOS os pontos acumulados (incluindo erros) aos times
        // Para erros, não usar addGamePoints pois o scoreEntry já salva os pontos corretos
        if (hitType !== 'erro') {
            if (pontuacaoAcumulada.timeA !== 0) {
                addGamePoints(GAME_IDS.MAESTRO_BILLY, 'A', pontuacaoAcumulada.timeA);
            }
            if (pontuacaoAcumulada.timeB !== 0) {
                addGamePoints(GAME_IDS.MAESTRO_BILLY, 'B', pontuacaoAcumulada.timeB);
            }
        }

        // Parar música antes de fechar
        stopMusicAndCleanup();

        // Fechar modal
        onClose();
    };

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
                        <Button type={ButtonType.RESET} text="Resetar" onClick={handleResetar} />
                        <Button type={ButtonType.SAVE} text="Salvar Pontuação" onClick={handleSalvarPontuacao} />
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
                        value={selectedTeam || ''}
                        onChange={(v) => setSelectedTeam(v as 'A' | 'B' | null)}
                        label="Time adivinhador:"
                    />
                    <Counter
                        label="Tentativa Atual"
                        value={tentativaAtual}
                        onIncrement={() => setTentativaAtual(prev => Math.min(prev + 1, 3))}
                        onDecrement={() => setTentativaAtual(prev => Math.max(prev - 1, 1))}
                    />
                </div>

                <div className="bate-pronto-section">
                    <div className="bate-pronto-checkbox">
                        <input
                            type="checkbox"
                            checked={batePronto}
                            onChange={(e) => setBatePronto(e.target.checked)}
                        />
                        <label onClick={() => setBatePronto(prev => !prev)}>Bate-Pronto</label>
                    </div>
                </div>


                <div className="modal-actions">
                    <Button type={ButtonType.PLAY} onClick={handleTocarMusica} disabled={isPlaying || !selectedTeam} />
                    <Button type={ButtonType.STOP} onClick={handleStopMusica} disabled={!isPlaying} />
                </div>
                <div className="modal-actions">
                    <Button type={ButtonType.SUCCESS} text="Acerto Música" onClick={() => handleAcertoMusica()} disabled={!selectedTeam} />
                    <Button type={ButtonType.SUCCESS} text="Acerto Artista" onClick={() => handleAcertoArtista()} disabled={!selectedTeam} />
                    <Button type={ButtonType.SUCCESS} text="Acerto Tudo" onClick={() => handleAcertoTudo()} disabled={!selectedTeam} />
                </div>
                <div className="modal-actions">
                    <Button type={ButtonType.ERROR} text="Erro" onClick={() => handleErro()} disabled={!selectedTeam} />
                </div>
                <div className="modal-actions">
                    <Button type={ButtonType.RESET} text="Ninguém Acertou" onClick={() => handleNinguemAcertou()} disabled={!selectedTeam} />
                </div>
            </div>
        </BaseModal>
    );
}
