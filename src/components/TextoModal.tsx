import React, { useState, useEffect } from 'react';
import type { VerdadeAbsurda, TextoEstado } from '../types/verdadesAbsurdas';
import type { Team } from '../types';
import { extrairTextoVerdade, encontrarIndiceVerdade } from '../utils/verdadesAbsurdasLoader';
import '../styles/TextoModal.css';

interface TextoModalProps {
    isOpen: boolean;
    onClose: () => void;
    texto: VerdadeAbsurda | null;
    estado: TextoEstado | null;
    onUpdateEstado: (estado: TextoEstado) => void;
    onSalvarPontuacao: (timeLeitor: 'A' | 'B') => void;
    teams: { teamA: Team; teamB: Team };
}

export const TextoModal: React.FC<TextoModalProps> = ({
    isOpen,
    onClose,
    texto,
    estado,
    onUpdateEstado,
    onSalvarPontuacao,
    teams
}) => {
    const [textoRenderizado, setTextoRenderizado] = useState<string>('');
    const [erros, setErros] = useState(0);
    const [verdadesReveladas, setVerdadesReveladas] = useState(false);
    const [timeSelecionado, setTimeSelecionado] = useState<string>('');





    // Renderizar texto com verdades marcadas
    useEffect(() => {
        if (!texto || !estado) return;

        let textoComMarcacoes = texto.texto;
        const verdadesEncontradas = estado.verdadesEncontradas;
        const verdades = texto.verdades;

        // Marcar verdades encontradas em verde
        verdadesEncontradas.forEach(indiceVerdade => {
            const verdade = verdades[indiceVerdade];
            const textoVerdade = extrairTextoVerdade(texto.texto, verdade);
            const regex = new RegExp(`(${textoVerdade.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
            textoComMarcacoes = textoComMarcacoes.replace(regex, '<span class="verdade-encontrada">$1</span>');
        });

        // Marcar verdades não encontradas em vermelho (quando reveladas)
        if (verdadesReveladas) {
            verdades.forEach((verdade, indice) => {
                if (!verdadesEncontradas.includes(indice)) {
                    const textoVerdade = extrairTextoVerdade(texto.texto, verdade);
                    const regex = new RegExp(`(${textoVerdade.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
                    textoComMarcacoes = textoComMarcacoes.replace(regex, '<span class="verdade-nao-encontrada">$1</span>');
                }
            });
        }

        setTextoRenderizado(textoComMarcacoes);
        setErros(estado.erros);
        setVerdadesReveladas(estado.verdadesReveladas);
    }, [texto, estado, verdadesReveladas]);

    const handleTextoClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!texto || !estado) return;

        const target = event.target as HTMLElement;
        if (target.tagName === 'SPAN') return; // Não processar cliques em spans já marcados

        // Usar caretRangeFromPoint para pegar a posição exata do clique
        const range = document.caretRangeFromPoint(event.clientX, event.clientY);
        if (!range) return;

        // Calcular a posição total somando os offsets dos nós anteriores
        let posicao = 0;
        const walker = document.createTreeWalker(
            event.currentTarget,
            NodeFilter.SHOW_TEXT,
            null
        );

        let node = walker.nextNode();
        while (node && node !== range.startContainer) {
            posicao += (node.textContent || '').length;
            node = walker.nextNode();
        }

        // Adicionar o offset dentro do nó atual
        posicao += range.startOffset;

        // Verificar se clicou em uma verdade
        const indiceVerdade = encontrarIndiceVerdade(posicao, texto.verdades);

        if (indiceVerdade !== -1) {
            // Clicou em uma verdade
            const verdadesEncontradas = [...estado.verdadesEncontradas];
            if (!verdadesEncontradas.includes(indiceVerdade)) {
                verdadesEncontradas.push(indiceVerdade);
                verdadesEncontradas.sort((a, b) => a - b);

                const novoEstado: TextoEstado = {
                    ...estado,
                    verdadesEncontradas
                };

                onUpdateEstado(novoEstado);
            }
        }
    };

    const handleRevelarVerdades = () => {
        if (!estado) return;

        const novoEstado: TextoEstado = {
            ...estado,
            verdadesReveladas: true
        };

        onUpdateEstado(novoEstado);
    };

    const handleAdicionarErro = () => {
        if (!estado) return;

        const novoEstado: TextoEstado = {
            ...estado,
            erros: estado.erros + 1
        };

        onUpdateEstado(novoEstado);
    };



    const handleResetarPontuacao = () => {
        if (!estado) return;

        const novoEstado: TextoEstado = {
            ...estado,
            verdadesEncontradas: [],
            erros: 0,
            verdadesReveladas: false
        };

        onUpdateEstado(novoEstado);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !texto || !estado) return null;

    const verdadesEncontradas = estado.verdadesEncontradas.length;
    const totalVerdades = texto.verdades.length;

    return (
        <div className="texto-modal-overlay" onClick={handleOverlayClick}>
            <div className="texto-modal">
                <div className="modal-header">
                    <h2>{texto.titulo}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    <div className="texto-container">
                        <div
                            className="texto-completo"
                            onClick={handleTextoClick}
                            dangerouslySetInnerHTML={{ __html: textoRenderizado }}
                        />
                    </div>

                    <div className="controles-host">
                        <div className="status-info">
                            <div className="team-selector">
                                <span className="label">Time leitor:</span>
                                <select
                                    className="team-dropdown"
                                    value={timeSelecionado}
                                    onChange={(e) => setTimeSelecionado(e.target.value)}
                                >
                                    <option value="">Selecionar o time</option>
                                    <option value="A">{teams.teamA?.name || 'Time A'}</option>
                                    <option value="B">{teams.teamB?.name || 'Time B'}</option>
                                </select>
                            </div>
                            <div className="verdades-info">
                                <span className="label">Verdades encontradas:</span>
                                <span className="valor">{verdadesEncontradas}/{totalVerdades}</span>
                            </div>
                            <div className="erros-info">
                                <span className="label">Erros:</span>
                                <span className="valor">{erros}</span>
                            </div>
                        </div>

                        <div className="botoes-controle">
                            <button
                                className="btn-erro"
                                onClick={handleAdicionarErro}
                            >
                                ❌ +1 Erro
                            </button>

                            <button
                                className="btn-resetar"
                                onClick={handleResetarPontuacao}
                            >
                                🔄 Resetar Pontuação
                            </button>

                            <button
                                className="btn-revelar"
                                onClick={handleRevelarVerdades}
                                disabled={verdadesReveladas}
                            >
                                🔍 Revelar Verdades
                            </button>

                            <button
                                className="btn-salvar"
                                onClick={() => {
                                    if (!estado || !timeSelecionado) return;
                                    onSalvarPontuacao(timeSelecionado as 'A' | 'B');
                                }}
                                disabled={!timeSelecionado || !!estado.pontuacaoSalva}
                            >
                                {estado.pontuacaoSalva ? '✅ Pontuação Salva' : '💾 Salvar Pontuação'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 