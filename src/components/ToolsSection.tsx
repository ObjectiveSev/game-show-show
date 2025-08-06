import React from 'react';

interface ToolsSectionProps {
    onOpenBuzzer: () => void;
    onResetScores: () => void;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({
    onOpenBuzzer,
    onResetScores
}) => {
    return (
        <div className="tools-section">
            <h3>🛠️ Ferramentas do Host</h3>
            <div className="tools-grid">
                <button className="tool-button" onClick={onOpenBuzzer}>
                    <span className="tool-icon">🔔</span>
                    <span>Sistema de Buzzer</span>
                </button>

                <button className="tool-button" onClick={onResetScores}>
                    <span className="tool-icon">🔄</span>
                    <span>Resetar Pontuação</span>
                </button>


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
                        <kbd>Ctrl + B</kbd>
                        <span>Abrir Buzzer</span>
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