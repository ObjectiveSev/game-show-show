import React from 'react';
import { BackButton } from '../back-button/BackButton';
import './GameHeader.css';

interface GameHeaderProps {
    title: string;
    subtitle: string;
    emoji?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
    title,
    subtitle,
    emoji
}) => {
    return (
        <div className="game-header">
            <BackButton />
            <div className="header-content">
                <h1>{emoji && `${emoji} `}{title}</h1>
                <p>{subtitle}</p>
            </div>
        </div>
    );
};
