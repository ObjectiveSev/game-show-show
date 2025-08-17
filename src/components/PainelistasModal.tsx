import React, { useState, useEffect } from 'react';
import type { FatoPainelista } from '../types/painelistas';
import { BaseModal } from './common/BaseModal';
import { VerdadeButton } from './common/VerdadeButton';
import { MentiraButton } from './common/MentiraButton';
import { ResultadoStatus } from './common/ResultadoStatus';
import { soundManager } from '../utils/soundManager';
import '../styles/PainelistasModal.css';

interface PainelistasModalProps {
    isOpen: boolean;
    onClose: () => void;
    fato: FatoPainelista | null;
    participanteNome: string;
    timeAdversario: 'A' | 'B';
    onSavePoints: (points: number) => void;
    onReset: () => void;
    estadoFato?: {
        verificado: boolean;
        acertou?: boolean;
        pontuacaoSalva?: boolean;
    };
}

export const PainelistasModal: React.FC<PainelistasModalProps> = ({
    isOpen,
    onClose,
    fato,
    participanteNome,
    timeAdversario,
    onSavePoints,
    onReset,
    estadoFato
}) => {
    const [palpite, setPalpite] = useState<'verdade' | 'mentira' | null>(null);
    const [resultado, setResultado] = useState<'acerto' | 'erro' | null>(null);
    const [pontosCalculados, setPontosCalculados] = useState<number>(0);

    useEffect(() => {
        if (isOpen) {
            if (estadoFato?.verificado && estadoFato.acertou !== undefined) {
                // Fato já verificado - carregar estado salvo
                setPalpite(estadoFato.acertou ? 'verdade' : 'mentira');
                setResultado(estadoFato.acertou ? 'acerto' : 'erro');
                setPontosCalculados(estadoFato.acertou ? 4 : 0);
            } else {
                // Novo fato - resetar estados
                setPalpite(null);
                setResultado(null);
                setPontosCalculados(0);
            }
        }
    }, [isOpen, estadoFato]);

    const handlePalpite = (tipo: 'verdade' | 'mentira') => {
        setPalpite(tipo);
        const acertou = tipo === (fato?.verdadeiro ? 'verdade' : 'mentira');
        setResultado(acertou ? 'acerto' : 'erro');

        // Tocar som apropriado
        if (acertou) {
            soundManager.playSuccessSound();
        } else {
            soundManager.playErrorSound();
        }

        // Calcular pontos baseado no resultado
        const pontos = acertou ? 4 : 0; // Pontos padrão, pode ser configurável
        setPontosCalculados(pontos);
    };

    const handleSalvar = () => {
        if (resultado !== null) {
            onSavePoints(pontosCalculados);
            onClose();
        }
    };

    const handleReset = () => {
        onReset();
        onClose();
    };

    if (!fato) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="🎭 Painelistas Excêntricos"
            size="medium"
        >
            <div className="fato-info">
                <h3>Participante: {participanteNome}</h3>
                <p className="fato-texto">{fato.texto}</p>
                <p className="time-adversario">Time {timeAdversario} deve adivinhar se é verdade ou mentira</p>
            </div>

            {!palpite && !estadoFato?.verificado && (
                <div className="palpite-section">
                    <h4>Qual é o seu palpite?</h4>
                    <div className="palpite-buttons">
                        <VerdadeButton onClick={() => handlePalpite('verdade')} />
                        <MentiraButton onClick={() => handlePalpite('mentira')} />
                    </div>
                </div>
            )}

            {resultado && (
                <ResultadoStatus
                    resultado={resultado}
                    pontos={pontosCalculados}
                />
            )}

            <div className="modal-actions">
                {resultado && (
                    <>
                        <button className="reset-btn" onClick={handleReset}>
                            🔄 Resetar
                        </button>
                        {!estadoFato?.pontuacaoSalva && (
                            <button className="save-btn" onClick={handleSalvar}>
                                💾 Salvar Pontos
                            </button>
                        )}
                    </>
                )}
            </div>
        </BaseModal>
    );
}; 