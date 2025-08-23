import React from 'react';
import { Button } from './button/Button';
import { ButtonType } from '../types';

interface ToolsSectionProps {
    onResetScores: () => void;
    onClearLocalStorage: () => void;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({
    onResetScores,
    onClearLocalStorage
}) => {
    return (
        <div className="tools-section">
            <h3>🛠️ Ferramentas do Host</h3>
            <div className="tools-grid">
                <Button
                    type={ButtonType.RESET}
                    onClick={onResetScores}
                    text="Resetar Pontuação"
                />

                <Button
                    type={ButtonType.CLEAR_STORAGE}
                    onClick={onClearLocalStorage}
                />
            </div>

            <div className="shortcuts-info">
                <h4>⌨️ Atalhos de Teclado</h4>
                <div className="shortcuts-grid">
                    <div className="shortcut">
                        <kbd>Ctrl + 1</kbd>
                        <span>+1 ponto Time A</span>
                    </div>
                    <div className="shortcut">
                        <kbd>Ctrl + 2</kbd>
                        <span>+1 ponto Time B</span>
                    </div>
                    <div className="shortcut">
                        <kbd>Ctrl + Z</kbd>
                        <span>-1 ponto Time A</span>
                    </div>
                    <div className="shortcut">
                        <kbd>Ctrl + X</kbd>
                        <span>-1 ponto Time B</span>
                    </div>

                    <div className="shortcut">
                        <kbd>Ctrl + S</kbd>
                        <span>Abrir Scoreboard</span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 