import React, { useEffect, useState } from 'react';
import type { AppState, Team } from '../../../types';
import type { FatoEstado, FatoPainelista, PainelistasData, PainelistasScoreEntry } from '../../../types/painelistas';
import { carregarPainelistas } from '../../../utils/painelistasLoader';
import { carregarParticipantes } from '../../../utils/participantesLoader';
import { appendPainelistasScore, appendPainelistasPunicao, removePainelistasPunicao, loadPainelistasPunicoes, loadPainelistasScores } from '../../../utils/scoreStorage';
import { PainelistasExcentricosModal, PainelistasExcetricosModal } from './PainelistasExcentricosModal';
import { BackButton } from '../../../components/back-button/BackButton';
import './PainelistasExcentricos.css';
import { STORAGE_KEYS } from '../../../constants';

interface Props {
    gameState: AppState & { syncPoints?: () => void };
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
}

export const PainelistasExcentricos: React.FC<Props> = ({ gameState, addGamePoints, addPoints }) => {
    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState<PainelistasData | null>(null);
    const [participantes, setParticipantes] = useState<Record<string, string>>({});
    const [estados, setEstados] = useState<FatoEstado[]>([]);
    const [punicoes, setPunicoes] = useState<Record<string, boolean>>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [fatoSelecionado, setFatoSelecionado] = useState<FatoPainelista | null>(null);
    const [participanteSelecionado, setParticipanteSelecionado] = useState<string>('');

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [d, ps] = await Promise.all([carregarPainelistas(), carregarParticipantes()]);
                if (!mounted) return;
                setDados(d);

                const map: Record<string, string> = {};
                ps.forEach(p => { map[p.id] = p.nome; });
                setParticipantes(map);

                // Inicializar estados dos fatos
                const base = d.jogadores.flatMap((j: { participanteId: string; fatos: { id: string }[] }) =>
                    j.fatos.map((f: { id: string }) => ({
                        id: `${j.participanteId}:${f.id}`,
                        lido: false,
                        verificado: false
                    } as FatoEstado))
                );

                try {
                    const raw = localStorage.getItem(STORAGE_KEYS.PAINELISTAS_ESTADOS);
                    if (raw) {
                        const saved: FatoEstado[] = JSON.parse(raw);
                        const merged = base.map(b => saved.find(s => s.id === b.id) || b);
                        setEstados(merged);
                    } else {
                        setEstados(base);
                    }
                } catch {
                    setEstados(base);
                }

                // Carregar punições existentes
                const punicoesExistentes = loadPainelistasPunicoes();
                const punicoesMap: Record<string, boolean> = {};
                punicoesExistentes.forEach(p => {
                    if (p.participanteId) {
                        punicoesMap[p.participanteId] = true;
                    }
                });
                setPunicoes(punicoesMap);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (estados.length) localStorage.setItem(STORAGE_KEYS.PAINELISTAS_ESTADOS, JSON.stringify(estados));
    }, [estados]);

    // Fechar modal com ESC
    useEffect(() => {
        if (!modalOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setModalOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalOpen]);

    const handleFatoClick = (fato: FatoPainelista, participanteId: string) => {
        setFatoSelecionado(fato);
        setParticipanteSelecionado(participanteId);
        setModalOpen(true);
    };

    const handleSavePoints = (points: number) => {
        if (fatoSelecionado && participanteSelecionado && dados) {
            const jogador = dados.jogadores.find(j => j.participanteId === participanteSelecionado);
            if (jogador) {
                // Determinar qual time o jogador pertence
                const timeParticipante = gameState.teams.teamA.members.includes(participanteSelecionado) ? 'A' : 'B';
                const timeAdversario = timeParticipante === 'A' ? 'B' : 'A';

                addGamePoints('painelistas-excêntricos', timeAdversario, points);
                addPoints(timeAdversario, points);

                // Salvar score detalhado
                appendPainelistasScore({
                    fatoId: fatoSelecionado.id,
                    participanteId: participanteSelecionado,
                    participanteNome: participantes[participanteSelecionado] || participanteSelecionado,
                    fatoTexto: fatoSelecionado.texto,
                    timeParticipante,
                    timeAdivinhador: timeAdversario,
                    acertou: points > 0,
                    pontos: points,
                    timestamp: Date.now()
                });

                // Marcar fato como verificado
                const fid = `${participanteSelecionado}:${fatoSelecionado.id}`;
                setEstados(prev => prev.map(e => e.id === fid ? { ...e, verificado: true } : e));
            }
        }
    };

    const handleReset = () => {
        if (fatoSelecionado && participanteSelecionado) {
            const fid = `${participanteSelecionado}:${fatoSelecionado.id}`;
            setEstados(prev => prev.map(e => e.id === fid ? { ...e, verificado: false } : e));
        }
    };

    const handlePunicao = (participanteId: string, fatosFaltando: number) => {
        if (dados) {
            const pontos = dados.pontuacao.fatoNaoFornecido;
            const time = gameState.teams.teamA.members.includes(participanteId) ? 'A' : 'B';

            addGamePoints('painelistas-excêntricos', time, pontos * fatosFaltando);
            addPoints(time, pontos * fatosFaltando);

            appendPainelistasPunicao({
                participanteId,
                time,
                pontos: pontos * fatosFaltando,
                timestamp: Date.now()
            });

            setPunicoes(prev => ({ ...prev, [participanteId]: true }));
        }
    };

    const handleResetarPontuacao = (participanteId: string) => {
        if (dados) {
            const jogador = dados.jogadores.find(j => j.participanteId === participanteId);
            if (jogador) {
                const time = gameState.teams.teamA.members.includes(participanteId) ? 'A' : 'B';

                // 1. Resetar todos os fatos lidos deste participante
                setEstados(prev => prev.map(estado =>
                    estado.id.startsWith(participanteId + ':')
                        ? { ...estado, verificado: false }
                        : estado
                ));

                // 2. Remover pontuações deste participante do placar detalhado
                const scoresExistentes = loadPainelistasScores();
                const scoresFiltrados = scoresExistentes.filter((score: PainelistasScoreEntry) =>
                    score.participanteId !== participanteId
                );
                localStorage.setItem(STORAGE_KEYS.PAINELISTAS_SCORES, JSON.stringify(scoresFiltrados));

                // 3. Remover punições deste participante
                removePainelistasPunicao(participanteId);
                setPunicoes(prev => ({ ...prev, [participanteId]: false }));

                // 4. Recalcular e atualizar placar geral
                // Primeiro, remover pontos existentes deste participante
                const pontosExistentes = scoresExistentes
                    .filter((score: PainelistasScoreEntry) => score.participanteId === participanteId)
                    .reduce((sum: number, score: PainelistasScoreEntry) => sum + (score.pontos || 0), 0);

                if (pontosExistentes !== 0) {
                    addGamePoints('painelistas-excêntricos', time, -pontosExistentes);
                    addPoints(time, -pontosExistentes);
                }

                // 5. Sincronizar pontos para atualizar o dashboard
                if (gameState.syncPoints) {
                    gameState.syncPoints();
                }
            }
        }
    };

    const renderTimeSection = (time: Team) => {
        if (!dados) return null;

        const todosMembros = time.members;

        if (todosMembros.length === 0) {
            return (
                <div key={time.id} className="time-section">
                    <h2 className="time-title">{time.name || `Time ${time.id}`}</h2>
                    <div className="time-vazio">
                        <p>⏳ Este time ainda não tem jogadores selecionados</p>
                        <p className="time-vazio-subtitle">
                            Configure os membros do time nas configurações do dashboard
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div key={time.id} className="time-section">
                <h2 className="time-title">{time.name || `Time ${time.id}`}</h2>
                <div className="jogadores-grid">
                    {todosMembros.map((membroId) => {
                        const jogadorConfigurado = dados.jogadores.find(j => j.participanteId === membroId);

                        const fatosVerificados = jogadorConfigurado ? estados.filter(e =>
                            e.id.startsWith(membroId + ':') && e.verificado
                        ).length : 0;
                        const fatosConfigurados = jogadorConfigurado ? jogadorConfigurado.fatos.length : 0;
                        const fatosEsperados = dados.pontuacao.fatosEsperadosPorJogador;

                        const fatosFaltando = Math.max(0, fatosEsperados - fatosConfigurados);

                        const temPunicao = punicoes[membroId];

                        return (
                            <div key={membroId} className="jogador-card">
                                <div className="jogador-header">
                                    <h3>{participantes[membroId] || membroId}</h3>
                                    <div className="status-info">
                                        <span className="fatos-status">
                                            {fatosVerificados}/{fatosEsperados} fatos
                                        </span>
                                        {temPunicao && (
                                            <div className="punicao-info">
                                                <span className="punicao-badge">⚠️ Punido</span>
                                            </div>
                                        )}
                                    </div>
                                </div>


                                {jogadorConfigurado && jogadorConfigurado.fatos.length > 0 ? (
                                    <div className="fatos-container">
                                        {jogadorConfigurado.fatos.map((fato, index) => {
                                            const fid = `${membroId}:${fato.id}`;
                                            const estado = estados.find(e => e.id === fid);

                                            return (
                                                <div
                                                    key={fid}
                                                    className={`fato-card ${estado?.verificado ? 'verificado' : ''}`}
                                                    onClick={() => handleFatoClick(fato, membroId)}
                                                >
                                                    <h4>Fato {index + 1}</h4>
                                                    {estado?.verificado && <span className="status-badge">✓</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="sem-fatos">
                                        <p>📝 Este jogador não tem fatos configurados</p>
                                    </div>
                                )}

                                {!temPunicao && fatosFaltando > 0 && (
                                    <div className="multas-container">
                                        <button
                                            className="punicao-btn"
                                            onClick={() => handlePunicao(membroId, fatosFaltando)}
                                        >
                                            ⚠️ Aplicar Punição ({dados.pontuacao.fatoNaoFornecido * fatosFaltando > 0 ? '+' : ''}{dados.pontuacao.fatoNaoFornecido * fatosFaltando} pontos)
                                            <span className="punicao-detalhes">
                                                {fatosFaltando} fato{fatosFaltando > 1 ? 's' : ''} faltando
                                            </span>
                                        </button>
                                    </div>
                                )}

                                {/* Botão de resetar pontuação - aparece para participantes com fatos lidos OU punição */}
                                {(fatosVerificados > 0 || temPunicao) && (
                                    <button
                                        className="resetar-pontuacao-btn"
                                        onClick={() => handleResetarPontuacao(membroId)}
                                    >
                                        🔄 Resetar Pontuação
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (loading) return <div className="painelistas"><div className="loading"><h2>Carregando...</h2></div></div>;
    if (!dados) return null;

    return (
        <div className="painelistas">
            <BackButton />
            <header className="header">
                <h1>🎭 Painelistas Excêntricos</h1>
                <p>Escolha um fato por participante para jogar</p>
            </header>

            <main className="main-content">
                {renderTimeSection(gameState.teams.teamA)}
                {renderTimeSection(gameState.teams.teamB)}
            </main>

            <PainelistasExcentricosModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                fato={fatoSelecionado}
                participanteNome={participantes[participanteSelecionado] || participanteSelecionado}
                timeAdversario={fatoSelecionado && participanteSelecionado && gameState.teams ?
                    (gameState.teams.teamA.members.includes(participanteSelecionado) ? 'B' : 'A') : 'A'}
                onSavePoints={handleSavePoints}
                onReset={handleReset}
                estadoFato={fatoSelecionado && participanteSelecionado ?
                    estados.find(e => e.id === `${participanteSelecionado}:${fatoSelecionado.id}`) : undefined}
            />
        </div>
    );
};

