import React, { useState, useCallback } from 'react';
import { BaseModal } from '../../../components/BaseModal/BaseModal';
import { TeamSelector } from '../../../components/TeamSelector/TeamSelector';
import type { OvoOuGalinhaTrio, OvoOuGalinhaEvent } from '../../../types/ovoOuGalinha';
import type { AppState } from '../../../types';


interface OvoOuGalinhaModalProps {
    isOpen: boolean;
    onClose: () => void;
    trio: OvoOuGalinhaTrio;
    onConfirm: (trioId: number, timeSelecionado: string, acertou: boolean) => void;
    gameState: AppState;
    estadoAtual?: { acertou: boolean; timeAdivinhador: string };
}

export const OvoOuGalinhaModal: React.FC<OvoOuGalinhaModalProps> = ({
    isOpen,
    onClose,
    trio,
    onConfirm,
    gameState,
    estadoAtual
}) => {
    const [timeSelecionado, setTimeSelecionado] = useState<string>('');
    const [eventosOrdenados, setEventosOrdenados] = useState<OvoOuGalinhaEvent[]>([]);
    const [mostrarResultado, setMostrarResultado] = useState(false);
    const [acertou, setAcertou] = useState(false);
    const [pontuacaoSalva, setPontuacaoSalva] = useState(false);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dropIndex, setDropIndex] = useState<number | null>(null);

    // Inicializar eventos ordenados quando o modal abre
    React.useEffect(() => {
        if (isOpen && trio) {
            setEventosOrdenados([...trio.events]);
            setMostrarResultado(false);
            setTimeSelecionado('');
            setPontuacaoSalva(false);
        }
    }, [isOpen, trio]);

    // Verificar se o trio já foi respondido
    React.useEffect(() => {
        if (isOpen && trio && estadoAtual) {
            // Se o trio já foi respondido, mostrar o resultado
            setTimeSelecionado(estadoAtual.timeAdivinhador);
            setAcertou(estadoAtual.acertou);
            setMostrarResultado(true);
            setPontuacaoSalva(true);
        }
    }, [isOpen, trio, estadoAtual]);

    const handleDragStart = useCallback((index: number) => {
        setDragIndex(index);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDropIndex(index);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === dropIndex) return;

        const newEventos = [...eventosOrdenados];
        const [draggedItem] = newEventos.splice(dragIndex, 1);
        newEventos.splice(dropIndex, 0, draggedItem);

        setEventosOrdenados(newEventos);
        setDragIndex(null);
        setDropIndex(null);
    }, [eventosOrdenados, dragIndex]);

    const handleConfirmar = useCallback(() => {
        if (!timeSelecionado) return;

        try {
            // Verificar se a ordem está correta
            const ordemCorreta = trio.ordem;
            const ordemAtual = eventosOrdenados.map(evento => evento.id);

            const acertou = ordemAtual.every((id, index) => id === ordemCorreta[index]);
            setAcertou(acertou);
            setMostrarResultado(true);
        } catch (error) {
            console.error('Erro ao confirmar:', error);
        }
    }, [timeSelecionado, eventosOrdenados, trio]);

    const handleResetar = useCallback(() => {
        setEventosOrdenados([...trio.events]);
        setMostrarResultado(false);
        setTimeSelecionado('');
        setAcertou(false);
        setPontuacaoSalva(false);
    }, [trio]);

    const handleSalvarPontuacao = useCallback(() => {
        try {
            onConfirm(trio.id, timeSelecionado, acertou);
            setPontuacaoSalva(true);
            // Fechar o modal após salvar
            setTimeout(() => {
                onClose();
            }, 500);
        } catch (error) {
            console.error('Erro ao salvar pontuação:', error);
        }
    }, [trio.id, timeSelecionado, acertou, onConfirm, onClose]);

    const getEventoStyle = (index: number) => {
        let style: React.CSSProperties = {
            cursor: 'grab',
            transition: 'all 0.2s ease'
        };

        if (dragIndex === index) {
            style.opacity = 0.5;
            style.transform = 'scale(0.95)';
        }

        if (dropIndex === index && dragIndex !== null) {
            style.borderColor = '#4f46e5';
            style.backgroundColor = '#f3f4f6';
        }

        return style;
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Trio #${trio.id}`}
        >
            <div className="modal-content">

                <div className="eventos-container">
                    {eventosOrdenados.map((evento, index) => {
                        const ordemCorreta = trio.ordem;
                        const posicaoCorreta = ordemCorreta[index];
                        const posicaoAtual = evento.id;
                        const acertouPosicao = posicaoCorreta === posicaoAtual;

                        return (
                            <div
                                key={evento.id}
                                className={`evento-item ${dragIndex === index ? 'dragging' : ''} ${mostrarResultado ? (acertouPosicao ? 'acerto' : 'erro') : ''
                                    }`}
                                draggable={!mostrarResultado}
                                onDragStart={() => !mostrarResultado && handleDragStart(index)}
                                onDragOver={(e) => !mostrarResultado && handleDragOver(e, index)}
                                onDrop={(e) => !mostrarResultado && handleDrop(e, index)}
                                style={getEventoStyle(index)}
                            >
                                <div className="evento-texto">{evento.text}</div>
                                {mostrarResultado && (
                                    <div className="evento-ano">{evento.year}</div>
                                )}
                            </div>
                        );
                    })}
                </div>



                <div className="modal-actions">
                    <TeamSelector
                        teams={gameState.teams}
                        value={timeSelecionado as 'A' | 'B' | ''}
                        onChange={(val: string) => setTimeSelecionado(val)}
                        label="Time que vai responder:"
                    />

                    <div className="botoes-container">
                        <button
                            className="btn-resetar"
                            onClick={handleResetar}
                            disabled={pontuacaoSalva}
                        >
                            🔄 Resetar
                        </button>

                        {!mostrarResultado ? (
                            <button
                                className="btn-confirmar"
                                onClick={handleConfirmar}
                                disabled={!timeSelecionado}
                            >
                                ✅ Confirmar
                            </button>
                        ) : (
                            <button
                                className="btn-salvar"
                                onClick={handleSalvarPontuacao}
                                disabled={pontuacaoSalva}
                            >
                                💾 Salvar Pontuação
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}; 