import React, { useState, useEffect } from 'react';
import { BaseModal } from './common/BaseModal';
import type { VerdadeAbsurda, TextoEstado } from '../types/verdadesAbsurdas';
import type { Team } from '../types';
import { ButtonType } from '../types';
import { extrairTextoVerdade, encontrarIndiceVerdade } from '../utils/verdadesAbsurdasLoader';
import { soundManager } from '../utils/soundManager';
import '../styles/TextoModal.css';
import { TeamSelector } from './common/TeamSelector';
import { Button } from './common/Button';

interface TextoModalProps {
    isOpen: boolean;
    onClose: () => void;
    texto: VerdadeAbsurda | null;
    estado: TextoEstado | null;
    onUpdateEstado: (estado: TextoEstado) => void;
    onSalvarPontuacao: (timeLeitor: 'A' | 'B') => void;
    onResetarPontuacao?: (textoId: string) => void; // Nova prop para resetar pontuação
    teams: { teamA: Team; teamB: Team };
}

export const TextoModal: React.FC<TextoModalProps> = ({
    isOpen,
    onClose,
    texto,
    estado,
    onUpdateEstado,
    onSalvarPontuacao,
    onResetarPontuacao,
    teams
}) => {
    const [textoRenderizado, setTextoRenderizado] = useState<string>('');
    const [erros, setErros] = useState(0);
    const [verdadesReveladas, setVerdadesReveladas] = useState(false);
    const [timeSelecionado, setTimeSelecionado] = useState<'A' | 'B' | ''>('');







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

        // Tocar som de erro
        soundManager.playErrorSound();

        const novoEstado: TextoEstado = {
            ...estado,
            erros: estado.erros + 1
        };

        onUpdateEstado(novoEstado);
    };



    const handleResetarPontuacao = () => {
        if (!estado || !texto) return;

        // Chamar função para remover pontuação do localStorage se existir
        if (onResetarPontuacao) {
            onResetarPontuacao(texto.id);
        }

        const novoEstado: TextoEstado = {
            ...estado,
            lido: false, // Marcar como não lido
            verdadesEncontradas: [], // Limpar verdades encontradas
            erros: 0, // Resetar erros
            verdadesReveladas: false, // Esconder verdades reveladas
            pontuacaoSalva: false // Permitir salvar novamente
        };

        onUpdateEstado(novoEstado);
    };



    if (!isOpen || !texto || !estado) return null;

    const verdadesEncontradas = estado.verdadesEncontradas.length;
    const totalVerdades = texto.verdades.length;

    // Verificar se o texto já foi lido e salvo
    const textoCompleto = estado.lido && estado.pontuacaoSalva;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={texto.titulo}
            size="large"
        >
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
                        <TeamSelector
                            teams={teams}
                            value={timeSelecionado}
                            onChange={(v: 'A' | 'B' | '') => setTimeSelecionado(v)}
                            label="Time leitor:"
                            disabled={textoCompleto}
                        />
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
                        <Button
                            type={ButtonType.ERROR}
                            onClick={handleAdicionarErro}
                            disabled={textoCompleto}
                        />
                        <Button
                            type={ButtonType.REVEAL_TRUTH}
                            onClick={handleRevelarVerdades}
                            disabled={verdadesReveladas || textoCompleto}
                        />
                        <Button
                            type={ButtonType.RESET}
                            onClick={handleResetarPontuacao}
                            disabled={textoCompleto}
                        />
                        <Button
                            type={ButtonType.SAVE}
                            onClick={() => {
                                if (!estado || !timeSelecionado) return;
                                onSalvarPontuacao(timeSelecionado as 'A' | 'B');
                            }}
                            disabled={!timeSelecionado || estado.pontuacaoSalva || textoCompleto}
                        />
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}; 