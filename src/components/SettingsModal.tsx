import React, { useState, useEffect } from 'react';
import type { Team } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamA: Team;
    teamB: Team;
    onUpdateTeamConfig: (teamId: 'A' | 'B', team: Partial<Team>) => void;
    onSaveConfig: (customData?: any) => void;
    onReloadConfig: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    teamA,
    teamB,
    onUpdateTeamConfig,
    onSaveConfig,
    onReloadConfig
}) => {
    const [localTeamA, setLocalTeamA] = useState<Team>(teamA);
    const [localTeamB, setLocalTeamB] = useState<Team>(teamB);

    // Sincronizar estado local com props quando elas mudarem
    useEffect(() => {
        setLocalTeamA(teamA);
        setLocalTeamB(teamB);
    }, [teamA, teamB]);

    if (!isOpen) return null;

    const handleSave = async () => {
        // Aplicar todas as mudanças do estado local
        onUpdateTeamConfig('A', localTeamA);
        onUpdateTeamConfig('B', localTeamB);

        // Aguardar um tick para garantir que o estado foi atualizado
        await new Promise(resolve => setTimeout(resolve, 0));

        // Preparar dados para salvar
        const dataToSave = {
            teams: {
                teamA: {
                    id: localTeamA.id,
                    name: localTeamA.name,
                    captain: localTeamA.captain,
                    members: localTeamA.members
                },
                teamB: {
                    id: localTeamB.id,
                    name: localTeamB.name,
                    captain: localTeamB.captain,
                    members: localTeamB.members
                }
            }
        };

        await onSaveConfig(dataToSave);
        onClose();
    };



    // Atualizar apenas o estado local
    const handleTeamChange = (teamId: 'A' | 'B', updates: Partial<Team>) => {
        if (teamId === 'A') {
            const newTeamA = { ...localTeamA, ...updates };
            setLocalTeamA(newTeamA);
        } else {
            const newTeamB = { ...localTeamB, ...updates };
            setLocalTeamB(newTeamB);
        }
    };

    const handleCancel = () => {
        setLocalTeamA(teamA);
        setLocalTeamB(teamB);
        onClose();
    };



    const addMember = (teamId: 'A' | 'B') => {
        const newMember = prompt('Nome do novo membro:');
        if (newMember && newMember.trim()) {
            const currentMembers = teamId === 'A' ? localTeamA.members : localTeamB.members;
            const currentCaptain = teamId === 'A' ? localTeamA.captain : localTeamB.captain;
            const newMembers = [...currentMembers, newMember.trim()];

            // Se não há capitão, definir o primeiro membro como capitão
            let newCaptain = currentCaptain;
            if (!currentCaptain && newMembers.length === 1) {
                newCaptain = newMembers[0];
            }

            if (teamId === 'A') {
                const newTeamA = { ...localTeamA, members: newMembers, captain: newCaptain };
                setLocalTeamA(newTeamA);
            } else {
                const newTeamB = { ...localTeamB, members: newMembers, captain: newCaptain };
                setLocalTeamB(newTeamB);
            }


        }
    };

    const removeMember = (teamId: 'A' | 'B', index: number) => {
        const currentMembers = teamId === 'A' ? localTeamA.members : localTeamB.members;
        const currentCaptain = teamId === 'A' ? localTeamA.captain : localTeamB.captain;
        const newMembers = currentMembers.filter((_, i) => i !== index);

        // Se o capitão foi removido, definir o primeiro membro como capitão
        let newCaptain = currentCaptain;
        if (currentMembers[index] === currentCaptain && newMembers.length > 0) {
            newCaptain = newMembers[0];
        }

        if (teamId === 'A') {
            const newTeamA = { ...localTeamA, members: newMembers, captain: newCaptain };
            setLocalTeamA(newTeamA);
        } else {
            const newTeamB = { ...localTeamB, members: newMembers, captain: newCaptain };
            setLocalTeamB(newTeamB);
        }


    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };

    return (
        <div className="settings-modal-overlay" onClick={handleOverlayClick}>
            <div className="settings-modal">
                <div className="settings-header">
                    <h2>⚙️ Configurações do Jogo</h2>
                    <button className="close-button" onClick={handleCancel}>×</button>
                </div>

                <div className="settings-content">
                    {/* Team A Configuration */}
                    <div className="team-config">
                        <h3>Time A</h3>
                        <div className="config-row">
                            <label>Nome do Time:</label>
                            <input
                                type="text"
                                value={localTeamA.name}
                                placeholder="Digite o nome do Time A"
                                onChange={(e) => handleTeamChange('A', { name: e.target.value })}
                            />
                        </div>
                        <div className="config-row">
                            <label>Capitão:</label>
                            <select
                                value={localTeamA.captain}
                                onChange={(e) => handleTeamChange('A', { captain: e.target.value })}
                                disabled={localTeamA.members.length === 0}
                            >
                                <option value="">Selecione um capitão</option>
                                {localTeamA.members.map((member, index) => (
                                    <option key={index} value={member}>
                                        {member}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="config-row">
                            <label>Membros:</label>
                            <div className="members-list">
                                {localTeamA.members.length === 0 ? (
                                    <div className="no-members">Nenhum membro adicionado</div>
                                ) : (
                                    localTeamA.members.map((member, index) => (
                                        <div key={index} className="member-item">
                                            <span>{member}</span>
                                            <button
                                                className="remove-member"
                                                onClick={() => removeMember('A', index)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))
                                )}
                                <button className="add-member" onClick={() => addMember('A')}>
                                    + Adicionar Membro
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Team B Configuration */}
                    <div className="team-config">
                        <h3>Time B</h3>
                        <div className="config-row">
                            <label>Nome do Time:</label>
                            <input
                                type="text"
                                value={localTeamB.name}
                                placeholder="Digite o nome do Time B"
                                onChange={(e) => handleTeamChange('B', { name: e.target.value })}
                            />
                        </div>
                        <div className="config-row">
                            <label>Capitão:</label>
                            <select
                                value={localTeamB.captain}
                                onChange={(e) => handleTeamChange('B', { captain: e.target.value })}
                                disabled={localTeamB.members.length === 0}
                            >
                                <option value="">Selecione um capitão</option>
                                {localTeamB.members.map((member, index) => (
                                    <option key={index} value={member}>
                                        {member}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="config-row">
                            <label>Membros:</label>
                            <div className="members-list">
                                {localTeamB.members.length === 0 ? (
                                    <div className="no-members">Nenhum membro adicionado</div>
                                ) : (
                                    localTeamB.members.map((member, index) => (
                                        <div key={index} className="member-item">
                                            <span>{member}</span>
                                            <button
                                                className="remove-member"
                                                onClick={() => removeMember('B', index)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))
                                )}
                                <button className="add-member" onClick={() => addMember('B')}>
                                    + Adicionar Membro
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="settings-actions">
                        <button className="btn-secondary" onClick={onReloadConfig}>
                            🔄 Recarregar Configuração
                        </button>
                        <div className="action-buttons">
                            <button className="btn-cancel" onClick={handleCancel}>
                                Cancelar
                            </button>
                            <button className="btn-save" onClick={handleSave}>
                                💾 Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 