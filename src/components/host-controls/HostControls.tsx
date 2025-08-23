import React from 'react';

interface HostControlsProps {
    onReset: () => void;
    onSave: () => void;
    canSave?: boolean;
    saveLabel?: string;
}

export const HostControls: React.FC<HostControlsProps> = ({ onReset, onSave, canSave = true, saveLabel = '💾 Salvar Pontuação' }) => {
    return (
        <div className="botoes-controle">
            <button className="btn-resetar" onClick={onReset}>🔄 Resetar Pontuação</button>
            <button className="btn-salvar" onClick={onSave} disabled={!canSave}>{saveLabel}</button>
        </div>
    );
};

