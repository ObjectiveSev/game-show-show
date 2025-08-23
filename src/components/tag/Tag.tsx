import React from 'react';
import { TagType } from '../../types';
import './Tag.css';

interface TagProps {
    type: TagType;
    className?: string;
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
    }
};

export const Tag: React.FC<TagProps> = ({
    type,
    className = ''
}) => {
    const config = TAG_CONFIGS[type];

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