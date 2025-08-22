import React, { useState, useEffect } from 'react';
import { BackButton } from '../components/common/BackButton';
import { DicionarioModal } from '../components/DicionarioModal';
import { DefaultCard } from '../components/common/DefaultCard';
import { carregarDicionarioSurreal } from '../utils/dicionarioLoader';
import { appendDicionarioSurrealScore } from '../utils/scoreStorage';
import type { DicionarioPalavra, PalavraEstado, DicionarioData } from '../types/dicionarioSurreal';
import type { AppState } from '../types';
import { TagType, ButtonType } from '../types';
import { STORAGE_KEYS } from '../constants';
import '../styles/DicionarioSurreal.css';

interface Props {
    gameState: AppState;
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
}

export const DicionarioSurreal: React.FC<Props> = ({ gameState, addGamePoints, addPoints }) => {
    const [dados, setDados] = useState<DicionarioData | null>(null);
    const [estados, setEstados] = useState<PalavraEstado[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [palavraAtual, setPalavraAtual] = useState<DicionarioPalavra | null>(null);
    const [estadoAtual, setEstadoAtual] = useState<PalavraEstado | null>(null);

    useEffect(() => {
        let mounted = true;

        const carregarDados = async () => {
            try {
                const data = await carregarDicionarioSurreal();
                if (!mounted) return;
                setDados(data);
                const base = data.palavras.map((p: DicionarioPalavra) => ({
                    id: p.id,
                    dicasAbertas: p.definicoes.map(() => false),
                    respostaSelecionada: undefined,
                    extras: 0,
                    lido: false
                }));
                try {
                    const raw = localStorage.getItem(STORAGE_KEYS.DICIONARIO_SURREAL_ESTADOS);
                    if (raw) {
                        const saved: PalavraEstado[] = JSON.parse(raw);
                        const merged = base.map((b: PalavraEstado) => saved.find((s) => s.id === b.id) || b);
                        setEstados(merged);
                    } else {
                        setEstados(base);
                    }
                } catch {
                    setEstados(base);
                }
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                if (mounted) setLoading(false);
            }
        };

        carregarDados();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (estados.length) localStorage.setItem(STORAGE_KEYS.DICIONARIO_SURREAL_ESTADOS, JSON.stringify(estados));
    }, [estados]);

    if (loading) return <div className="verdades-absurdas"><div className="loading"><h2>Carregando Dicionário...</h2></div></div>;
    if (!dados) return null;

    const handleCardClick = (p: DicionarioPalavra) => {
        try {
            const st = estados.find((e) => e.id === p.id);
            if (st) {
                setPalavraAtual(p);
                setEstadoAtual(st);
                setModalAberto(true);
            }
        } catch (error) {
            console.error('Erro ao abrir modal:', error);
        }
    };

    const handleUpdateEstado = (novo: PalavraEstado) => {
        try {
            setEstados((prev) => prev.map((e) => (e.id === novo.id ? novo : e)));
            setEstadoAtual(novo);
        } catch (error) {
            console.error('Erro ao atualizar estado:', error);
        }
    };

    const handleResetarPalavra = (palavraId: string) => {
        try {
            // Resetar estado da palavra
            const novoEstado: PalavraEstado = {
                id: palavraId,
                dicasAbertas: [],
                respostaSelecionada: undefined,
                extras: 0,
                lido: false,
                pontuacaoSalva: false
            };

            setEstados((prev) => prev.map((e) => (e.id === palavraId ? novoEstado : e)));

            // Remover score do localStorage se existir
            // Aqui você pode adicionar lógica para remover o score se necessário

        } catch (error) {
            console.error('Erro ao resetar palavra:', error);
        }
    };

    return (
        <div className="dicionario-surreal">
            <div className="page-header">
                <BackButton />
                <div className="header-content">
                    <h1>📚 Dicionário Surreal</h1>
                    <p>Escolha a definição correta para palavras raras</p>
                </div>
            </div>

            <main className="main-content">
                <div className="palavras-grid">
                    {dados.palavras.map((p) => {
                        const st = estados.find((e) => e.id === p.id);
                        return (
                            <DefaultCard
                                key={p.id}
                                title={st?.lido ? p.palavra : `Palavra #${p.id}`}
                                tags={[st?.lido ? TagType.CORRECT : TagType.PENDING]}
                                button={
                                    st?.lido
                                        ? {
                                            type: ButtonType.RESET,
                                            onClick: (e) => {
                                                e.stopPropagation();
                                                handleResetarPalavra(p.id);
                                            }
                                        }
                                        : undefined
                                }
                                onClick={() => handleCardClick(p)}
                                className={st?.lido ? 'lido' : ''}
                            />
                        );
                    })}
                </div>
            </main>

            <DicionarioModal
                isOpen={modalAberto}
                onClose={() => { setModalAberto(false); setPalavraAtual(null); setEstadoAtual(null); }}
                palavra={palavraAtual}
                estado={estadoAtual}
                onUpdateEstado={handleUpdateEstado}
                teams={gameState.teams}
                pontuacao={dados.pontuacao}
                onSalvar={(time, pontos, novoEstado) => {
                    addGamePoints('dicionario-surreal', time, pontos);
                    addPoints(time, pontos);
                    handleUpdateEstado(novoEstado);
                    // salvar score detalhado
                    if (palavraAtual && estadoAtual) {
                        appendDicionarioSurrealScore({
                            palavraId: palavraAtual.id,
                            timeAdivinhador: time,
                            acertou: novoEstado.respostaSelecionada === palavraAtual.definicaoCorretaId,
                            dicasAbertas: novoEstado.dicasAbertas.filter(Boolean).length,
                            pontos,
                            definicaoMarcadaId: novoEstado.respostaSelecionada!,
                            timestamp: Date.now()
                        });
                    }

                    // Fechar modal após salvar
                    setModalAberto(false);
                    setPalavraAtual(null);
                    setEstadoAtual(null);
                }}
            />
        </div>
    );
};

