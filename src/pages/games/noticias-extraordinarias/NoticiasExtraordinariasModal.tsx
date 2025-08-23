import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../../components/base-modal/BaseModal';
import { TeamSelector } from '../../../components/team-selector/TeamSelector';
import { VerdadeButton } from '../../../components/verdade-button/VerdadeButton';
import { MentiraButton } from '../../../components/mentira-button/MentiraButton';
import { ResultadoStatus } from '../../../components/resultado-status/ResultadoStatus';
import type { Noticia, NoticiaEstado } from '../../../types/noticiasExtraordinarias';
import type { Team } from '../../../types';
import { soundManager } from '../../../utils/soundManager';
import './NoticiasExtraordinariasModal.css';

interface NoticiasExtraordinariasModalProps {
    isOpen: boolean;
    onClose: () => void;
    noticia: Noticia | null;
    estado: NoticiaEstado | null;
    teams: { teamA: Team; teamB: Team };
    pontuacao: { acerto: number; erro: number };
    onSalvar: (timeId: 'A' | 'B', pontos: number, novoEstado: NoticiaEstado) => void;
    onResetar: () => void;
}

export const NoticiasExtraordinariasModal: React.FC<NoticiasExtraordinariasModalProps> = ({
    isOpen,
    onClose,
    noticia,
    estado,
    teams,
    pontuacao,
    onSalvar,
    onResetar
}) => {
    const [timeSelecionado, setTimeSelecionado] = useState<'A' | 'B' | ''>('');
    const [palpite, setPalpite] = useState<boolean | null>(null);
    const [resultado, setResultado] = useState<'acerto' | 'erro' | null>(null);



    // Resetar estados quando modal abre
    useEffect(() => {
        if (isOpen && noticia && estado) {
            if (estado.lida) {
                // Notícia já foi lida - carregar estado salvo
                setTimeSelecionado(estado.timeAdivinhador || '');
                setPalpite(estado.respostaEscolhida || null);
                setResultado(estado.acertou ? 'acerto' : 'erro');
            } else {
                // Nova notícia - resetar estados
                setTimeSelecionado('');
                setPalpite(null);
                setResultado(null);
            }
        }
    }, [isOpen, noticia, estado]);

    const handlePalpite = (respostaEscolhida: boolean) => {
        if (!noticia) return;

        setPalpite(respostaEscolhida);
        const acertou = respostaEscolhida === noticia.resposta;
        setResultado(acertou ? 'acerto' : 'erro');

        // Tocar som apropriado
        if (acertou) {
            soundManager.playSuccessSound();
        } else {
            soundManager.playErrorSound();
        }
    };

    const handleSalvarPontuacao = () => {
        if (!noticia || !estado || !timeSelecionado || resultado === null) return;

        const pontos = resultado === 'acerto' ? pontuacao.acerto : pontuacao.erro;

        const novoEstado: NoticiaEstado = {
            ...estado,
            lida: true,
            timeAdivinhador: timeSelecionado,
            respostaEscolhida: palpite!,
            acertou: resultado === 'acerto',
            pontuacaoSalva: true
        };

        onSalvar(timeSelecionado, pontos, novoEstado);
        onClose();
    };

    const handleResetar = () => {
        setPalpite(null);
        setResultado(null);
        setTimeSelecionado('');
        onResetar();
    };

    if (!noticia || !estado) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="📰 Notícia Extraordinária"
            size="large"
        >
            <div className="noticia-content">
                <div className="manchete">
                    <h3>{noticia.manchete}</h3>
                </div>

                <div className="subtitulo">
                    <p>{noticia.subtitulo}</p>
                </div>

                <div className="controles">
                    <TeamSelector
                        teams={teams}
                        value={timeSelecionado}
                        onChange={(value) => setTimeSelecionado(value)}
                        label="Time adivinhador:"
                    />

                    {!palpite && !resultado && (
                        <div className="palpite-buttons">
                            <VerdadeButton
                                onClick={() => handlePalpite(true)}
                                disabled={!timeSelecionado}
                            />
                            <MentiraButton
                                onClick={() => handlePalpite(false)}
                                disabled={!timeSelecionado}
                            />
                        </div>
                    )}

                    {resultado && (
                        <ResultadoStatus
                            resultado={resultado}
                            pontos={resultado === 'acerto' ? pontuacao.acerto : 0}
                            showPontuacao={false}
                        />
                    )}

                    <div className="modal-actions">
                        {resultado && (
                            <>
                                <button className="reset-btn" onClick={handleResetar}>
                                    🔄 Resetar
                                </button>
                                {!estado.pontuacaoSalva && (
                                    <button className="save-btn" onClick={handleSalvarPontuacao}>
                                        💾 Salvar Pontos
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}; 