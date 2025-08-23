import React from 'react';
import { TagType, ButtonType } from '../../types';
import { Tag } from '../Tag/Tag';
import { Button } from '../Button/Button';
import './DefaultCard.css';

interface DefaultCardProps {
    title: string;
    tags: TagType[];
    body?: string;
    children?: React.ReactNode;
    button?: {
        type: ButtonType;
        onClick: (e: React.MouseEvent) => void;
        disabled?: boolean;
        className?: string;
    };
    onClick?: () => void;
    className?: string;
}

export const DefaultCard: React.FC<DefaultCardProps> = ({
    title,
    tags,
    body,
    children,
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

            {children && (
                <div className="card-content">
                    {children}
                </div>
            )}

            {button && (
                <Button
                    type={button.type}
                    onClick={handleButtonClick}
                    disabled={button.disabled}
                    className={button.className}
                />
            )}
        </div>
    );
}; 