import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../../components/base-modal/BaseModal';

import type { DicionarioPalavra, PalavraEstado } from '../../../types/dicionarioSurreal';
import type { Team } from '../../../types';
import { ButtonType } from '../../../types';
import { TeamSelector } from '../../../components/team-selector/TeamSelector';
import { Button } from '../../../components/button/Button';
import { Counter } from '../../../components/counter/Counter';
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
    const [resposta, setResposta] = useState<string | undefined>(undefined);
    const [dicasAbertasLocais, setDicasAbertasLocais] = useState<boolean[]>([]);

    // Reset states quando modal abre/fecha
    useEffect(() => {
        if (isOpen && palavra && estado) {
            if (estado.pontuacaoSalva) {
                // Se já foi salvo, sincronizar com o estado persistido
                setTime(estado.timeAdivinhador || '');
                setVerificado(true);
                setResposta(estado.respostaSelecionada);
                setDicasAbertasLocais(estado.dicasAbertas);
                if (estado.respostaSelecionada) {
                    setAcertou(estado.acertou ?? null);
                }
                // Manter pontos e outros dados do estado salvo
                const dicasCount = estado.dicasAbertas.filter(Boolean).length;
                const base = pontuacao.baseAcerto + dicasCount * pontuacao.pontosPorDica;
                const acertouResposta = estado.acertou ?? false;
                setPontosAtuais(acertouResposta ? base : -base);
            } else {
                // Se não foi salvo, resetar estados locais
                setTime('');
                setVerificado(false);
                setAcertou(null);
                setPontosAtuais(0);
                setResposta(undefined);
                setDicasAbertasLocais(palavra.definicoes.map(() => false));
            }
        }
    }, [isOpen, palavra, estado]);

    useEffect(() => {
        if (!palavra || !estado) return;

        // inicia pontos com base (extras são separados)
        const dicasAbertasCount = dicasAbertasLocais.filter(Boolean).length;
        const base = pontuacao.baseAcerto + dicasAbertasCount * pontuacao.pontosPorDica;
        if (verificado) {
            setPontosAtuais(acertou ? base : -base);
        } else {
            setPontosAtuais(base);
        }
    }, [palavra, estado, pontuacao, verificado, acertou, dicasAbertasLocais]);

    if (!isOpen || !palavra || !estado) return null;

    const toggleDica = (idx: number) => {
        if (!dicasAbertasLocais[idx]) {
            const novasDicas = [...dicasAbertasLocais];
            novasDicas[idx] = true;
            setDicasAbertasLocais(novasDicas);
            setPontosAtuais((p) => p + pontuacao.pontosPorDica);
        }
    };

    const handleSetResposta = (id: string) => {
        setResposta(id);
    };

    const setExtras = (val: number) => {
        onUpdateEstado({ ...estado, extras: val });
    };

    const canSave = !!time && !!resposta && !estado.pontuacaoSalva;

    const handleSave = () => {
        if (!canSave) return;
        const pontos = pontosAtuais + (estado.extras || 0);
        const novo: PalavraEstado = {
            ...estado,
            respostaSelecionada: resposta,
            dicasAbertas: dicasAbertasLocais,
            timeAdivinhador: time,
            acertou: resposta === palavra.definicaoCorretaId,
            lido: true,
            pontuacaoSalva: true
        };
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
                        <Counter
                            label="Extras:"
                            value={estado.extras || 0}
                            onIncrement={() => setExtras((estado.extras || 0) + 1)}
                            onDecrement={() => setExtras((estado.extras || 0) - 1)}
                            disabled={estado.pontuacaoSalva}
                        />
                    </div>
                </div>

                <div className="texto-container" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="texto-completo" style={{ cursor: 'default' }}>
                        {palavra.definicoes.map((d, idx) => (
                            <div
                                key={d.id}
                                className={`def-item ${resposta === d.id ? 'selected' : ''} ${verificado ? (d.id === palavra.definicaoCorretaId ? 'def-correct' : 'def-incorrect') : ''}`}
                                onClick={() => handleSetResposta(d.id)}
                            >
                                <div className="def-content">
                                    <div className="def-text">{d.texto}</div>
                                    {!estado.pontuacaoSalva && (
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Button
                                                type={ButtonType.HINT}
                                                text={dicasAbertasLocais[idx] ? 'Dica aberta' : 'Abrir Dica'}
                                                icon={dicasAbertasLocais[idx] ? '✅' : '💡'}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!dicasAbertasLocais[idx]) {
                                                        toggleDica(idx);
                                                    }
                                                }}
                                                disabled={dicasAbertasLocais[idx] || verificado}
                                            />
                                            <Button
                                                type={ButtonType.SELECT}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSetResposta(d.id);
                                                    const ok = d.id === palavra.definicaoCorretaId;
                                                    setAcertou(ok);
                                                    setVerificado(true);

                                                    // aplica sinal nos pontos atuais (com as dicas que estavam abertas)
                                                    const dicasCount = dicasAbertasLocais.filter(Boolean).length;
                                                    const base = pontuacao.baseAcerto + dicasCount * pontuacao.pontosPorDica;
                                                    setPontosAtuais(ok ? base : -base);
                                                    if (ok) {
                                                        soundManager.playSuccessSound();
                                                    } else {
                                                        soundManager.playErrorSound();
                                                    }
                                                }}
                                                disabled={verificado}
                                            />
                                        </div>
                                    )}
                                </div>
                                {dicasAbertasLocais[idx] && (
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

