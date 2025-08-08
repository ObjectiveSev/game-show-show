import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { VerdadeAbsurda, TextoEstado, PontuacaoConfig } from '../types/verdadesAbsurdas';
import { carregarVerdadesAbsurdas } from '../utils/verdadesAbsurdasLoader';
import { appendVerdadesAbsurdasScore } from '../utils/scoreStorage';
import { TextoModal } from '../components/TextoModal';
import type { AppState } from '../types';
import '../styles/VerdadesAbsurdas.css';

interface VerdadesAbsurdasProps {
    gameState: AppState;
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
}

export const VerdadesAbsurdas: React.FC<VerdadesAbsurdasProps> = ({ gameState, addGamePoints, addPoints }) => {
    const [verdadesAbsurdas, setVerdadesAbsurdas] = useState<VerdadeAbsurda[]>([]);
    const [estadosTextos, setEstadosTextos] = useState<TextoEstado[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [textoAtual, setTextoAtual] = useState<VerdadeAbsurda | null>(null);
    const [estadoAtual, setEstadoAtual] = useState<TextoEstado | null>(null);
    const [pontuacaoConfig, setPontuacaoConfig] = useState<PontuacaoConfig>({
        acertoVerdade: 1,
        erroFalso: 1,
        verdadeNaoEncontradaPeloRival: 1
    });
    const navigate = useNavigate();
    const ESTADOS_STORAGE_KEY = 'verdadesAbsurdasEstados';

    // Carregar dados do jogo
    useEffect(() => {
        let isMounted = true;

        const carregarDados = async () => {
            try {
                const data = await carregarVerdadesAbsurdas();

                // Verificar se o componente ainda está montado
                if (!isMounted) return;

                setVerdadesAbsurdas(data.verdadesAbsurdas);
                setPontuacaoConfig(data.pontuacao);

                // Inicializar estados dos textos (default)
                const estadosIniciais: TextoEstado[] = data.verdadesAbsurdas.map(texto => ({
                    id: texto.id,
                    lido: false,
                    verdadesEncontradas: [],
                    erros: 0,
                    verdadesReveladas: false
                }));

                // Tentar carregar estados salvos do localStorage e mesclar por id
                try {
                    const salvo = localStorage.getItem(ESTADOS_STORAGE_KEY);
                    if (salvo) {
                        const estadosSalvos: TextoEstado[] = JSON.parse(salvo);
                        const mesclados = estadosIniciais.map((estado) => {
                            const encontrado = estadosSalvos.find(s => s.id === estado.id);
                            return encontrado ? { ...estado, ...encontrado } : estado;
                        });
                        setEstadosTextos(mesclados);
                    } else {
                        setEstadosTextos(estadosIniciais);
                    }
                } catch {
                    setEstadosTextos(estadosIniciais);
                }

                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        carregarDados();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []);

    // Persistir mudanças de estado no localStorage (inclui campo lido)
    useEffect(() => {
        if (estadosTextos.length === 0) return;
        try {
            localStorage.setItem(ESTADOS_STORAGE_KEY, JSON.stringify(estadosTextos));
        } catch { }
    }, [estadosTextos]);

    const handleCardClick = (texto: VerdadeAbsurda) => {
        const estado = estadosTextos.find(e => e.id === texto.id);
        if (estado) {
            setTextoAtual(texto);
            setEstadoAtual(estado);
            setModalAberto(true);
        }
    };

    const handleVoltarDashboard = () => {
        // Usar setTimeout para evitar problemas com message channel
        setTimeout(() => {
            navigate('/');
        }, 0);
    };

    const handleUpdateEstado = (novoEstado: TextoEstado) => {
        setEstadosTextos(prev =>
            prev.map(estado =>
                estado.id === novoEstado.id ? novoEstado : estado
            )
        );
        setEstadoAtual(novoEstado);
    };

    const handleSalvarPontuacao = (timeLeitor: 'A' | 'B') => {
        if (!textoAtual || !estadoAtual || estadoAtual.pontuacaoSalva) return;

        const total = textoAtual.verdades.length;
        const acertosRival = estadoAtual.verdadesEncontradas.length;
        const naoEncontradas = total - acertosRival;
        const errosRival = estadoAtual.erros;
        const timeAdivinhador: 'A' | 'B' = timeLeitor === 'A' ? 'B' : 'A';

        const pontosAdivinhador = acertosRival * pontuacaoConfig.acertoVerdade - errosRival * pontuacaoConfig.erroFalso;
        const pontosLeitor = naoEncontradas * pontuacaoConfig.verdadeNaoEncontradaPeloRival;

        appendVerdadesAbsurdasScore({
            textoId: textoAtual.id,
            timeLeitor,
            timeAdivinhador,
            verdadesEncontradas: acertosRival,
            verdadesNaoEncontradas: naoEncontradas,
            erros: errosRival,
            pontosLeitor,
            pontosAdivinhador,
            verdadesAcertadasIndices: estadoAtual.verdadesEncontradas,
            timestamp: Date.now()
        });

        // Atualizar placar agregado do jogo
        addGamePoints('verdades-absurdas', timeLeitor, pontosLeitor);
        addGamePoints('verdades-absurdas', timeAdivinhador, pontosAdivinhador);

        // Atualizar placar total (Dashboard)
        addPoints(timeLeitor, pontosLeitor);
        addPoints(timeAdivinhador, pontosAdivinhador);

        // Marcar como lido e pontuação salva
        const novoEstado: TextoEstado = {
            ...estadoAtual,
            lido: true,
            pontuacaoSalva: true
        };
        handleUpdateEstado(novoEstado);
    };

    // Próximo texto removido por design atual; fechamento via handleCloseModal

    const handleCloseModal = () => {
        setModalAberto(false);
        setTextoAtual(null);
        setEstadoAtual(null);
    };

    if (loading) {
        return (
            <div className="verdades-absurdas">
                <div className="loading">
                    <h2>Carregando Verdades Absurdas...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="verdades-absurdas">
            <header className="header">
                <button className="voltar-button" onClick={handleVoltarDashboard}>
                    ← Voltar ao Dashboard
                </button>
                <h1>🤔 Verdades Absurdas</h1>
                <p>Encontre as 5 verdades escondidas em cada texto</p>
            </header>

            <main className="main-content">
                <div className="textos-grid">
                    {verdadesAbsurdas.map((texto) => {
                        const estado = estadosTextos.find(e => e.id === texto.id);
                        const progresso = estado ? estado.verdadesEncontradas.length : 0;

                        return (
                            <div
                                key={texto.id}
                                className={`texto-card ${estado?.lido ? 'lido' : ''}`}
                                onClick={() => handleCardClick(texto)}
                            >
                                <div className="card-header">
                                    <h3>{texto.titulo}</h3>
                                    <div className="status-indicator">
                                        {estado?.lido ? (
                                            <span className="status-lido">✅ Lido</span>
                                        ) : (
                                            <span className="status-pendente">⏳ Pendente</span>
                                        )}
                                    </div>
                                </div>

                                <div className="progress-info">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${(progresso / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">
                                        {progresso}/5 verdades encontradas
                                    </span>
                                </div>

                                {estado && estado.erros > 0 && (
                                    <div className="erros-info">
                                        <span className="erros-count">❌ {estado.erros} erros</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>

            <TextoModal
                isOpen={modalAberto}
                onClose={handleCloseModal}
                texto={textoAtual}
                estado={estadoAtual}
                onUpdateEstado={handleUpdateEstado}
                onSalvarPontuacao={handleSalvarPontuacao}
                teams={gameState.teams}
            />
        </div>
    );
}; 