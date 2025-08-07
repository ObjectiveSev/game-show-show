import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { VerdadeAbsurda, TextoEstado } from '../types/verdadesAbsurdas';
import { carregarVerdadesAbsurdas } from '../utils/verdadesAbsurdasLoader';
import '../styles/VerdadesAbsurdas.css';

export const VerdadesAbsurdas: React.FC = () => {
    const [verdadesAbsurdas, setVerdadesAbsurdas] = useState<VerdadeAbsurda[]>([]);
    const [estadosTextos, setEstadosTextos] = useState<TextoEstado[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Carregar dados do jogo
    useEffect(() => {
        let isMounted = true;

        const carregarDados = async () => {
            try {
                const data = await carregarVerdadesAbsurdas();
                
                // Verificar se o componente ainda está montado
                if (!isMounted) return;
                
                setVerdadesAbsurdas(data.verdadesAbsurdas);

                // Inicializar estados dos textos
                const estadosIniciais: TextoEstado[] = data.verdadesAbsurdas.map(texto => ({
                    id: texto.id,
                    lido: false,
                    verdadesEncontradas: [],
                    erros: 0,
                    verdadesReveladas: false
                }));
                setEstadosTextos(estadosIniciais);

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

    const handleCardClick = (texto: VerdadeAbsurda) => {
        // TODO: Implementar navegação para o modal do texto
        try {
            console.log('Abrir texto:', texto.titulo);
        } catch (error) {
            console.error('Erro ao abrir texto:', error);
        }
    };

    const handleVoltarDashboard = () => {
        // Usar setTimeout para evitar problemas com message channel
        setTimeout(() => {
            navigate('/');
        }, 0);
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
        </div>
    );
}; 