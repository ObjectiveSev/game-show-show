import React, { useState } from 'react';
import { BaseModal } from '../../../components/base-modal/BaseModal';
import { TeamSelector } from '../../../components/team-selector/TeamSelector';
import { soundManager } from '../../../utils/soundManager';
import type { ItemCaroPraChuchu, PontuacaoConfig } from '../../../types/caroPraChuchu';
import type { Team } from '../../../types';
import './CaroPraChuchuModal.css';

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
                    <div className={`preco-real preco-${tipoAcerto}`}>
                        <h3>💎 Preço Real</h3>
                        <div className="preco-valor">{item.precoReal}</div>
                    </div>
                )}

                <div className="controles">
                    <TeamSelector
                        teams={teams}
                        value={timeSelecionado}
                        onChange={(value) => setTimeSelecionado(value)}
                        label="Time adivinhador:"
                    />

                    {!tipoAcerto && (
                        <div className="acerto-buttons">
                            <button
                                className="acerto-btn moeda-correta"
                                onClick={() => handleAcerto('moedaCorreta')}
                                disabled={!timeSelecionado}
                            >
                                Acertou a moeda<br />+1 ponto
                            </button>
                            <button
                                className="acerto-btn perto-suficiente"
                                onClick={() => handleAcerto('pertoSuficiente')}
                                disabled={!timeSelecionado}
                            >
                                Perto o suficiente<br />+3 pontos
                            </button>
                            <button
                                className="acerto-btn acerto-lendario"
                                onClick={() => handleAcerto('acertoLendario')}
                                disabled={!timeSelecionado}
                            >
                                Acerto lendário<br />+5 pontos
                            </button>
                            <button
                                className="acerto-btn erro"
                                onClick={() => handleAcerto('erro')}
                                disabled={!timeSelecionado}
                            >
                                Errou<br />0 pontos
                            </button>
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