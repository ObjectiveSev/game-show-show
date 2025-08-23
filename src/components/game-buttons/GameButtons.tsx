import React from 'react';

interface GameButtonsProps {
    onVerdade: () => void;
    onMentira: () => void;
    disabled?: boolean;
}

export const GameButtons: React.FC<GameButtonsProps> = ({ onVerdade, onMentira, disabled = false }) => {
    return (
        <div className="game-buttons">
            <button
                className="btn-verdade"
                disabled={disabled}
                onClick={onVerdade}
            >
                ✅ VERDADE
            </button>
            <button
                className="btn-mentira"
                disabled={disabled}
                onClick={onMentira}
            >
                ❌ MENTIRA
            </button>
        </div>
    );
}; 