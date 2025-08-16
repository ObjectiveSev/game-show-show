import React from 'react';

interface VerdadeButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export const VerdadeButton: React.FC<VerdadeButtonProps> = ({ onClick, disabled = false }) => {
    return (
        <button
            className="palpite-btn"
            onClick={onClick}
            disabled={disabled}
        >
            ✅ Verdade
        </button>
    );
}; 