import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../components/common/BackButton';
import { OvoOuGalinhaModal } from '../components/OvoOuGalinhaModal';
import { DefaultCard } from '../components/common/DefaultCard';
import { useGameState } from '../hooks/useGameState';
import { carregarOvoOuGalinha } from '../utils/ovoOuGalinhaLoader';
import type { OvoOuGalinhaTrio, OvoOuGalinhaConfig } from '../types/ovoOuGalinha';
import { TagType } from '../types';
import '../styles/OvoOuGalinha.css';
import '../styles/OvoOuGalinhaModal.css';

export const OvoOuGalinha: React.FC = () => {
    const navigate = useNavigate();
    const { gameState, syncPoints } = useGameState();
    const [config, setConfig] = useState<OvoOuGalinhaConfig | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [trioSelecionado, setTrioSelecionado] = useState<OvoOuGalinhaTrio | null>(null);
    const [triosCompletados, setTriosCompletados] = useState<number[]>([]);

    useEffect(() => {
        const carregarConfig = async () => {
            try {
                const configData = await carregarOvoOuGalinha();
                if (configData && configData.trios) {
                    setConfig(configData);
                }
            } catch (error) {
                console.error('Erro ao carregar configuração:', error);
            }
        };

        carregarConfig();
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (modalOpen) {
                    setModalOpen(false);
                    setTrioSelecionado(null);
                } else {
                    navigate('/');
                }
            }
        };

        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [modalOpen, navigate]);

    const handleTrioClick = (trio: OvoOuGalinhaTrio) => {
        try {
            if (triosCompletados.includes(trio.id)) return;

            setTrioSelecionado(trio);
            setModalOpen(true);
        } catch (error) {
            console.error('Erro ao abrir trio:', error);
        }
    };

    const handleConfirmar = (trioId: number, _timeSelecionado: string, acertou: boolean) => {
        try {
            if (acertou) {
                // Adicionar aos trios completados
                setTriosCompletados(prev => [...prev, trioId]);

                // Sincronizar pontos
                syncPoints();
            }
        } catch (error) {
            console.error('Erro ao confirmar trio:', error);
        }
    };

    if (!config) {
        return (
            <div className="ovo-ou-galinha-page">
                <div className="loading">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="ovo-ou-galinha-page">
            <div className="page-header">
                <BackButton />
                <div className="header-content">
                    <h1>🥚 O Ovo ou a Galinha</h1>
                    <p>Ordene os eventos históricos do mais antigo para o mais recente.</p>
                </div>
            </div>

            <div className="trios-grid">
                {config.trios.map((trio) => {
                    const completado = triosCompletados.includes(trio.id);

                    return (
                        <DefaultCard
                            key={trio.id}
                            title={`Trio #${trio.id}`}
                            tags={[completado ? TagType.CORRECT : TagType.PENDING]}
                            onClick={() => handleTrioClick(trio)}
                            className={completado ? 'completado' : ''}
                        />
                    );
                })}
            </div>

            {modalOpen && trioSelecionado && (
                <OvoOuGalinhaModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setTrioSelecionado(null);
                    }}
                    trio={trioSelecionado}
                    onConfirm={handleConfirmar}
                    gameState={gameState}
                />
            )}
        </div>
    );
}; 