import React, { useState } from 'react';
import { BaseModal } from './common/BaseModal';
import { TeamSelector } from './common/TeamSelector';
import { soundManager } from '../utils/soundManager';
import type { ItemCaroPraChuchu, PontuacaoConfig } from '../types/caroPraChuchu';
import type { Team } from '../types';
import '../styles/CaroPraChuchuModal.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: ItemCaroPraChuchu;
    pontuacao?: PontuacaoConfig;
    teams: { teamA: Team; teamB: Team };
    onSalvar: (timeId: 'A' | 'B', tipoAcerto: 'moedaCorreta' | 'pertoSuficiente' | 'acertoLendario' | 'erro') => void;
    onResetar: () => void;
}

export const CaroPraChuchuModal: React.FC<Props> = ({
    isOpen,
    onClose,
    item,
    pontuacao,
    teams,
    onSalvar,
    onResetar
}) => {
    const [timeSelecionado, setTimeSelecionado] = useState<'A' | 'B' | ''>('');
    const [tipoAcerto, setTipoAcerto] = useState<'moedaCorreta' | 'pertoSuficiente' | 'acertoLendario' | 'erro' | null>(null);
    const [precoRevelado, setPrecoRevelado] = useState(false);

    const handleAcerto = (tipo: 'moedaCorreta' | 'pertoSuficiente' | 'acertoLendario' | 'erro') => {
        setTipoAcerto(tipo);
        setPrecoRevelado(true);

        // Tocar som apropriado
        if (tipo === 'erro') {
            soundManager.playErrorSound();
        } else {
            soundManager.playSuccessSound();
        }
    };

    const handleSalvar = () => {
        if (timeSelecionado && tipoAcerto) {
            onSalvar(timeSelecionado, tipoAcerto);
        }
    };

    const handleResetar = () => {
        setTimeSelecionado('');
        setTipoAcerto(null);
        setPrecoRevelado(false);
        onResetar();
    };

    if (!isOpen) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="💰 Caro Pra Chuchu"
            size="large"
        >
            <div className="item-info">
                <div className="item-header">
                    <h2>{item.nome}</h2>
                    <div className="local-data">
                        <span className="local">{item.local}</span>
                        <span className="data">{item.data}</span>
                    </div>
                </div>

                <div className="item-image">
                    <img src={item.imagem} alt={item.nome} />
                </div>

                <div className="contexto">
                    <h3>📚 Contexto Histórico</h3>
                    <p>{item.contexto}</p>
                </div>

                {precoRevelado && (
                    <div className="preco-real">
                        <h3>💎 Preço Real</h3>
                        <div className="preco-valor">{item.precoReal}</div>
                    </div>
                )}

                <div className="controles">
                    <div className="time-selector">
                        <TeamSelector
                            teams={teams}
                            value={timeSelecionado}
                            onChange={(value) => setTimeSelecionado(value)}
                            label="Time adivinhador:"
                        />
                    </div>

                    {!tipoAcerto && (
                        <div className="acerto-buttons">
                            <h4>Selecione o tipo de acerto:</h4>
                            <div className="buttons-grid">
                                <button
                                    className="acerto-btn moeda-correta"
                                    onClick={() => handleAcerto('moedaCorreta')}
                                    disabled={!timeSelecionado}
                                >
                                    🪙 Acertou a moeda
                                    <span className="pontos">+{pontuacao?.moedaCorreta || 1} ponto</span>
                                </button>

                                <button
                                    className="acerto-btn perto-suficiente"
                                    onClick={() => handleAcerto('pertoSuficiente')}
                                    disabled={!timeSelecionado}
                                >
                                    🎯 Perto o suficiente
                                    <span className="pontos">+{pontuacao?.pertoSuficiente || 3} pontos</span>
                                </button>

                                <button
                                    className="acerto-btn acerto-lendario"
                                    onClick={() => handleAcerto('acertoLendario')}
                                    disabled={!timeSelecionado}
                                >
                                    ⭐ Acerto lendário
                                    <span className="pontos">+{pontuacao?.acertoLendario || 5} pontos</span>
                                </button>

                                <button
                                    className="acerto-btn erro"
                                    onClick={() => handleAcerto('erro')}
                                    disabled={!timeSelecionado}
                                >
                                    ❌ Errou
                                    <span className="pontos">0 pontos</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {tipoAcerto && (
                        <div className="resultado-section">
                            <h4>Resultado selecionado:</h4>
                            <div className={`resultado ${tipoAcerto}`}>
                                {tipoAcerto === 'moedaCorreta' && '🪙 Acertou a moeda'}
                                {tipoAcerto === 'pertoSuficiente' && '🎯 Perto o suficiente'}
                                {tipoAcerto === 'acertoLendario' && '⭐ Acerto lendário'}
                                {tipoAcerto === 'erro' && '❌ Errou'}
                            </div>
                            <div className="pontos-display">
                                +{pontuacao?.[tipoAcerto] || 0} pontos
                            </div>
                        </div>
                    )}

                    <div className="modal-actions">
                        {tipoAcerto && (
                            <>
                                <button className="reset-btn" onClick={handleResetar}>
                                    🔄 Resetar
                                </button>
                                <button className="save-btn" onClick={handleSalvar}>
                                    💾 Salvar Pontos
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}; 