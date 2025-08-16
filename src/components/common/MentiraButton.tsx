import React from 'react';

interface MentiraButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export const MentiraButton: React.FC<MentiraButtonProps> = ({ onClick, disabled = false }) => {
    return (
        <button
            className="palpite-btn"
            onClick={onClick}
            disabled={disabled}
        >
            ❌ Mentira
        </button>
    );
}; 