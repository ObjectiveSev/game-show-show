import React, { useEffect, useState } from 'react';
import type { DicionarioPalavra, PalavraEstado } from '../types/dicionarioSurreal';
import type { Team } from '../types';
import { TeamSelector } from './common/TeamSelector';
import { HostControls } from './common/HostControls';
import '../styles/TextoModal.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    palavra: DicionarioPalavra | null;
    estado: PalavraEstado | null;
    onUpdateEstado: (estado: PalavraEstado) => void;
    teams: { teamA: Team; teamB: Team };
    pontuacao: { baseAcerto: number; pontosPorDica: number };
    onSalvar: (time: 'A' | 'B', pontos: number, novoEstado: PalavraEstado) => void;
}

export const DicionarioModal: React.FC<Props> = ({ isOpen, onClose, palavra, estado, onUpdateEstado, teams, pontuacao, onSalvar }) => {
    const [time, setTime] = useState<'' | 'A' | 'B'>('');
    const [pontosAtuais, setPontosAtuais] = useState(0);
    const [verificado, setVerificado] = useState(false);
    const [acertou, setAcertou] = useState<boolean | null>(null);

    // Fechar com ESC
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, estado]);

    useEffect(() => {
        if (!palavra || !estado) return;
        // inicia pontos com base (extras são separados)
        const dicasAbertasCount = estado.dicasAbertas.filter(Boolean).length;
        const base = pontuacao.baseAcerto + dicasAbertasCount * pontuacao.pontosPorDica;
        if (verificado) {
            setPontosAtuais(acertou ? base : -base);
        } else {
            setPontosAtuais(base);
        }
    }, [palavra, estado, pontuacao, verificado, acertou]);

    if (!isOpen || !palavra || !estado) return null;

    const toggleDica = (idx: number) => {
        const dicasAbertas = [...estado.dicasAbertas];
        if (!dicasAbertas[idx]) {
            dicasAbertas[idx] = true;
            const novo: PalavraEstado = { ...estado, dicasAbertas };
            onUpdateEstado(novo);
            setPontosAtuais((p) => p + pontuacao.pontosPorDica);
        }
    };

    const setResposta = (id: string) => {
        onUpdateEstado({ ...estado, respostaSelecionada: id });
    };

    const setExtras = (val: number) => {
        onUpdateEstado({ ...estado, extras: val });
    };

    const canSave = !!time && !!estado.respostaSelecionada && !estado.pontuacaoSalva && verificado;

    const handleSave = () => {
        if (!canSave) return;
        const pontos = pontosAtuais + (estado.extras || 0);
        const novo: PalavraEstado = { ...estado, lido: true, pontuacaoSalva: true };
        onSalvar(time, pontos, novo);
    };

    return (
        <div className="texto-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="texto-modal">
                <div className="modal-header">
                    <h2>{palavra.palavra}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-content">
                    <div className="controles-host">
                        <div className="status-info">
                            <TeamSelector teams={teams} value={time} onChange={(v) => setTime(v)} label="Time adivinhador:" />
                            <div className="verdades-info"><span className="label">Pontos atuais:</span><span className="valor">{pontosAtuais}</span></div>
                            <div className="erros-info extras-stepper">
                                <span className="label">Extras:</span>
                                <div className="extras-box">
                                    <div className="extras-buttons">
                                        <button className="extras-btn" onClick={() => setExtras((estado.extras || 0) + 1)}>▲</button>
                                        <button className="extras-btn" onClick={() => setExtras((estado.extras || 0) - 1)}>▼</button>
                                    </div>
                                    <div className="extras-value">{estado.extras || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="texto-container" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="texto-completo" style={{ cursor: 'default' }}>
                            {palavra.definicoes.map((d, idx) => (
                                <div
                                    key={d.id}
                                    className={`def-item ${estado.respostaSelecionada === d.id ? 'selected' : ''} ${verificado ? (d.id === palavra.definicaoCorretaId ? 'def-correct' : 'def-incorrect') : ''}`}
                                    onClick={() => setResposta(d.id)}
                                >
                                    <div className="def-content">
                                        <div className="def-text">{d.texto}</div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn-revelar" disabled={estado.dicasAbertas[idx]} onClick={(e) => { e.stopPropagation(); toggleDica(idx); }}>
                                                {estado.dicasAbertas[idx] ? '✅ Dica aberta' : '💡 Abrir Dica'}
                                            </button>
                                            <button
                                                className="btn-salvar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setResposta(d.id);
                                                    const ok = d.id === palavra.definicaoCorretaId;
                                                    setAcertou(ok);
                                                    setVerificado(true);
                                                    // aplica sinal nos pontos atuais
                                                    const dicasCount = estado.dicasAbertas.filter(Boolean).length;
                                                    const base = pontuacao.baseAcerto + dicasCount * pontuacao.pontosPorDica;
                                                    setPontosAtuais(ok ? base : -base);
                                                }}
                                            >
                                                ✅ Selecionar
                                            </button>
                                        </div>
                                    </div>
                                    {estado.dicasAbertas[idx] && (
                                        <div className="def-dica">Dica: {d.dica}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <HostControls onReset={() => {
                        const novo: PalavraEstado = { ...estado, dicasAbertas: palavra.definicoes.map(() => false), respostaSelecionada: undefined, extras: 0, lido: false, pontuacaoSalva: false };
                        onUpdateEstado(novo);
                        setPontosAtuais(pontuacao.baseAcerto);
                        setVerificado(false);
                        setAcertou(null);
                    }} onSave={handleSave} canSave={canSave} />
                </div>
            </div>
        </div>
    );
};

