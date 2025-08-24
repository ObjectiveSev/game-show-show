import React, { useState, useEffect } from 'react';
import type { FatoPainelista } from '../../../types/painelistas';
import { BaseModal } from '../../../components/base-modal/BaseModal';
import { VerdadeButton } from '../../../components/verdade-button/VerdadeButton';
import { MentiraButton } from '../../../components/mentira-button/MentiraButton';
import { ResultadoStatus } from '../../../components/resultado-status/ResultadoStatus';
import { Button } from '../../../components/button/Button';
import { ButtonType } from '../../../types';
import { soundManager } from '../../../utils/soundManager';
import { loadPainelistasScores } from '../../../utils/scoreStorage';
import './PainelistasExcentricosModal.css';

interface PainelistasExcentricosModalProps {
    isOpen: boolean;
    onClose: () => void;
    fato: FatoPainelista | null;
    participanteNome: string;
    participanteId: string;
    timeAdversario: 'A' | 'B';
    onSavePoints: (points: number) => void;
    onReset: () => void;
    estadoFato?: {
        verificado: boolean;
        acertou?: boolean;
        pontuacaoSalva?: boolean;
    };
}

export const PainelistasExcentricosModal: React.FC<PainelistasExcentricosModalProps> = ({
    isOpen,
    onClose,
    fato,
    participanteNome,
    participanteId,
    timeAdversario,
    onSavePoints,
    onReset,
    estadoFato
}) => {
    const [palpite, setPalpite] = useState<'verdade' | 'mentira' | null>(null);
    const [resultado, setResultado] = useState<'acerto' | 'erro' | null>(null);
    const [pontosCalculados, setPontosCalculados] = useState<number>(0);

    useEffect(() => {
        if (isOpen && fato) {
            if (estadoFato?.verificado) {
                // Fato já verificado - buscar estado salvo do score
                const scores = loadPainelistasScores();
                const scoreEntry = scores.find(s =>
                    s.fatoId === fato.id && s.participanteId === participanteId
                );

                if (scoreEntry) {
                    const acertou = scoreEntry.acertou;
                    setPalpite(acertou ? 'verdade' : 'mentira');
                    setResultado(acertou ? 'acerto' : 'erro');
                    setPontosCalculados(scoreEntry.pontos);
                } else {
                    // Fallback caso não encontre o score
                    setPalpite(null);
                    setResultado(null);
                    setPontosCalculados(0);
                }
            } else {
                // Novo fato - resetar estados
                setPalpite(null);
                setResultado(null);
                setPontosCalculados(0);
            }
        }
    }, [isOpen, estadoFato, fato, participanteId]);

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


            </div>
        </BaseModal>
    );
}; 