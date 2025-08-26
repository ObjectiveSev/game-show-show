import React, { useState, useEffect } from 'react';
import { GameHeader } from '../../../components/game-header/GameHeader';
import { MaestroBillyModal } from './MaestroBillyModal';
import { DefaultCard } from '../../../components/default-card/DefaultCard';
import { carregarMaestroBilly } from '../../../utils/maestroBillyLoader';
import { saveMaestroBillyScore, removeMaestroBillyScore } from '../../../utils/scoreStorage';
import type { Musica, MusicaEstado, MaestroBillyConfig } from '../../../types/maestroBilly';
import type { Team } from '../../../types';
import { TagType } from '../../../types';
import { STORAGE_KEYS } from '../../../constants';
import { soundManager } from '../../../utils/soundManager';
import './MaestroBilly.css';

interface MaestroBillyProps {
    gameState: {
        teams: {
            teamA: Team;
            teamB: Team;
        };
        syncPoints: () => void;
    };
    addGamePoints: (gameId: string, teamId: 'A' | 'B', points: number) => void;
    addPoints: (teamId: 'A' | 'B', points: number) => void;
}

export const MaestroBilly: React.FC<MaestroBillyProps> = ({
    gameState,
    addGamePoints,
    addPoints
}) => {
    const [config, setConfig] = useState<MaestroBillyConfig | null>(null);
    const [estadosMusicas, setEstadosMusicas] = useState<MusicaEstado[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [musicaAtual, setMusicaAtual] = useState<Musica | null>(null);
    const [estadoAtual, setEstadoAtual] = useState<MusicaEstado | null>(null);

    // Carregar dados do jogo
    useEffect(() => {
        let isMounted = true;

        const carregarDados = async () => {
            try {
                const data = await carregarMaestroBilly();

                if (!isMounted) return;

                setConfig(data);

                // Inicializar estados das músicas
                const estadosIniciais: MusicaEstado[] = data.musicas.map(musica => ({
                    id: musica.id,
                    tentativas: 0,
                    acertouNome: false,
                    acertouArtista: false,
                    pontosNome: 0,
                    pontosArtista: 0,
                    lida: false
                }));

                // Tentar carregar estados salvos do localStorage
                try {
                    const salvo = localStorage.getItem(STORAGE_KEYS.MAESTRO_BILLY_ESTADOS);
                    if (salvo) {
                        const estadosSalvos: MusicaEstado[] = JSON.parse(salvo);
                        const mesclados = estadosIniciais.map((estado) => {
                            const encontrado = estadosSalvos.find(s => s.id === estado.id);
                            return encontrado ? { ...estado, ...encontrado } : estado;
                        });
                        setEstadosMusicas(mesclados);
                    } else {
                        setEstadosMusicas(estadosIniciais);
                    }
                } catch {
                    setEstadosMusicas(estadosIniciais);
                }

                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        carregarDados();

        return () => {
            isMounted = false;
        };
    }, []);

    // Salvar estados no localStorage quando mudarem
    useEffect(() => {
        if (estadosMusicas.length > 0) {
            localStorage.setItem(STORAGE_KEYS.MAESTRO_BILLY_ESTADOS, JSON.stringify(estadosMusicas));
        }
    }, [estadosMusicas]);

    const handleCardClick = (musica: Musica) => {
        const estado = estadosMusicas.find(e => e.id === musica.id);
        if (estado) {
            // Só tocar som se não foi lida antes
            if (!estado.lida) {
                soundManager.playGameSound('maestro-billy');
            }
            setMusicaAtual(musica);
            setEstadoAtual(estado);
            setModalAberto(true);
        }
    };

    const handleUpdateEstado = (novoEstado: MusicaEstado) => {
        setEstadosMusicas(prev =>
            prev.map(estado =>
                estado.id === novoEstado.id ? novoEstado : estado
            )
        );
        setEstadoAtual(novoEstado);
    };

    const handleSalvarPontuacao = (timeId: 'A' | 'B', pontosNome: number, pontosArtista: number, tentativa: number) => {
        if (!musicaAtual || !estadoAtual || !config) return;

        // Salvar score detalhado
        const scoreEntry = {
            musicaId: musicaAtual.id,
            nomeMusica: musicaAtual.nome,
            artista: musicaAtual.artista,
            arquivo: musicaAtual.arquivo,
            timeAdivinhador: timeId,
            tentativa,
            acertouNome: pontosNome > 0,
            acertouArtista: pontosArtista > 0,
            pontosNome,
            pontosArtista,
            totalPontos: pontosNome + pontosArtista,
            timestamp: Date.now()
        };

        saveMaestroBillyScore(scoreEntry);

        // Atualizar estado da música
        const novoEstado: MusicaEstado = {
            ...estadoAtual,
            lida: true,
            tentativas: tentativa,
            acertouNome: pontosNome > 0,
            acertouArtista: pontosArtista > 0,
            pontosNome,
            pontosArtista
        };

        handleUpdateEstado(novoEstado);

        // Adicionar pontos ao time
        const totalPontos = pontosNome + pontosArtista;
        if (totalPontos > 0) {
            addGamePoints('maestro-billy', timeId, totalPontos);
            addPoints(timeId, totalPontos);
        }

        // Fechar modal
        setModalAberto(false);
        setMusicaAtual(null);
        setEstadoAtual(null);
    };

    const handleResetarPontuacao = (musicaId: string) => {
        // Remover pontuação específica do localStorage
        removeMaestroBillyScore(musicaId);

        // Resetar estado local
        setEstadosMusicas(prev =>
            prev.map(estado =>
                estado.id === musicaId
                    ? { ...estado, lida: false, tentativas: 0, acertouNome: false, acertouArtista: false, pontosNome: 0, pontosArtista: 0 }
                    : estado
            )
        );

        // Sincronizar pontos para atualizar o placar geral
        if (gameState.syncPoints) {
            gameState.syncPoints();
        }
    };

    const handleCloseModal = () => {
        setModalAberto(false);
        setMusicaAtual(null);
        setEstadoAtual(null);
    };

    if (loading) {
        return (
            <div className="maestro-billy">
                <div className="loading">
                    <h2>Carregando Maestro Billy...</h2>
                </div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="maestro-billy">
                <div className="error">
                    <h2>Erro ao carregar configuração</h2>
                </div>
            </div>
        );
    }

    const getTagsForMusica = (estado: MusicaEstado): TagType[] => {
        const tags: TagType[] = [];

        if (estado.lida) {
            if (estado.acertouNome && estado.acertouArtista) {
                tags.push(TagType.CORRECT);
            } else if (estado.acertouNome || estado.acertouArtista) {
                tags.push(TagType.CORRECT);
            } else {
                tags.push(TagType.ERROR);
            }

            // Adicionar tag de tentativa
            if (estado.tentativas === 1) {
                tags.push(TagType.TENTATIVA_1);
            } else if (estado.tentativas === 2) {
                tags.push(TagType.TENTATIVA_2);
            } else if (estado.tentativas === 3) {
                tags.push(TagType.TENTATIVA_3);
            }
        } else {
            tags.push(TagType.PENDING);
        }

        return tags;
    };

    const getPontosInfo = (estado: MusicaEstado) => {
        if (!estado.lida) return null;

        const totalPontos = estado.pontosNome + estado.pontosArtista;
        if (totalPontos === 0) return null;

        return (
            <div className={`pontos-info ${totalPontos > 0 ? 'pontos-positivos' : 'pontos-negativos'}`}>
                {totalPontos > 0 ? '+' : ''}{totalPontos} pts
            </div>
        );
    };

    return (
        <div className="maestro-billy">
            <GameHeader
                title="Maestro Billy"
                subtitle="Jogo musical com buzzer"
                emoji="🎵"
            />

            <div className="musicas-grid">
                {config.musicas.map((musica) => {
                    const estado = estadosMusicas.find(e => e.id === musica.id);
                    if (!estado) return null;

                    const tags = getTagsForMusica(estado);
                    const pontosInfo = getPontosInfo(estado);

                    return (
                        <div key={musica.id} className="musica-card">
                            <DefaultCard
                                title={estado.lida ? musica.nome : `Música #${musica.id}`}
                                tags={tags}
                                onClick={() => handleCardClick(musica)}
                            >
                                {estado.lida && (
                                    <div className="musica-info">
                                        <p className="artista">{musica.artista}</p>
                                        {pontosInfo}
                                    </div>
                                )}
                            </DefaultCard>

                            {estado.lida && (
                                <button
                                    className="reset-button"
                                    onClick={() => handleResetarPontuacao(musica.id)}
                                >
                                    Resetar
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {modalAberto && musicaAtual && estadoAtual && (
                <MaestroBillyModal
                    isOpen={modalAberto}
                    onClose={handleCloseModal}
                    musica={musicaAtual}
                    estado={estadoAtual}
                    config={config}
                    onSalvarPontuacao={handleSalvarPontuacao}
                    gameState={gameState}
                />
            )}
        </div>
    );
};
