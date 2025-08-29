import React, { useState } from 'react';
import { Button } from './button/Button';
import { ButtonType } from '../types';
import { getTeamNameFromString } from '../utils/teamUtils';
import type { Team } from '../types';
import { soundManager } from '../utils/soundManager';

interface ToolsSectionProps {
    onResetScores: () => void;
    onClearLocalStorage: () => void;
    onAddExtraPoints: (teamId: 'A' | 'B', points: number, razao?: string) => void;
    teamA: Team;
    teamB: Team;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({
    onResetScores,
    onClearLocalStorage,
    onAddExtraPoints,
    teamA,
    teamB
}) => {
    const [showRazaoModal, setShowRazaoModal] = useState(false);
    const [pontosPendentes, setPontosPendentes] = useState<{ teamId: 'A' | 'B'; points: number } | null>(null);
    const [razao, setRazao] = useState('');

    // Função para adicionar pontos com razão
    const handleAddExtraPoints = (teamId: 'A' | 'B', points: number) => {
        setPontosPendentes({ teamId, points });
        setRazao('');
        setShowRazaoModal(true);
    };

    // Função para confirmar pontos com razão
    const handleConfirmarPontos = () => {
        if (pontosPendentes) {
            // Tocar som baseado no tipo de ação
            if (pontosPendentes.points > 0) {
                soundManager.playSuccessSound();
            } else {
                soundManager.playErrorSound();
            }

            // Executar a ação com a razão
            onAddExtraPoints(pontosPendentes.teamId, pontosPendentes.points, razao.trim() || undefined);

            // Fechar modal e limpar estado
            setShowRazaoModal(false);
            setPontosPendentes(null);
            setRazao('');
        }
    };

    // Função para cancelar
    const handleCancelar = () => {
        setShowRazaoModal(false);
        setPontosPendentes(null);
        setRazao('');
    };

    return (
        <>
            <div className="tools-section">
                <h3>🛠️ Ferramentas do Host</h3>
                <div className="tools-grid">
                    <Button
                        type={ButtonType.RESET}
                        onClick={onResetScores}
                        text="Resetar Pontuação"
                    />

                    <Button
                        type={ButtonType.CLEAR_STORAGE}
                        onClick={onClearLocalStorage}
                    />
                </div>

                <div className="pontuacao-extra-section">
                    <h4>🎯 Pontuação Extra do Host</h4>
                    <div className="pontuacao-extra-grid">
                        <div className="pontuacao-row">
                            <Button
                                type={ButtonType.CUSTOM}
                                onClick={() => handleAddExtraPoints('A', 1)}
                                customConfig={{
                                    text: `+1 ${getTeamNameFromString('A', { teamA, teamB })}`,
                                    backgroundColor: teamA.color,
                                    hoverBackground: teamA.color,
                                    textColor: 'white'
                                }}
                            />
                            <Button
                                type={ButtonType.CUSTOM}
                                onClick={() => handleAddExtraPoints('A', -1)}
                                customConfig={{
                                    text: `-1 ${getTeamNameFromString('A', { teamA, teamB })}`,
                                    backgroundColor: teamA.color,
                                    hoverBackground: teamA.color,
                                    textColor: 'white'
                                }}
                            />
                        </div>

                        <div className="pontuacao-row">
                            <Button
                                type={ButtonType.CUSTOM}
                                onClick={() => handleAddExtraPoints('B', 1)}
                                customConfig={{
                                    text: `+1 ${getTeamNameFromString('B', { teamA, teamB })}`,
                                    backgroundColor: teamB.color,
                                    hoverBackground: teamB.color,
                                    textColor: 'white'
                                }}
                            />
                            <Button
                                type={ButtonType.CUSTOM}
                                onClick={() => handleAddExtraPoints('B', -1)}
                                customConfig={{
                                    text: `-1 ${getTeamNameFromString('B', { teamA, teamB })}`,
                                    backgroundColor: teamB.color,
                                    hoverBackground: teamB.color,
                                    textColor: 'white'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para pedir razão */}
            {showRazaoModal && (
                <div className="razao-modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="razao-modal" style={{
                        backgroundColor: '#2a2a2a',
                        borderRadius: '12px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}>
                        <h3 style={{ margin: '0 0 16px 0', color: 'white', textAlign: 'center' }}>
                            🎯 Adicionar Pontos Extras
                        </h3>
                        <p style={{ margin: '0 0 20px 0', color: '#ccc', textAlign: 'center' }}>
                            {pontosPendentes?.points && pontosPendentes.points > 0 ? '+' : ''}{pontosPendentes?.points || 0} ponto{(pontosPendentes?.points || 0) !== 1 ? 's' : ''} para{' '}
                            {getTeamNameFromString(pontosPendentes?.teamId || 'A', { teamA, teamB })}
                        </p>

                        <div className="razao-input-group" style={{ marginBottom: '24px' }}>
                            <label htmlFor="razao" style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: 'white',
                                fontWeight: 'bold'
                            }}>
                                Razão (opcional):
                            </label>
                            <input
                                id="razao"
                                type="text"
                                value={razao}
                                onChange={(e) => setRazao(e.target.value)}
                                placeholder="Ex: Comportamento exemplar, Resposta criativa..."
                                maxLength={100}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    border: '1px solid #444',
                                    backgroundColor: '#333',
                                    color: 'white',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div className="razao-modal-actions" style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'center'
                        }}>
                            <Button
                                type={ButtonType.RESET}
                                text="Cancelar"
                                onClick={handleCancelar}
                            />
                            <Button
                                type={ButtonType.SAVE}
                                text="Salvar"
                                onClick={handleConfirmarPontos}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}; 