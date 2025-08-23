import React, { useState, useEffect, useCallback } from 'react';
import { carregarParticipantes } from '../../utils/participantesLoader';
import './TeamSettingsModal.css';
import type { Team } from '../../types';
import { TEAM_COLORS } from '../../constants';

interface TeamSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    teams: Team[];
    onUpdateTeams: (teams: Team[]) => void;
}

export const TeamSettingsModal: React.FC<TeamSettingsModalProps> = ({
    isOpen,
    onClose,
    teams,
    onUpdateTeams
}) => {
    const [localTeamA, setLocalTeamA] = useState<Team>(teams[0] || { id: 'A', name: 'Time A', captain: '', members: [], color: TEAM_COLORS.TEAM_A.color, gradient: TEAM_COLORS.TEAM_A.gradient, score: 0 });
    const [localTeamB, setLocalTeamB] = useState<Team>(teams[1] || { id: 'B', name: 'Time B', captain: '', members: [], color: TEAM_COLORS.TEAM_B.color, gradient: TEAM_COLORS.TEAM_B.gradient, score: 0 });
    const [pool, setPool] = useState<string[]>([]); // ids não alocados
    const [participantesMap, setParticipantesMap] = useState<Record<string, string>>({});
    const [participantesIds, setParticipantesIds] = useState<string[]>([]);

    // Sincronizar estado local com props quando elas mudarem
    useEffect(() => {
        if (teams.length >= 2) {
            setLocalTeamA(teams[0]);
            setLocalTeamB(teams[1]);
            // reconstruir pool a partir dos participantes carregados (depois do loader)
            setPool(prev => prev.filter(id => !teams[0].members.includes(id) && !teams[1].members.includes(id)));
        }
    }, [teams]);

    // carregar participantes (uma vez)
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const lista = await carregarParticipantes();
                if (!mounted) return;
                const map: Record<string, string> = {};
                lista.forEach(p => { map[p.id] = p.nome; });
                setParticipantesMap(map);
                setParticipantesIds(lista.map(p => p.id));
            } catch { /* ignore */ }
        })();
        return () => { mounted = false; };
    }, []);

    // Calcular pool sempre que os times mudarem
    useEffect(() => {
        const allIds = participantesIds.length ? participantesIds : Object.keys(participantesMap);
        const usados = new Set([
            ...localTeamA.members,
            ...localTeamB.members
        ]);
        const naoAlocados = allIds.filter(id => !usados.has(id));
        setPool(naoAlocados);
    }, [localTeamA.members, localTeamB.members, participantesIds, participantesMap]);

    const handleCancel = useCallback(() => {
        setLocalTeamA(teams[0]);
        setLocalTeamB(teams[1]);
        onClose();
    }, [teams, onClose]);

    // Fechar com ESC
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleCancel(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, handleCancel]);

    if (!isOpen) return null;

    const handleSave = async () => {
        // Aplicar todas as mudanças do estado local
        onUpdateTeams([localTeamA, localTeamB]);

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

    // drag & drop helpers
    const onDragStart = (e: React.DragEvent, id: string, from: 'pool' | 'A' | 'B') => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ id, from }));
    };

    const onDrop = (e: React.DragEvent, to: 'pool' | 'A' | 'B') => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        if (!data) return;
        const { id, from } = JSON.parse(data) as { id: string; from: 'pool' | 'A' | 'B' };
        if (from === to) return;

        // remover da origem
        if (from === 'pool') {
            setPool(prev => prev.filter(x => x !== id));
        }
        if (from === 'A') {
            setLocalTeamA(t => {
                const members = t.members.filter(x => x !== id);
                const captain = t.captain === id ? (members[0] || '') : t.captain;
                return { ...t, members, captain };
            });
        }
        if (from === 'B') {
            setLocalTeamB(t => {
                const members = t.members.filter(x => x !== id);
                const captain = t.captain === id ? (members[0] || '') : t.captain;
                return { ...t, members, captain };
            });
        }

        // adicionar no destino
        if (to === 'pool') {
            setPool(prev => (prev.includes(id) ? prev : [...prev, id]));
        }
        if (to === 'A') {
            setLocalTeamA(t => {
                const members = [...t.members, id];
                const captain = t.captain || members[0] || '';
                return { ...t, members, captain };
            });
        }
        if (to === 'B') {
            setLocalTeamB(t => {
                const members = [...t.members, id];
                const captain = t.captain || members[0] || '';
                return { ...t, members, captain };
            });
        }
    };
    const allowDrop = (e: React.DragEvent) => e.preventDefault();

    const handleResetTimes = () => {
        // todos para o pool e nomes vazios (não salvar automaticamente) [[memory:5416204]]
        const allIds = participantesIds.length ? participantesIds : Object.keys(participantesMap);
        setPool(allIds);
        setLocalTeamA(t => ({ ...t, name: '', captain: '', members: [] }));
        setLocalTeamB(t => ({ ...t, name: '', captain: '', members: [] }));
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
                    {/* Team columns side by side */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
                                    {localTeamA.members.map((memberId, index) => (
                                        <option key={index} value={memberId}>
                                            {participantesMap[memberId] || memberId}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="config-row">
                                <label>Membros (arraste da lista à esquerda):</label>
                                <div className="members-list droppable" onDragOver={allowDrop} onDrop={(e) => onDrop(e, 'A')}>
                                    {localTeamA.members.length === 0 ? (
                                        <div className="no-members">Arraste participantes para cá</div>
                                    ) : (
                                        localTeamA.members.map((id) => (
                                            <div key={id} className="member-item" draggable onDragStart={(e) => onDragStart(e, id, 'A')}>
                                                <span>{participantesMap[id] || id}</span>
                                                <button className="remove-member" onClick={() => setLocalTeamA(t => { const members = t.members.filter(x => x !== id); const captain = t.captain === id ? (members[0] || '') : t.captain; setPool(prev => prev.includes(id) ? prev : [...prev, id]); return { ...t, members, captain }; })}>×</button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
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
                                    {localTeamB.members.map((memberId, index) => (
                                        <option key={index} value={memberId}>
                                            {participantesMap[memberId] || memberId}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="config-row">
                                <label>Membros (arraste da lista à esquerda):</label>
                                <div className="members-list droppable" onDragOver={allowDrop} onDrop={(e) => onDrop(e, 'B')}>
                                    {localTeamB.members.length === 0 ? (
                                        <div className="no-members">Arraste participantes para cá</div>
                                    ) : (
                                        localTeamB.members.map((id) => (
                                            <div key={id} className="member-item" draggable onDragStart={(e) => onDragStart(e, id, 'B')}>
                                                <span>{participantesMap[id] || id}</span>
                                                <button className="remove-member" onClick={() => setLocalTeamB(t => { const members = t.members.filter(x => x !== id); const captain = t.captain === id ? (members[0] || '') : t.captain; setPool(prev => prev.includes(id) ? prev : [...prev, id]); return { ...t, members, captain }; })}>×</button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {pool.length > 0 && (
                        <div className="team-config">
                            <h3>Participantes</h3>
                            <div className="config-row">
                                <label>Não alocados (arraste para um time):</label>
                                <div className="members-list droppable" onDragOver={allowDrop} onDrop={(e) => onDrop(e, 'pool')}>
                                    {pool.map((id) => (
                                        <div key={id} className="member-item" draggable onDragStart={(e) => onDragStart(e, id, 'pool')}>
                                            <span>{participantesMap[id] || id}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="settings-actions">
                        <button className="btn-secondary" onClick={handleResetTimes}>
                            🧹 Resetar Times
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