import React, { useEffect, useState } from 'react';

import type { AppState } from '../../../types';
import type { Noticia, NoticiaEstado, NoticiasExtraordinariasData } from '../../../types/noticiasExtraordinarias';
import { carregarNoticiasExtraordinarias } from '../../../utils/noticiasExtraordinariasLoader';
import { saveNoticiasExtraordinariasScore } from '../../../utils/scoreStorage';
import { STORAGE_KEYS } from '../../../constants';
import { getTeamNameFromString } from '../../../utils/teamUtils';
import { GameHeader } from '../../../components/game-header/GameHeader';
import { NoticiasExtraordinariasModal } from './NoticiasExtraordinariasModal';
import { DefaultCard } from '../../../components/default-card/DefaultCard';
import { TagType, ButtonType } from '../../../types';
import './NoticiasExtraordinarias.css';

interface NoticiasExtraordinariasProps {
    gameState: AppState & { syncPoints?: () => void };
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
}

export const NoticiasExtraordinarias: React.FC<NoticiasExtraordinariasProps> = ({
    gameState,
    addGamePoints,
    addPoints
}) => {

    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState<NoticiasExtraordinariasData | null>(null);
    const [estados, setEstados] = useState<NoticiaEstado[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [noticiaSelecionada, setNoticiaSelecionada] = useState<Noticia | null>(null);


    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const d = await carregarNoticiasExtraordinarias();
                if (!mounted) return;
                setDados(d);

                // Inicializar estados das notícias
                const base = d.noticias.map((noticia) => ({
                    id: noticia.id,
                    lida: false
                } as NoticiaEstado));

                try {
                    const raw = localStorage.getItem(STORAGE_KEYS.NOTICIAS_EXTRAORDINARIAS_ESTADOS);
                    if (raw) {
                        const saved: NoticiaEstado[] = JSON.parse(raw);
                        const merged = base.map(b => saved.find(s => s.id === b.id) || b);
                        setEstados(merged);
                    } else {
                        setEstados(base);
                    }
                } catch {
                    setEstados(base);
                }
            } catch (error) {
                console.error('❌ Erro ao carregar notícias:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (estados.length) localStorage.setItem(STORAGE_KEYS.NOTICIAS_EXTRAORDINARIAS_ESTADOS, JSON.stringify(estados));
    }, [estados]);



    const handleCardClick = (noticia: Noticia) => {
        setNoticiaSelecionada(noticia);
        setModalOpen(true);
    };

    const handleSalvarPontuacao = (timeId: 'A' | 'B', pontos: number, novoEstado: NoticiaEstado) => {
        if (!noticiaSelecionada || !dados) return;

        // Adicionar pontos ao time
        addGamePoints('noticias-extraordinarias', timeId, pontos);
        addPoints(timeId, pontos);

        // Salvar score detalhado
        const scoreEntry = {
            noticiaId: noticiaSelecionada.id,
            manchete: noticiaSelecionada.manchete,
            timeAdivinhador: timeId,
            respostaEscolhida: novoEstado.respostaEscolhida!,
            respostaCorreta: noticiaSelecionada.resposta,
            acertou: novoEstado.acertou!,
            pontos,
            timestamp: Date.now()
        };
        saveNoticiasExtraordinariasScore(scoreEntry);

        // Atualizar estado da notícia
        setEstados(prev => prev.map(e => e.id === noticiaSelecionada.id ? novoEstado : e));

        // Sincronizar pontos para atualizar o placar geral
        if (gameState.syncPoints) {
            gameState.syncPoints();
        }

        // Fechar modal
        setModalOpen(false);
    };

    const handleResetarPontuacao = (noticiaId: string) => {
        // Remover pontuação do storage
        // removeNoticiasExtraordinariasScore(noticiaId); // This function was removed from imports

        // Resetar estado local
        setEstados(prev => prev.map(estado =>
            estado.id === noticiaId
                ? { ...estado, lida: false, timeAdivinhador: undefined, respostaEscolhida: undefined, acertou: undefined, pontuacaoSalva: false }
                : estado
        ));

        // Sincronizar pontos globais se disponível
        if (gameState.syncPoints) {
            gameState.syncPoints();
        }
    };

    const renderNoticiasGrid = () => {
        if (!dados) return null;

        return (
            <div className="noticias-grid">
                {dados.noticias.map((noticia) => {
                    const estado = estados.find(e => e.id === noticia.id);
                    const lida = estado?.lida || false;

                    return (
                        <DefaultCard
                            key={noticia.id}
                            title={`Notícia #${noticia.id}`}
                            tags={
                                lida
                                    ? [TagType.READ, estado?.acertou ? TagType.CORRECT : TagType.ERROR]
                                    : [TagType.PENDING]
                            }
                            body={
                                lida
                                    ? getTeamNameFromString(estado?.timeAdivinhador || '', gameState.teams)
                                    : undefined
                            }
                            button={
                                lida
                                    ? {
                                        type: ButtonType.RESET,
                                        onClick: (e) => {
                                            e.stopPropagation();
                                            handleResetarPontuacao(noticia.id);
                                        }
                                    }
                                    : undefined
                            }
                            onClick={() => handleCardClick(noticia)}
                        />
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="noticias-extraordinarias">
                <div className="loading">
                    <h2>Carregando Notícias Extraordinárias...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="noticias-extraordinarias">
            <GameHeader
                title="Notícias Extraordinárias"
                subtitle="Identifique se as manchetes são verdadeiras ou falsas"
                emoji="📰"
            />

            <main className="main-content">
                {renderNoticiasGrid()}
            </main>

            {/* Modal da notícia */}
            {modalOpen && noticiaSelecionada && (
                <NoticiasExtraordinariasModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    noticia={noticiaSelecionada}
                    estado={estados.find(e => e.id === noticiaSelecionada.id) || null}
                    teams={gameState.teams}
                    pontuacao={{
                        acerto: dados?.pontuacao.acerto || 0,
                        erro: 0
                    }}
                    onSalvar={handleSalvarPontuacao}
                    onResetar={() => handleResetarPontuacao(noticiaSelecionada.id)}
                />
            )}
        </div>
    );
}; 