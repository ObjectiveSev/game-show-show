import React from 'react';
import { TagType } from '../../types';
import './Tag.css';

interface TagProps {
    type?: TagType;
    className?: string;
    customConfig?: {
        text: string;
        backgroundColor: string;
        textColor: string;
        icon: string;
    };
}

const TAG_CONFIGS = {
    [TagType.PENDING]: {
        text: 'Pendente',
        backgroundColor: '#ffc107',
        textColor: '#333',
        icon: '⏳'
    },
    [TagType.ERROR]: {
        text: 'Errou',
        backgroundColor: '#f8d7da',
        textColor: '#721c24',
        icon: '❌'
    },
    [TagType.READ]: {
        text: 'Lida',
        backgroundColor: '#87ceeb',
        textColor: 'white',
        icon: '📖'
    },
    [TagType.CORRECT]: {
        text: 'Acertou',
        backgroundColor: '#28a745',
        textColor: 'white',
        icon: '✅'
    },
    [TagType.MOEDA_CORRETA]: {
        text: 'Moeda Correta',
        backgroundColor: '#6f42c1',
        textColor: 'white',
        icon: '🪙'
    },
    [TagType.PERTO_SUFICIENTE]: {
        text: 'Perto Suficiente',
        backgroundColor: '#fd7e14',
        textColor: 'white',
        icon: '🎯'
    },
    [TagType.ACERTO_LENDARIO]: {
        text: 'Acerto Lendário',
        backgroundColor: '#e83e8c',
        textColor: 'white',
        icon: '⭐'
    },
    [TagType.ERRO]: {
        text: 'Errou',
        backgroundColor: '#dc3545',
        textColor: 'white',
        icon: '❌'
    }
};

export const Tag: React.FC<TagProps> = ({
    type,
    className = '',
    customConfig
}) => {
    let config;
    
    if (customConfig) {
        config = customConfig;
    } else if (type) {
        config = TAG_CONFIGS[type];
    } else {
        // Fallback para evitar erro
        config = TAG_CONFIGS[TagType.PENDING];
    }

    return (
        <span
            className={`tag ${className}`}
            style={{
                backgroundColor: config.backgroundColor,
                color: config.textColor
            }}
        >
            <span className="tag-icon">{config.icon}</span>
            <span className="tag-text">{config.text}</span>
        </span>
    );
}; 