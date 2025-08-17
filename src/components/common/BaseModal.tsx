import React, { useEffect } from 'react';
import '../../styles/BaseModal.css';

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
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            return () => document.removeEventListener('keydown', handleEsc);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="base-modal-overlay" onClick={onClose}>
            <div
                className={`base-modal base-modal--${size}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="base-modal-header">
                    <h2>{title}</h2>
                    <button className="base-modal-close-button" onClick={onClose}>×</button>
                </div>

                <div className="base-modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}; 