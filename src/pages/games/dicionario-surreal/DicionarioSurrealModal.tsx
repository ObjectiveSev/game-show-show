import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../../components/base-modal/BaseModal';

import type { DicionarioPalavra, PalavraEstado } from '../../../types/dicionarioSurreal';
import type { Team } from '../../../types';
import { ButtonType } from '../../../types';
import { TeamSelector } from '../../../components/team-selector/TeamSelector';
import { Button } from '../../../components/button/Button';
import { soundManager } from '../../../utils/soundManager';
import './DicionarioSurrealModal.css';

interface DicionarioSurrealModalProps {
    isOpen: boolean;
    onClose: () => void;
    palavra: DicionarioPalavra | null;
    estado: PalavraEstado | null;
    onUpdateEstado: (estado: PalavraEstado) => void;
    teams: { teamA: Team; teamB: Team };
    pontuacao: { baseAcerto: number; pontosPorDica: number };
    onSalvar: (time: 'A' | 'B', pontos: number, novoEstado: PalavraEstado) => void;
}

export const DicionarioSurrealModal: React.FC<DicionarioSurrealModalProps> = ({ isOpen, onClose, palavra, estado, onUpdateEstado, teams, pontuacao, onSalvar }) => {
    const [time, setTime] = useState<'' | 'A' | 'B'>('');
    const [pontosAtuais, setPontosAtuais] = useState(0);
    const [verificado, setVerificado] = useState(false);
    const [acertou, setAcertou] = useState<boolean | null>(null);

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

    const canSave = !!time && !!estado.respostaSelecionada && !estado.pontuacaoSalva;

    const handleSave = () => {
        if (!canSave) return;
        const pontos = pontosAtuais + (estado.extras || 0);
        const novo: PalavraEstado = { ...estado, lido: true, pontuacaoSalva: true };
        onSalvar(time, pontos, novo);
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={palavra.palavra}
            size="large"
        >
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
                                        <Button
                                            type={ButtonType.HINT}
                                            text={estado.dicasAbertas[idx] ? 'Dica aberta' : 'Abrir Dica'}
                                            icon={estado.dicasAbertas[idx] ? '✅' : '💡'}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!estado.dicasAbertas[idx]) {
                                                    toggleDica(idx);
                                                }
                                            }}
                                            disabled={estado.dicasAbertas[idx]}
                                        />
                                        <Button
                                            type={ButtonType.SELECT}
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
                                                if (ok) {
                                                    soundManager.playSuccessSound();
                                                } else {
                                                    soundManager.playErrorSound();
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                {estado.dicasAbertas[idx] && (
                                    <div className="dica">Dica: {d.dica}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="botoes-controle">
                    <Button
                        type={ButtonType.RESET}
                        onClick={() => {
                            const novo: PalavraEstado = { ...estado, dicasAbertas: palavra.definicoes.map(() => false), respostaSelecionada: undefined, extras: 0, lido: false, pontuacaoSalva: false };
                            onUpdateEstado(novo);
                            setPontosAtuais(pontuacao.baseAcerto);
                            setVerificado(false);
                            setAcertou(null);
                            setTime(''); // Resetar time adivinhador
                        }}
                        disabled={estado.lido}
                    />
                    <Button
                        type={ButtonType.SAVE}
                        onClick={handleSave}
                        disabled={!canSave}
                    />
                </div>
            </div>
        </BaseModal>
    );
};

