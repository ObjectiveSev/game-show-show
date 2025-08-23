import React, { useState, useEffect } from 'react';
import { DefaultCard } from '../../../components/default-card/DefaultCard';
import { GameHeader } from '../../../components/game-header/GameHeader';
import { ReginaldoHoraDoLancheModal } from './ReginaldoHoraDoLancheModal';
import { carregarReginaldoHoraDoLanche } from '../../../utils/reginaldoHoraDoLancheLoader';
import { removeReginaldoHoraDoLancheScore } from '../../../utils/scoreStorage';
import type { Team } from '../../../types';
import type { Comida, ReginaldoHoraDoLancheConfig, ComidaEstado } from '../../../types/reginaldoHoraDoLanche';
import { TagType, ButtonType } from '../../../types';
import { STORAGE_KEYS } from '../../../constants';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import './ReginaldoHoraDoLanche.css';

interface ReginaldoHoraDoLancheProps {
    gameState: {
        teams: {
            teamA: Team;
            teamB: Team;
        };
        syncPoints: () => void;
    };
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
}

export const ReginaldoHoraDoLanche: React.FC<ReginaldoHoraDoLancheProps> = ({
    gameState,
    addGamePoints,
    addPoints
}) => {
    const [config, setConfig] = useState<ReginaldoHoraDoLancheConfig | null>(null);
    const [estados, setEstados] = useState<ComidaEstado[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedComida, setSelectedComida] = useState<Comida | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                const data = await carregarReginaldoHoraDoLanche();
                if (!isMounted) return;

                setConfig(data);

                // Inicializar estados das comidas (default)
                const estadosIniciais: ComidaEstado[] = data.comidas.map(comida => ({
                    id: comida.id,
                    jogado: false
                }));

                // Tentar carregar estados salvos do localStorage e mesclar por id
                try {
                    const salvo = localStorage.getItem(STORAGE_KEYS.REGINALDO_HORA_DO_LANCHE_ESTADOS);
                    if (salvo) {
                        const estadosSalvos: ComidaEstado[] = JSON.parse(salvo);
                        const mesclados = estadosIniciais.map((estado) => {
                            const encontrado = estadosSalvos.find(s => s.id === estado.id);
                            return encontrado ? { ...estado, ...encontrado } : estado;
                        });
                        setEstados(mesclados);
                    } else {
                        setEstados(estadosIniciais);
                    }
                } catch {
                    setEstados(estadosIniciais);
                }

                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar dados do Reginaldo Hora do Lanche:', error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Salvar estados no localStorage quando mudarem
    useEffect(() => {
        if (estados.length) {
            localStorage.setItem(STORAGE_KEYS.REGINALDO_HORA_DO_LANCHE_ESTADOS, JSON.stringify(estados));
        }
    }, [estados]);

    const handleCardClick = (comida: Comida) => {
        setSelectedComida(comida);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedComida(null);
    };

    const handleSaveComida = (comidaId: string, teamId: 'A' | 'B', resultado: 'acerto' | 'erro', pontos: number) => {
        // Atualizar estado local
        setEstados(prev => prev.map(estado =>
            estado.id === comidaId
                ? {
                    ...estado,
                    jogado: true,
                    timeAdivinhador: teamId,
                    resultado,
                    pontos,
                    pontuacaoSalva: true
                }
                : estado
        ));

        // Sincronizar pontos globais se disponível
        if (gameState.syncPoints) {
            gameState.syncPoints();
        }
    };

    const handleResetarPontuacao = (comidaId: string) => {
        // Remover pontuação do storage
        removeReginaldoHoraDoLancheScore(comidaId);

        // Resetar estado local
        setEstados(prev => prev.map(estado =>
            estado.id === comidaId
                ? { ...estado, jogado: false, timeAdivinhador: undefined, resultado: undefined, pontos: undefined, pontuacaoSalva: false }
                : estado
        ));

        // Sincronizar pontos globais se disponível
        if (gameState.syncPoints) {
            gameState.syncPoints();
        }
    };

    if (loading) {
        return (
            <div className="reginaldo-hora-do-lanche">
                <div className="loading">
                    <h2>Carregando Reginaldo Hora do Lanche...</h2>
                </div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="reginaldo-hora-do-lanche">
                <div className="error">
                    <h2>Erro ao carregar o jogo</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="reginaldo-hora-do-lanche">
            <GameHeader
                title="Reginaldo Hora do Lanche"
                subtitle="Clique em uma comida para começar a adivinhar!"
                emoji="🍽️"
            />

            <div className="comida-grid">
                {config.comidas.map((comida) => {
                    const estado = estados.find(e => e.id === comida.id);
                    const jogado = estado?.jogado || false;

                    // Determinar tags baseadas no resultado
                    const getTags = (): TagType[] => {
                        const tags: TagType[] = [jogado ? TagType.READ : TagType.PENDING];

                        if (jogado && estado?.resultado) {
                            switch (estado.resultado) {
                                case 'acerto':
                                    tags.push(TagType.CORRECT);
                                    break;
                                case 'erro':
                                    tags.push(TagType.ERROR);
                                    break;
                            }
                        }

                        return tags;
                    };

                    return (
                        <DefaultCard
                            key={comida.id}
                            title={jogado ? comida.nome : `Comida #${comida.id}`}
                            tags={getTags()}
                            body={
                                jogado && estado?.timeAdivinhador
                                    ? `${getTeamNameFromString(estado.timeAdivinhador, gameState.teams)}`
                                    : undefined
                            }
                            button={
                                jogado
                                    ? {
                                        type: ButtonType.RESET,
                                        onClick: (e) => {
                                            e.stopPropagation();
                                            handleResetarPontuacao(comida.id);
                                        }
                                    }
                                    : undefined
                            }
                            onClick={() => handleCardClick(comida)}
                            className={`comida-card ${jogado ? 'jogado' : ''}`}
                        >
                            {jogado && estado?.pontos !== undefined && (
                                <div className={`pontos-info ${estado.pontos > 0 ? 'pontos-positivos' :
                                        estado.pontos < 0 ? 'pontos-negativos' : 'zero-pontos'
                                    }`}>
                                    {estado.pontos > 0 ? `+${estado.pontos}` : estado.pontos} pontos
                                </div>
                            )}
                        </DefaultCard>
                    );
                })}
            </div>

            {selectedComida && (
                <ReginaldoHoraDoLancheModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    comida={selectedComida}
                    config={config}
                    gameState={gameState}
                    addGamePoints={addGamePoints}
                    addPoints={addPoints}
                    onSaveComida={handleSaveComida}
                    isAlreadyPlayed={estados.find(e => e.id === selectedComida.id)?.jogado || false}
                />
            )}
        </div>
    );
};
