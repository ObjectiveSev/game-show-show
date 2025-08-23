import React from 'react';
import { ButtonType } from '../../types';
import './Button.css';

interface ButtonProps {
    type: ButtonType;
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean;
    className?: string;
    text?: string; // Optional text to override default
    icon?: string; // Optional icon to override default
}

const BUTTON_CONFIGS = {
    [ButtonType.RESET]: {
        text: 'Resetar',
        icon: '🔄',
        backgroundColor: '#6c757d',
        textColor: 'white',
        hoverBackground: '#5a6268'
    },
    [ButtonType.ERROR]: {
        text: 'Erro',
        icon: '❌',
        backgroundColor: '#dc3545',
        textColor: 'white',
        hoverBackground: '#c82333'
    },
    [ButtonType.REVEAL_TRUTH]: {
        text: 'Revelar Verdade',
        icon: '🔍',
        backgroundColor: '#17a2b8',
        textColor: 'white',
        hoverBackground: '#138496'
    },
    [ButtonType.SAVE]: {
        text: 'Salvar',
        icon: '💾',
        backgroundColor: '#28a745',
        textColor: 'white',
        hoverBackground: '#218838'
    },
    [ButtonType.HINT]: {
        text: 'Abrir Dica',
        icon: '💡',
        backgroundColor: '#ffc107',
        textColor: '#333',
        hoverBackground: '#e0a800'
    },
    [ButtonType.SELECT]: {
        text: 'Selecionar',
        icon: '✅',
        backgroundColor: '#17a2b8',
        textColor: 'white',
        hoverBackground: '#138496'
    }
};

export const Button: React.FC<ButtonProps> = ({
    type,
    onClick,
    disabled = false,
    className = '',
    text,
    icon
}) => {
    const config = BUTTON_CONFIGS[type];
    const buttonText = text !== undefined ? text : config.text;
    const buttonIcon = icon !== undefined ? icon : config.icon;

    return (
        <button
            className={`custom-button ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={{
                backgroundColor: config.backgroundColor,
                color: config.textColor
            }}
        >
            <span className="button-icon">{buttonIcon}</span>
            <span className="button-text">{buttonText}</span>
        </button>
    );
}; 