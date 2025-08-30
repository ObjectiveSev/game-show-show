import React, { useState, useEffect } from 'react';

import type { AppState } from '../../../types';
import type { ItemCaroPraChuchu, ItemEstado, CaroPraChuchuData } from '../../../types/caroPraChuchu';
import { carregarCaroPraChuchu } from '../../../utils/caroPraChuchuLoader';
import { saveCaroPraChuchuScore, removeCaroPraChuchuScore } from '../../../utils/scoreStorage';
import { STORAGE_KEYS } from '../../../constants';
import { GameHeader } from '../../../components/game-header/GameHeader';
import { CaroPraChuchuModal } from './CaroPraChuchuModal';
import { DefaultCard } from '../../../components/default-card/DefaultCard';
import { TagType, ButtonType } from '../../../types';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import { soundManager } from '../../../utils/soundManager';
import './CaroPraChuchu.css';

interface Props {
    gameState: AppState & { syncPoints?: () => void };
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
}

export const CaroPraChuchu: React.FC<Props> = ({ gameState, addGamePoints, addPoints }) => {

    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState<CaroPraChuchuData | null>(null);
    const [estados, setEstados] = useState<ItemEstado[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState<ItemCaroPraChuchu | null>(null);



    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const d = await carregarCaroPraChuchu();
                if (!mounted) return;
                setDados(d);

                // Inicializar estados dos itens
                const base = d.itens.map((item) => ({
                    id: item.id,
                    lido: false
                } as ItemEstado));

                try {
                    const raw = localStorage.getItem(STORAGE_KEYS.CARO_PRA_CHUCHU_ESTADOS);
                    if (raw) {
                        const saved: ItemEstado[] = JSON.parse(raw);
                        const merged = base.map(b => saved.find(s => s.id === b.id) || b);
                        setEstados(merged);
                    } else {
                        setEstados(base);
                    }
                } catch {
                    setEstados(base);
                }
            } catch (error) {
                console.error('❌ Erro ao carregar Caro Pra Chuchu:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (estados.length) localStorage.setItem(STORAGE_KEYS.CARO_PRA_CHUCHU_ESTADOS, JSON.stringify(estados));
    }, [estados]);

    const handleCardClick = (item: ItemCaroPraChuchu) => {
        // Verificar se o item já foi lido
        const estadoItem = estados.find(e => e.id === item.id);
        if (estadoItem && !estadoItem.lido) {
            soundManager.playGameSound('caro-pra-chuchu');
        }
        setItemSelecionado(item);
        setModalOpen(true);
    };

    // Cleanup effect para parar o som do jogo quando o modal fechar
    useEffect(() => {
        if (!modalOpen) {
            // Parar o som do jogo quando o modal fechar
            soundManager.stopCurrentSound();
        }
    }, [modalOpen]);

    const handleSalvarPontuacao = (timeId: 'A' | 'B', tipoAcerto: 'moedaCorreta' | 'pertoSuficiente' | 'acertoLendario' | 'erro') => {
        if (!itemSelecionado || !dados) return;

        const pontos = dados.pontuacao[tipoAcerto] || 0;

        if (pontos > 0) {
            addGamePoints('caro-pra-chuchu', timeId, pontos);
            addPoints(timeId, pontos);
        }

        // Salvar pontuação detalhada
        const scoreEntry = {
            itemId: itemSelecionado.id,
            nomeItem: itemSelecionado.nome,
            timeAdivinhador: timeId,
            tipoAcerto,
            pontos,
            timestamp: Date.now()
        };
        saveCaroPraChuchuScore(scoreEntry);

        // Atualizar estado do item
        const novoEstado: ItemEstado = {
            id: itemSelecionado.id,
            lido: true,
            timeAdivinhador: timeId,
            tipoAcerto,
            pontos,
            pontuacaoSalva: true
        };

        setEstados(prev => prev.map(e => e.id === itemSelecionado.id ? novoEstado : e));

        // Sincronizar pontos
        if (gameState.syncPoints) {
            gameState.syncPoints();
        }

        // Fechar modal
        setModalOpen(false);
        setItemSelecionado(null);
    };

    const handleResetarPontuacao = (itemId: string) => {
        // Buscar o estado atual para remover os pontos do time
        const estadoAtual = estados.find(e => e.id === itemId);

        if (estadoAtual && estadoAtual.timeAdivinhador && estadoAtual.pontos) {
            // Remover pontos negativos (para cancelar os pontos dados anteriormente)
            const pontosNegativos = -estadoAtual.pontos;
            addGamePoints('caro-pra-chuchu', estadoAtual.timeAdivinhador, pontosNegativos);
            addPoints(estadoAtual.timeAdivinhador, pontosNegativos);
        }

        // Remover pontuação do storage detalhado
        removeCaroPraChuchuScore(itemId);

        // Resetar estado local
        setEstados(prev => prev.map(estado =>
            estado.id === itemId
                ? { ...estado, lido: false, timeAdivinhador: undefined, tipoAcerto: undefined, pontos: undefined, pontuacaoSalva: false }
                : estado
        ));

        // Sincronizar pontos globais se disponível
        if (gameState.syncPoints) {
            gameState.syncPoints();
        }
    };

    const renderItensGrid = () => {
        if (!dados) return null;

        return (
            <div className="itens-grid">
                {dados.itens.map((item) => {
                    const estado = estados.find(e => e.id === item.id);
                    const lido = estado?.lido || false;

                    // Determinar tags baseadas no tipo de acerto
                    const getTags = (): TagType[] => {
                        const tags: TagType[] = [lido ? TagType.READ : TagType.PENDING];

                        if (lido && estado?.tipoAcerto) {
                            switch (estado.tipoAcerto) {
                                case 'moedaCorreta':
                                    tags.push(TagType.MOEDA_CORRETA);
                                    break;
                                case 'pertoSuficiente':
                                    tags.push(TagType.PERTO_SUFICIENTE);
                                    break;
                                case 'acertoLendario':
                                    tags.push(TagType.ACERTO_LENDARIO);
                                    break;
                                case 'erro':
                                    tags.push(TagType.ERRO);
                                    break;
                            }
                        }

                        return tags;
                    };

                    return (
                        <DefaultCard
                            key={item.id}
                            title={lido ? item.nome : `Item #${item.id}`}
                            tags={getTags()}
                            body={
                                lido && estado?.timeAdivinhador
                                    ? `${item.local}, ${item.data} • ${getTeamNameFromString(estado.timeAdivinhador, gameState.teams)}`
                                    : undefined
                            }
                            button={
                                lido
                                    ? {
                                        type: ButtonType.RESET,
                                        onClick: (e) => {
                                            e.stopPropagation();
                                            handleResetarPontuacao(item.id);
                                        }
                                    }
                                    : undefined
                            }
                            onClick={() => handleCardClick(item)}
                            className={lido ? 'lido' : ''}
                        >
                            {lido && estado?.pontos !== undefined && (
                                <div className={`pontos-info ${estado.pontos === 0 ? 'zero-pontos' : ''}`}>
                                    {estado.pontos > 0 ? `+${estado.pontos}` : estado.pontos} pontos
                                </div>
                            )}
                        </DefaultCard>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="caro-pra-chuchu">
                <div className="loading">
                    <h2>Carregando Caro Pra Chuchu...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="caro-pra-chuchu">
            <GameHeader gameId="caro-pra-chuchu" />

            <main className="main-content">
                {renderItensGrid()}
            </main>

            {/* Modal do item */}
            {modalOpen && itemSelecionado && (
                <CaroPraChuchuModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    item={itemSelecionado}
                    pontuacao={dados?.pontuacao}
                    teams={gameState.teams}
                    estado={estados.find(e => e.id === itemSelecionado.id)}
                    onSalvar={handleSalvarPontuacao}
                    onResetar={() => {
                        // Apenas resetar o estado interno, não fechar o modal
                        // O modal será fechado apenas quando salvar ou clicar no X
                    }}
                />
            )}
        </div>
    );
}; 