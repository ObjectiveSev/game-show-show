import React, { useEffect, useState } from 'react';
import type { DicionarioPalavra, DicionarioData, PalavraEstado } from '../types/dicionarioSurreal';
import { carregarDicionarioSurreal } from '../utils/dicionarioLoader';
import { useNavigate } from 'react-router-dom';
import '../styles/VerdadesAbsurdas.css';
import type { AppState } from '../types';
import { DicionarioModal } from '../components/DicionarioModal';
import { appendDicionarioSurrealScore } from '../utils/scoreStorage';

interface Props {
    gameState: AppState;
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
}

export const DicionarioSurreal: React.FC<Props> = ({ gameState, addGamePoints, addPoints }) => {
    const navigate = useNavigate();
    const [dados, setDados] = useState<DicionarioData | null>(null);
    const [estados, setEstados] = useState<PalavraEstado[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [palavraAtual, setPalavraAtual] = useState<DicionarioPalavra | null>(null);
    const [estadoAtual, setEstadoAtual] = useState<PalavraEstado | null>(null);
    const ESTADOS_KEY = 'dicionarioSurrealEstados';

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await carregarDicionarioSurreal();
                if (!mounted) return;
                setDados(data);
                const base = data.palavras.map((p) => ({ id: p.id, dicasAbertas: p.definicoes.map(() => false), respostaSelecionada: undefined, extras: 0, lido: false }));
                try {
                    const raw = localStorage.getItem(ESTADOS_KEY);
                    if (raw) {
                        const saved: PalavraEstado[] = JSON.parse(raw);
                        const merged = base.map((b) => saved.find((s) => s.id === b.id) || b);
                        setEstados(merged);
                    } else {
                        setEstados(base);
                    }
                } catch {
                    setEstados(base);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (estados.length) localStorage.setItem(ESTADOS_KEY, JSON.stringify(estados));
    }, [estados]);

    if (loading) return <div className="verdades-absurdas"><div className="loading"><h2>Carregando Dicionário...</h2></div></div>;
    if (!dados) return null;

    const handleVoltar = () => setTimeout(() => navigate('/'), 0);

    const handleCardClick = (p: DicionarioPalavra) => {
        const st = estados.find((e) => e.id === p.id);
        if (st) {
            setPalavraAtual(p);
            setEstadoAtual(st);
            setModalAberto(true);
        }
    };

    const handleUpdateEstado = (novo: PalavraEstado) => {
        setEstados((prev) => prev.map((e) => (e.id === novo.id ? novo : e)));
        setEstadoAtual(novo);
    };

    return (
        <div className="verdades-absurdas">
            <header className="header">
                <button className="voltar-button" onClick={handleVoltar}>← Voltar ao Dashboard</button>
                <h1>📚 Dicionário Surreal</h1>
                <p>Escolha a definição correta para palavras raras</p>
            </header>

            <main className="main-content">
                <div className="textos-grid">
                    {dados.palavras.map((p) => {
                        const st = estados.find((e) => e.id === p.id);
                        return (
                            <div key={p.id} className={`texto-card ${st?.lido ? 'lido' : ''}`} onClick={() => handleCardClick(p)}>
                                <div className="card-header">
                                    <h3>{p.palavra}</h3>
                                    <div className="status-indicator">{st?.lido ? <span className="status-lido">✅ Respondida</span> : <span className="status-pendente">⏳ Pendente</span>}</div>
                                </div>
                            </div>
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
                }}
            />
        </div>
    );
};

