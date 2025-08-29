import React, { useEffect } from 'react';
import './BaseModal.css';
import { soundManager } from '../../utils/soundManager';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
}

export const BaseModal: React.FC<BaseModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium'
}) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                // Parar música antes de fechar
                soundManager.stopCurrentSound();
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            return () => document.removeEventListener('keydown', handleEsc);
        }
    }, [isOpen, onClose]);

    // Função para fechar modal com parada de música
    const handleClose = () => {
        // Parar música antes de fechar
        soundManager.stopCurrentSound();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="base-modal-overlay" onClick={handleClose}>
            <div
                className={`base-modal base-modal--${size}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="base-modal-header">
                    <h2>{title}</h2>
                    <button className="base-modal-close-button" onClick={handleClose}>×</button>
                </div>

                <div className="base-modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}; 