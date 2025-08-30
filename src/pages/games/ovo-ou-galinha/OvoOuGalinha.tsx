import React, { useState, useEffect } from 'react';

import { GameHeader } from '../../../components/game-header/GameHeader';
import { OvoOuGalinhaModal } from './OvoOuGalinhaModal';
import { DefaultCard } from '../../../components/default-card/DefaultCard';
import { carregarOvoOuGalinha } from '../../../utils/ovoOuGalinhaLoader';
import { saveOvoOuGalinhaScore, removeOvoOuGalinhaScore, loadOvoOuGalinhaScores } from '../../../utils/scoreStorage';
import { STORAGE_KEYS } from '../../../constants';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import { soundManager } from '../../../utils/soundManager';
import type { OvoOuGalinhaTrio, OvoOuGalinhaConfig, OvoOuGalinhaScoreEntry } from '../../../types/ovoOuGalinha';
import type { AppState } from '../../../types';
import { TagType, ButtonType } from '../../../types';
import './OvoOuGalinha.css';
import './OvoOuGalinhaModal.css';

interface Props {
    gameState: AppState & { syncPoints?: () => void };
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
}

export const OvoOuGalinha: React.FC<Props> = ({ gameState, addGamePoints }) => {
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



    const handleTrioClick = (trio: OvoOuGalinhaTrio) => {
        try {
            // Verificar se o trio já foi jogado
            const estadoTrio = estadosTrios.get(trio.id);
            if (!estadoTrio) {
                soundManager.playGameSound('ovo-ou-galinha');
            }
            setTrioSelecionado(trio);
            setModalOpen(true);
        } catch (error) {
            console.error('Erro ao abrir trio:', error);
        }
    };

    const handleConfirmar = (trioId: number, timeSelecionado: string, acertou: boolean) => {
        try {
            const pontos = acertou ? (config?.pontuacao.acerto || 2) : 0;

            // Adicionar pontos ao dashboard se acertou
            if (pontos > 0) {
                addGamePoints('ovo-ou-galinha', timeSelecionado as 'A' | 'B', pontos);
            }

            // Salvar score detalhado no localStorage
            const scoreEntry: OvoOuGalinhaScoreEntry = {
                trioId,
                timeAdivinhador: timeSelecionado,
                pontos,
                timestamp: Date.now()
            };

            saveOvoOuGalinhaScore(scoreEntry);

            // Atualizar estado local
            setEstadosTrios(prev => new Map(prev).set(trioId, {
                acertou,
                timeAdivinhador: timeSelecionado
            }));

            // Sincronizar pontos para atualizar dashboard
            if (gameState.syncPoints) {
                gameState.syncPoints();
            }
        } catch (error) {
            console.error('❌ Erro ao confirmar trio:', error);
        }
    };

    const handleResetarTrio = (trioId: number) => {
        try {
            // Buscar o score atual para remover os pontos
            const scores = loadOvoOuGalinhaScores();
            const scoreToRemove = scores.find(score => score.trioId === trioId);

            if (scoreToRemove && scoreToRemove.pontos > 0) {
                // Remover pontos negativos (para cancelar os pontos dados anteriormente)
                const pontosNegativos = -scoreToRemove.pontos;
                addGamePoints('ovo-ou-galinha', scoreToRemove.timeAdivinhador as 'A' | 'B', pontosNegativos);
            }

            // Remover score detalhado do localStorage
            removeOvoOuGalinhaScore(trioId);

            // Remover do estado local
            setEstadosTrios(prev => {
                const novosEstados = new Map(prev);
                novosEstados.delete(trioId);
                return novosEstados;
            });

            // Sincronizar pontos para atualizar dashboard
            if (gameState.syncPoints) {
                gameState.syncPoints();
            }
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
            <GameHeader gameId="ovo-ou-galinha" />

            <main className="main-content">
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
                                        ? `Respondido por: ${getTeamNameFromString(estado.timeAdivinhador, gameState.teams)}`
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
            </main>

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