import React, { useEffect, useState } from 'react';
import type { AppState } from '../types';
import type { Noticia, NoticiaEstado, NoticiasExtraordinariasData } from '../types/noticiasExtraordinarias';
import { carregarNoticiasExtraordinarias } from '../utils/noticiasExtraordinariasLoader';
import { saveNoticiasExtraordinariasScore, removeNoticiasExtraordinariasScore } from '../utils/scoreStorage';
import { STORAGE_KEYS } from '../constants';
import { BackButton } from '../components/common/BackButton';
import { TeamSelector } from '../components/common/TeamSelector';
import { VerdadeButton } from '../components/common/VerdadeButton';
import { MentiraButton } from '../components/common/MentiraButton';
import { ResultadoStatus } from '../components/common/ResultadoStatus';
import { soundManager } from '../utils/soundManager';
import '../styles/NoticiasExtraordinarias.css';

interface Props {
    gameState: AppState & { syncPoints?: () => void };
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
}

export const NoticiasExtraordinarias: React.FC<Props> = ({ gameState, addGamePoints, addPoints }) => {
    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState<NoticiasExtraordinariasData | null>(null);
    const [estados, setEstados] = useState<NoticiaEstado[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [noticiaSelecionada, setNoticiaSelecionada] = useState<Noticia | null>(null);
    const [timeSelecionado, setTimeSelecionado] = useState<'A' | 'B' | ''>('');
    const [palpite, setPalpite] = useState<boolean | null>(null);
    const [resultado, setResultado] = useState<'acerto' | 'erro' | null>(null);

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

        // Verificar se a notícia já foi lida e carregar seu estado
        const estadoExistente = estados.find(e => e.id === noticia.id);

        if (estadoExistente?.lida) {
            // Notícia já foi lida - carregar estado salvo
            setTimeSelecionado(estadoExistente.timeAdivinhador || '');
            setPalpite(estadoExistente.respostaEscolhida || null);
            setResultado(estadoExistente.acertou ? 'acerto' : 'erro');
        } else {
            // Nova notícia - resetar estados
            setTimeSelecionado('');
            setPalpite(null);
            setResultado(null);
        }

        setModalOpen(true);
    };

    const handlePalpite = (respostaEscolhida: boolean) => {
        if (!noticiaSelecionada) return;

        setPalpite(respostaEscolhida);
        const acertou = respostaEscolhida === noticiaSelecionada.resposta;
        setResultado(acertou ? 'acerto' : 'erro');

        // Tocar som apropriado
        if (acertou) {
            soundManager.playSuccessSound();
        } else {
            soundManager.playErrorSound();
        }
    };

    const handleSalvarPontuacao = () => {
        if (!noticiaSelecionada || !timeSelecionado || !dados || resultado === null) return;

        const acertou = resultado === 'acerto';
        const pontos = acertou ? dados.pontuacao.acerto : 0;

        if (acertou) {
            addGamePoints('noticias-extraordinarias', timeSelecionado, pontos);
            addPoints(timeSelecionado, pontos);
        }

        // Salvar pontuação detalhada
        const scoreEntry = {
            noticiaId: noticiaSelecionada.id,
            manchete: noticiaSelecionada.manchete,
            timeAdivinhador: timeSelecionado,
            respostaEscolhida: palpite!,
            respostaCorreta: noticiaSelecionada.resposta,
            acertou,
            pontos,
            timestamp: Date.now()
        };
        saveNoticiasExtraordinariasScore(scoreEntry);

        // Atualizar estado da notícia
        const novoEstado: NoticiaEstado = {
            id: noticiaSelecionada.id,
            lida: true,
            timeAdivinhador: timeSelecionado,
            respostaEscolhida: palpite!,
            acertou,
            pontuacaoSalva: true
        };

        setEstados(prev => prev.map(e => e.id === noticiaSelecionada.id ? novoEstado : e));

        // Sincronizar pontos
        if (gameState.syncPoints) {
            gameState.syncPoints();
        }

        // Limpar estados do modal
        setPalpite(null);
        setResultado(null);
        setTimeSelecionado('');
        setNoticiaSelecionada(null);

        // Fechar modal
        setModalOpen(false);
    };

    const handleResetarPontuacao = (noticiaId: string) => {
        // Remover pontuação do storage
        removeNoticiasExtraordinariasScore(noticiaId);

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
                        <div
                            key={noticia.id}
                            className={`noticia-card ${lida ? 'lida' : ''}`}
                            onClick={() => handleCardClick(noticia)}
                        >
                            <div className="card-header">
                                <h3>Notícia #{noticia.id}</h3>
                                <div className="status-indicator">
                                    {lida ? (
                                        <>
                                            <span className="status-lida">✅ Lida</span>
                                            <span className={`status-${estado?.acertou ? 'acerto' : 'erro'}`}>
                                                {estado?.acertou ? '✅ Acertou' : '❌ Errou'}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="status-pendente">⏳ Pendente</span>
                                    )}
                                </div>
                            </div>

                            {lida && (
                                <div className="time-info">
                                    <span>
                                        {estado?.timeAdivinhador === 'A'
                                            ? (gameState.teams.teamA.name || 'Time A')
                                            : (gameState.teams.teamB.name || 'Time B')
                                        }
                                    </span>
                                </div>
                            )}

                            {lida && (
                                <button
                                    className="resetar-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleResetarPontuacao(noticia.id);
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
            <div className="noticias-extraordinarias">
                <div className="loading">
                    <h2>Carregando Notícias Extraordinárias...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="noticias-extraordinarias">
            <BackButton />
            <header className="header">
                <h1>📰 Notícias Extraordinárias</h1>
                <p>Identifique se as manchetes são verdadeiras ou falsas</p>
            </header>

            <main className="main-content">
                {renderNoticiasGrid()}
            </main>

            {/* Modal da notícia */}
            {modalOpen && noticiaSelecionada && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-content jornal-style" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📰 Manchete #{noticiaSelecionada.id}</h2>
                            <button className="close-button" onClick={() => setModalOpen(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="manchete">
                                <h3>{noticiaSelecionada.manchete}</h3>
                            </div>

                            <div className="subtitulo">
                                <p>{noticiaSelecionada.subtitulo}</p>
                            </div>

                            <div className="controles">
                                <div className="time-selector">
                                    <TeamSelector
                                        teams={gameState.teams}
                                        value={timeSelecionado}
                                        onChange={(value) => setTimeSelecionado(value)}
                                    />
                                </div>

                                {!palpite && !resultado && (
                                    <div className="palpite-buttons">
                                        <VerdadeButton
                                            onClick={() => handlePalpite(true)}
                                            disabled={!timeSelecionado}
                                        />
                                        <MentiraButton
                                            onClick={() => handlePalpite(false)}
                                            disabled={!timeSelecionado}
                                        />
                                    </div>
                                )}

                                {resultado && (
                                    <ResultadoStatus
                                        resultado={resultado}
                                        pontos={resultado === 'acerto' ? (dados?.pontuacao.acerto || 0) : 0}
                                        showPontuacao={false}
                                    />
                                )}

                                <div className="modal-actions">
                                    {resultado && (
                                        <>
                                            <button className="reset-btn" onClick={() => {
                                                setPalpite(null);
                                                setResultado(null);
                                                setTimeSelecionado('');
                                            }}>
                                                🔄 Resetar
                                            </button>
                                            {!estados.find(e => e.id === noticiaSelecionada.id)?.pontuacaoSalva && (
                                                <button className="save-btn" onClick={handleSalvarPontuacao}>
                                                    💾 Salvar Pontos
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 