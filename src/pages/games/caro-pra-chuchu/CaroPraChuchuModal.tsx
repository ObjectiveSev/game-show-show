import React, { useState } from 'react';
import { BaseModal } from '../../../components/base-modal/BaseModal';
import { TeamSelector } from '../../../components/team-selector/TeamSelector';
import { soundManager } from '../../../utils/soundManager';
import { Button } from '../../../components/button/Button';
import { Tag } from '../../../components/tag/Tag';

import { ButtonType } from '../../../types';
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

    // Cores dos tipos de acerto
    const acertoColors = {
        moedaCorreta: '#6f42c1',      // Roxo
        pertoSuficiente: '#fd7e14',    // Laranja
        acertoLendario: '#e83e8c',     // Rosa
        erro: '#dc3545'                // Vermelho
    };


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
                    <div className="tags-container">
                        <Tag
                            customConfig={{
                                text: item.local,
                                backgroundColor: '#20c997',
                                textColor: 'white',
                                icon: '📍'
                            }}
                        />
                        <Tag
                            customConfig={{
                                text: item.data,
                                backgroundColor: '#868e96',
                                textColor: 'white',
                                icon: '📅'
                            }}
                        />
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
                    <div
                        className="preco-real"
                        style={{
                            backgroundColor: tipoAcerto ? acertoColors[tipoAcerto] : '#6c757d',
                            color: 'white',
                            padding: '20px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        <h3>💎 Preço Real</h3>
                        <div className="preco-valor">
                            {item.precoReal}
                        </div>
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
                            <Button
                                type={ButtonType.CUSTOM}
                                onClick={() => handleAcerto('moedaCorreta')}
                                disabled={!timeSelecionado}
                                customConfig={{
                                    text: 'Acertou a moeda +1 ponto',
                                    backgroundColor: '#6f42c1',
                                    textColor: 'white',
                                    hoverBackground: '#5a359b'
                                }}
                            />
                            <Button
                                type={ButtonType.CUSTOM}
                                onClick={() => handleAcerto('pertoSuficiente')}
                                disabled={!timeSelecionado}
                                customConfig={{
                                    text: 'Perto o suficiente +3 pontos',
                                    backgroundColor: '#fd7e14',
                                    textColor: 'white',
                                    hoverBackground: '#e8681a'
                                }}
                            />
                            <Button
                                type={ButtonType.CUSTOM}
                                onClick={() => handleAcerto('acertoLendario')}
                                disabled={!timeSelecionado}
                                customConfig={{
                                    text: 'Acerto lendário +5 pontos',
                                    backgroundColor: '#e83e8c',
                                    textColor: 'white',
                                    hoverBackground: '#d63384'
                                }}
                            />
                            <Button
                                type={ButtonType.CUSTOM}
                                onClick={() => handleAcerto('erro')}
                                disabled={!timeSelecionado}
                                customConfig={{
                                    text: 'Errou 0 pontos',
                                    backgroundColor: '#dc3545',
                                    textColor: 'white',
                                    hoverBackground: '#c82333'
                                }}
                            />
                        </div>
                    )}

                    <div className="modal-actions">
                        {tipoAcerto && (
                            <>
                                <Button
                                    type={ButtonType.RESET}
                                    onClick={handleResetar}
                                />
                                <Button
                                    type={ButtonType.SAVE}
                                    onClick={handleSalvar}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}; 