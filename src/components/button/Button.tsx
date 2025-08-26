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
    customConfig?: {
        text: string;
        backgroundColor: string;
        textColor?: string;
        hoverBackground?: string;
    };
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
        backgroundColor: '#ff6b6b',
        textColor: 'white',
        hoverBackground: '#ff5252'
    },
    [ButtonType.SUCCESS]: {
        text: 'Acerto',
        icon: '✅',
        backgroundColor: '#27ae60',
        textColor: 'white',
        hoverBackground: '#229954'
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
    },
    [ButtonType.SCOREBOARD]: {
        text: 'Abrir Scoreboard Detalhado',
        icon: '📊',
        backgroundColor: '#6f42c1',
        textColor: 'white',
        hoverBackground: '#5a359b'
    },
    [ButtonType.SETTINGS]: {
        text: 'Configuração de Times',
        icon: '⚙️',
        backgroundColor: '#28a745',
        textColor: 'white',
        hoverBackground: '#218838'
    },
    [ButtonType.CLEAR_STORAGE]: {
        text: 'Limpar LocalStorage',
        icon: '🗑️',
        backgroundColor: '#dc3545',
        textColor: 'white',
        hoverBackground: '#c82333'
    },
    [ButtonType.PUNICAO]: {
        text: 'Aplicar Punição',
        icon: '⚠️',
        backgroundColor: '#dc3545',
        textColor: 'white',
        hoverBackground: '#c82333'
    },
    [ButtonType.PLAY]: {
        text: 'Tocar Música',
        icon: '▶️',
        backgroundColor: '#87ceeb',
        textColor: 'white',
        hoverBackground: '#5f9ea0'
    },
    [ButtonType.STOP]: {
        text: 'Parar Música',
        icon: '⏹️',
        backgroundColor: '#1e3a8a',
        textColor: 'white',
        hoverBackground: '#1e40af'
    },
    [ButtonType.CUSTOM]: {
        text: 'Custom',
        icon: '🎯',
        backgroundColor: '#6c757d',
        textColor: 'white',
        hoverBackground: '#5a6268'
    }
};

export const Button: React.FC<ButtonProps> = ({
    type,
    onClick,
    disabled = false,
    className = '',
    text,
    icon,
    customConfig
}) => {
    const config = BUTTON_CONFIGS[type];
    
    let buttonText: string;
    let buttonIcon: string;
    let buttonStyle: React.CSSProperties = {};
    
    if (type === ButtonType.CUSTOM && customConfig) {
        buttonText = customConfig.text;
        buttonIcon = icon || '';
        buttonStyle = {
            backgroundColor: customConfig.backgroundColor,
            color: customConfig.textColor || 'white'
        };
        
        // Hover será tratado via CSS
    } else {
        buttonText = text !== undefined ? text : config.text;
        buttonIcon = icon !== undefined ? icon : config.icon;
        buttonStyle = {
            backgroundColor: config.backgroundColor,
            color: config.textColor
        };
    }

    return (
        <button
            className={type === ButtonType.CUSTOM ? className : `custom-button ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={buttonStyle}
        >
            {buttonIcon && <span className="button-icon">{buttonIcon}</span>}
            <span className="button-text">{buttonText}</span>
        </button>
    );
}; 