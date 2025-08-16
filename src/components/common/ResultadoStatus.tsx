import React from 'react';

interface ResultadoStatusProps {
    resultado: 'acerto' | 'erro';
    pontos: number;
    showPontuacao?: boolean;
}

export const ResultadoStatus: React.FC<ResultadoStatusProps> = ({
    resultado,
    pontos,
    showPontuacao = true
}) => {
    return (
        <div className="resultado-section">
            <h4>Resultado:</h4>
            <div className={`resultado ${resultado}`}>
                {resultado === 'acerto' ? '🎉 Acertou!' : '😔 Errou!'}
            </div>

            {showPontuacao && (
                <div className="pontos-section">
                    <h4>Pontuação:</h4>
                    <div className="pontos-display">
                        {pontos > 0 ? `+${pontos} pontos` : `${pontos} pontos`}
                    </div>
                </div>
            )}
        </div>
    );
}; 