import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

interface BackButtonProps {
    to?: string;
    text?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
    to = '/',
    text = '← Voltar ao Dashboard'
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        setTimeout(() => navigate(to), 0);
    };

    return (
        <button className="back-button" onClick={handleClick}>
            {text}
        </button>
    );
}; 