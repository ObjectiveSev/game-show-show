import React from 'react';
import './Counter.css';

interface CounterProps {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    disabled?: boolean;
}

export const Counter: React.FC<CounterProps> = ({
    label,
    value,
    onIncrement,
    onDecrement,
    disabled = false
}) => {
    return (
        <div className="erros-info extras-stepper">
            <span className="label">{label}</span>
            <div className="extras-box">
                {!disabled && (
                    <div className="extras-buttons">
                        <button
                            className="extras-btn"
                            onClick={onIncrement}
                        >▲</button>
                        <button
                            className="extras-btn"
                            onClick={onDecrement}
                        >▼</button>
                    </div>
                )}
                <div className="extras-value">{value}</div>
            </div>
        </div>
    );
};
