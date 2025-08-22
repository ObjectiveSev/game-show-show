import React from 'react';
import { TagType } from '../../types';
import { Tag } from './Tag';
import '../../styles/DefaultCard.css';

interface DefaultCardProps {
    title: string;
    tags: TagType[];
    body?: string;
    button?: {
        text: string;
        icon: string;
        onClick: (e: React.MouseEvent) => void;
        className?: string;
    };
    onClick?: () => void;
    className?: string;
}

export const DefaultCard: React.FC<DefaultCardProps> = ({
    title,
    tags,
    body,
    button,
    onClick,
    className = ''
}) => {
    const handleCardClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (button?.onClick) {
            button.onClick(e);
        }
    };

    return (
        <div
            className={`default-card ${className}`}
            onClick={handleCardClick}
        >
            <div className="card-header">
                <h3>{title}</h3>
                <div className="tags-container">
                    {tags.map((tagType, index) => (
                        <Tag
                            key={index}
                            type={tagType}
                        />
                    ))}
                </div>
            </div>

            {body && (
                <div className="card-body">
                    <span>{body}</span>
                </div>
            )}

            {button && (
                <button
                    className={`card-button ${button.className || ''}`}
                    onClick={handleButtonClick}
                >
                    <span className="button-icon">{button.icon}</span>
                    <span className="button-text">{button.text}</span>
                </button>
            )}
        </div>
    );
}; 