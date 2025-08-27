import React, { useState, useEffect } from 'react';
import { BackButton } from '../back-button/BackButton';
import { carregarGameInfo } from '../../utils/gameInfoLoader';
import './GameHeader.css';

interface GameHeaderProps {
    gameId: string;
    title?: string;
    subtitle?: string;
    emoji?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
    gameId,
    title,
    subtitle,
    emoji
}) => {
    const [gameInfo, setGameInfo] = useState<{
        name: string;
        emoji: string;
        description: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGameInfo = async () => {
            setLoading(true);
            const info = await carregarGameInfo(gameId);
            if (info) {
                setGameInfo({
                    name: info.name,
                    emoji: info.emoji,
                    description: info.description
                });
            }
            setLoading(false);
        };

        loadGameInfo();
    }, [gameId]);

    // Se props customizadas foram fornecidas, usar elas
    const displayTitle = title || gameInfo?.name || 'Carregando...';
    const displaySubtitle = subtitle || gameInfo?.description || '';
    const displayEmoji = emoji || gameInfo?.emoji || '';

    if (loading) {
        return (
            <div className="game-header">
                <BackButton />
                <div className="header-content">
                    <h1>Carregando...</h1>
                    <p>Carregando informações do jogo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="game-header">
            <BackButton />
            <div className="header-content">
                <h1>{displayEmoji && `${displayEmoji} `}{displayTitle}</h1>
                <p>{displaySubtitle}</p>
            </div>
        </div>
    );
};
