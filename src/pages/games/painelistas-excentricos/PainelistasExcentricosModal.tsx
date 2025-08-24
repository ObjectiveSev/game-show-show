import React, { useState, useEffect } from 'react';
import type { FatoPainelista } from '../../../types/painelistas';
import { BaseModal } from '../../../components/base-modal/BaseModal';
import { VerdadeButton } from '../../../components/verdade-button/VerdadeButton';
import { MentiraButton } from '../../../components/mentira-button/MentiraButton';
import { ResultadoStatus } from '../../../components/resultado-status/ResultadoStatus';
import { Button } from '../../../components/button/Button';
import { ButtonType } from '../../../types';
import { soundManager } from '../../../utils/soundManager';
import './PainelistasExcentricosModal.css';

interface PainelistasExcentricosModalProps {
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
    scoreEntry?: {
        acertou: boolean;
        pontos: number;
    };
}

export const PainelistasExcentricosModal: React.FC<PainelistasExcentricosModalProps> = ({
    isOpen,
    onClose,
    fato,
    participanteNome,
    timeAdversario,
    onSavePoints,
    onReset,
    estadoFato,
    scoreEntry
}) => {
    const [palpite, setPalpite] = useState<'verdade' | 'mentira' | null>(null);
    const [resultado, setResultado] = useState<'acerto' | 'erro' | null>(null);
    const [pontosCalculados, setPontosCalculados] = useState<number>(0);

    useEffect(() => {
        if (isOpen) {
            if (estadoFato?.verificado && scoreEntry) {
                // Fato já verificado - carregar estado salvo do score
                const acertou = scoreEntry.acertou;
                setPalpite(acertou ? 'verdade' : 'mentira');
                setResultado(acertou ? 'acerto' : 'erro');
                setPontosCalculados(scoreEntry.pontos);
            } else {
                // Novo fato - resetar estados
                setPalpite(null);
                setResultado(null);
                setPontosCalculados(0);
            }
        }
    }, [isOpen, estadoFato, scoreEntry]);

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
        // Resetar estados locais sem fechar o modal
        setPalpite(null);
        setResultado(null);
        setPontosCalculados(0);
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

            {estadoFato?.verificado && scoreEntry && (
                <div className="fato-verificado-info">
                    <p className="status-info">
                        ✅ Este fato já foi verificado
                    </p>
                    <p className="resultado-info">
                        {scoreEntry.acertou ? '🎯 Acertou!' : '❌ Errou!'} - 
                        {scoreEntry.pontos > 0 ? ` +${scoreEntry.pontos} pontos` : ' 0 pontos'}
                    </p>
                </div>
            )}

            <div className="modal-actions">
                {resultado && !estadoFato?.verificado && (
                    <>
                        <Button
                            type={ButtonType.RESET}
                            onClick={handleReset}
                        />
                        <Button
                            type={ButtonType.SAVE}
                            onClick={handleSalvar}
                        />
                    </>
                )}
                
                {estadoFato?.verificado && (
                    <Button
                        type={ButtonType.RESET}
                        onClick={handleReset}
                        text="Resetar Fato"
                    />
                )}
            </div>
        </BaseModal>
    );
}; 