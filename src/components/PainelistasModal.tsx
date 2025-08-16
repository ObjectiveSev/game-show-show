import React, { useState, useEffect } from 'react';
import type { FatoPainelista } from '../types/painelistas';
import { BaseModal } from './common/BaseModal';
import '../styles/PainelistasModal.css';

interface PainelistasModalProps {
    isOpen: boolean;
    onClose: () => void;
    fato: FatoPainelista | null;
    participanteNome: string;
    timeAdversario: 'A' | 'B';
    onSavePoints: (points: number) => void;
    onReset: () => void;
}

export const PainelistasModal: React.FC<PainelistasModalProps> = ({
    isOpen,
    onClose,
    fato,
    participanteNome,
    timeAdversario,
    onSavePoints,
    onReset
}) => {
    const [palpite, setPalpite] = useState<'verdade' | 'mentira' | null>(null);
    const [resultado, setResultado] = useState<'acerto' | 'erro' | null>(null);
    const [pontosCalculados, setPontosCalculados] = useState<number>(0);

    useEffect(() => {
        if (isOpen) {
            setPalpite(null);
            setResultado(null);
            setPontosCalculados(0);
        }
    }, [isOpen]);

    const handlePalpite = (tipo: 'verdade' | 'mentira') => {
        setPalpite(tipo);
        const acertou = tipo === (fato?.verdadeiro ? 'verdade' : 'mentira');
        setResultado(acertou ? 'acerto' : 'erro');

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

            {!palpite && (
                <div className="palpite-section">
                    <h4>Qual é o seu palpite?</h4>
                    <div className="palpite-buttons">
                        <button
                            className="palpite-btn"
                            onClick={() => handlePalpite('verdade')}
                        >
                            ✅ Verdade
                        </button>
                        <button
                            className="palpite-btn"
                            onClick={() => handlePalpite('mentira')}
                        >
                            ❌ Mentira
                        </button>
                    </div>
                </div>
            )}

            {resultado && (
                <div className="resultado-section">
                    <h4>Resultado:</h4>
                    <div className={`resultado ${resultado}`}>
                        {resultado === 'acerto' ? '🎉 Acertou!' : '😔 Errou!'}
                    </div>

                    <div className="pontos-section">
                        <h4>Pontuação:</h4>
                        <div className="pontos-display">
                            {pontosCalculados > 0 ? `+${pontosCalculados} pontos` : `${pontosCalculados} pontos`}
                        </div>
                    </div>
                </div>
            )}

            <div className="modal-actions">
                {resultado && (
                    <>
                        <button className="reset-btn" onClick={handleReset}>
                            🔄 Resetar
                        </button>
                        <button className="save-btn" onClick={handleSalvar}>
                            💾 Salvar Pontos
                        </button>
                    </>
                )}
            </div>
        </BaseModal>
    );
}; 