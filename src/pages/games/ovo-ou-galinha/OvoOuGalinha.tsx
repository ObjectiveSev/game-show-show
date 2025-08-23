import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../../components/back-button/BackButton';
import { OvoOuGalinhaModal } from './OvoOuGalinhaModal';
import { DefaultCard } from '../../../components/default-card/DefaultCard';
import { useGameState } from '../../../hooks/useGameState';
import { carregarOvoOuGalinha } from '../../../utils/ovoOuGalinhaLoader';
import { saveOvoOuGalinhaScore, removeOvoOuGalinhaScore } from '../../../utils/scoreStorage';
import { STORAGE_KEYS } from '../../../constants';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import type { OvoOuGalinhaTrio, OvoOuGalinhaConfig, OvoOuGalinhaScoreEntry } from '../../../types/ovoOuGalinha';
import { TagType, ButtonType } from '../../../types';
import './OvoOuGalinha.css';
import './OvoOuGalinhaModal.css';

export const OvoOuGalinha: React.FC = () => {
    const navigate = useNavigate();
    const { gameState, syncPoints } = useGameState();
    const [config, setConfig] = useState<OvoOuGalinhaConfig | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [trioSelecionado, setTrioSelecionado] = useState<OvoOuGalinhaTrio | null>(null);

    const [estadosTrios, setEstadosTrios] = useState<Map<number, { acertou: boolean; timeAdivinhador: string }>>(new Map());

    useEffect(() => {
        const carregarConfig = async () => {
            try {
                const configData = await carregarOvoOuGalinha();
                if (configData && configData.trios) {
                    setConfig(configData);
                }
            } catch (error) {
                console.error('Erro ao carregar configuração:', error);
            }
        };

        const carregarEstados = () => {
            try {
                const raw = localStorage.getItem(STORAGE_KEYS.OVO_OU_GALINHA_SCORES);
                if (raw) {
                    const scores: OvoOuGalinhaScoreEntry[] = JSON.parse(raw);
                    const novosEstados = new Map();

                    scores.forEach(score => {
                        novosEstados.set(score.trioId, {
                            acertou: score.pontos > 0,
                            timeAdivinhador: score.timeAdivinhador
                        });
                    });

                    setEstadosTrios(novosEstados);
                }
            } catch (error) {
                console.error('Erro ao carregar estados:', error);
            }
        };

        carregarConfig();
        carregarEstados();
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (modalOpen) {
                    setModalOpen(false);
                    setTrioSelecionado(null);
                } else {
                    navigate('/');
                }
            }
        };

        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [modalOpen, navigate]);

    const handleTrioClick = (trio: OvoOuGalinhaTrio) => {
        try {
            setTrioSelecionado(trio);
            setModalOpen(true);
        } catch (error) {
            console.error('Erro ao abrir trio:', error);
        }
    };

    const handleConfirmar = (trioId: number, timeSelecionado: string, acertou: boolean) => {
        try {
            // Salvar score no localStorage
            const scoreEntry: OvoOuGalinhaScoreEntry = {
                trioId,
                timeAdivinhador: timeSelecionado,
                pontos: acertou ? (config?.pontuacao.acerto || 2) : 0,
                timestamp: Date.now()
            };

            saveOvoOuGalinhaScore(scoreEntry);

            // Atualizar estado local
            setEstadosTrios(prev => new Map(prev).set(trioId, {
                acertou,
                timeAdivinhador: timeSelecionado
            }));



            // Sincronizar pontos
            syncPoints();
        } catch (error) {
            console.error('Erro ao confirmar trio:', error);
        }
    };

    const handleResetarTrio = (trioId: number) => {
        try {
            // Remover score do localStorage
            removeOvoOuGalinhaScore(trioId);

            // Remover do estado local
            setEstadosTrios(prev => {
                const novosEstados = new Map(prev);
                novosEstados.delete(trioId);
                return novosEstados;
            });

            // Sincronizar pontos
            syncPoints();
        } catch (error) {
            console.error('Erro ao resetar trio:', error);
        }
    };

    if (!config) {
        return (
            <div className="ovo-ou-galinha-page">
                <div className="loading">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="ovo-ou-galinha-page">
            <div className="page-header">
                <BackButton />
                <div className="header-content">
                    <h1>🥚 O Ovo ou a Galinha</h1>
                    <p>Ordene os eventos históricos do mais antigo para o mais recente.</p>
                </div>
            </div>

            <div className="trios-grid">
                {config.trios.map((trio) => {
                    const estado = estadosTrios.get(trio.id);
                    const completado = estado !== undefined;

                    return (
                        <DefaultCard
                            key={trio.id}
                            title={`Trio #${trio.id}`}
                            tags={
                                completado
                                    ? [TagType.READ, estado.acertou ? TagType.CORRECT : TagType.ERROR]
                                    : [TagType.PENDING]
                            }
                            body={
                                completado
                                    ? getTeamNameFromString(estado.timeAdivinhador, gameState.teams)
                                    : undefined
                            }
                            button={
                                completado
                                    ? {
                                        type: ButtonType.RESET,
                                        onClick: (e) => {
                                            e.stopPropagation();
                                            handleResetarTrio(trio.id);
                                        }
                                    }
                                    : undefined
                            }
                            onClick={() => handleTrioClick(trio)}
                            className={completado ? 'completado' : ''}
                        />
                    );
                })}
            </div>

            {modalOpen && trioSelecionado && (
                <OvoOuGalinhaModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setTrioSelecionado(null);
                    }}
                    trio={trioSelecionado}
                    onConfirm={handleConfirmar}
                    gameState={gameState}
                    estadoAtual={estadosTrios.get(trioSelecionado.id)}
                />
            )}
        </div>
    );
}; 