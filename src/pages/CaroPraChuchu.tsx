import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AppState } from '../types';
import type { ItemCaroPraChuchu, ItemEstado, CaroPraChuchuData } from '../types/caroPraChuchu';
import { carregarCaroPraChuchu } from '../utils/caroPraChuchuLoader';
import { saveCaroPraChuchuScore, removeCaroPraChuchuScore } from '../utils/scoreStorage';
import { STORAGE_KEYS } from '../constants';
import { BackButton } from '../components/common/BackButton';
import { CaroPraChuchuModal } from '../components/CaroPraChuchuModal';
import '../styles/CaroPraChuchu.css';

interface Props {
    gameState: AppState & { syncPoints?: () => void };
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
}

export const CaroPraChuchu: React.FC<Props> = ({ gameState, addGamePoints, addPoints }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState<CaroPraChuchuData | null>(null);
    const [estados, setEstados] = useState<ItemEstado[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState<ItemCaroPraChuchu | null>(null);

    // Lógica de ESC: se modal aberto fecha modal, senão volta ao dashboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (modalOpen) {
                    setModalOpen(false);
                } else {
                    navigate('/');
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [modalOpen, navigate]);

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
        setItemSelecionado(item);
        setModalOpen(true);
    };

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
        // Remover pontuação do storage
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

                    return (
                        <div
                            key={item.id}
                            className={`item-card ${lido ? 'lido' : ''}`}
                            onClick={() => handleCardClick(item)}
                        >
                            <div className="card-header">
                                <h3>{lido ? item.nome : `Item #${item.id}`}</h3>
                                <div className="status-indicator">
                                    {lido ? (
                                        <span className="status-lido">✅ Lido</span>
                                    ) : (
                                        <span className="status-pendente">⏳ Pendente</span>
                                    )}
                                </div>
                            </div>

                            {lido && (
                                <div className="item-info">
                                    <span className="local-data">{item.local}, {item.data}</span>
                                    {estado?.pontos && (
                                        <span className="pontos-info">+{estado.pontos} pontos</span>
                                    )}
                                </div>
                            )}

                            {lido && (
                                <button
                                    className="resetar-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleResetarPontuacao(item.id);
                                    }}
                                >
                                    🔄 Resetar
                                </button>
                            )}
                        </div>
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
            <BackButton />
            <header className="header">
                <h1>💰 Caro Pra Chuchu</h1>
                <p>Adivinhe os preços históricos dos itens mais caros</p>
            </header>

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