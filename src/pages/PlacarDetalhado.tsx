import React, { useMemo, useEffect, useState } from 'react';
import { loadVerdadesAbsurdasScores } from '../utils/scoreStorage';
import { useGameState } from '../hooks/useGameState';
import '../styles/PlacarDetalhado.css';
import { carregarVerdadesAbsurdas } from '../utils/verdadesAbsurdasLoader';

export const PlacarDetalhado: React.FC = () => {
    const { gameState } = useGameState();

    const entries = loadVerdadesAbsurdasScores();
    const [tituloPorTextoId, setTituloPorTextoId] = useState<Record<string, string>>({});

    useEffect(() => {
        let isMounted = true;
        carregarVerdadesAbsurdas()
            .then(data => {
                if (!isMounted) return;
                const map: Record<string, string> = {};
                data.verdadesAbsurdas.forEach(t => { map[t.id] = t.titulo; });
                setTituloPorTextoId(map);
            })
            .catch(() => { });
        return () => { isMounted = false; };
    }, []);

    const totais = useMemo(() => {
        return entries.reduce(
            (acc, e) => {
                acc.A += e.pontosAdivinhador * (e.timeAdivinhador === 'A' ? 1 : 0) + e.pontosLeitor * (e.timeLeitor === 'A' ? 1 : 0);
                acc.B += e.pontosAdivinhador * (e.timeAdivinhador === 'B' ? 1 : 0) + e.pontosLeitor * (e.timeLeitor === 'B' ? 1 : 0);
                return acc;
            },
            { A: 0, B: 0 }
        );
    }, [entries]);

    return (
        <div className="placar-detalhado">
            <header className="pd-header">
                <a className="voltar-button" href="/">← Voltar ao Dashboard</a>
                <h1>📊 Placar Detalhado</h1>
                <p>Veja os registros das partidas e a soma de pontos por time</p>
            </header>

            <section className="totais-section">
                <div className="total-card">
                    <span className="label">{gameState.teams.teamA.name || 'Time A'}</span>
                    <span className="valor">{totais.A}</span>
                </div>
                <div className="total-card">
                    <span className="label">{gameState.teams.teamB.name || 'Time B'}</span>
                    <span className="valor">{totais.B}</span>
                </div>
            </section>

            <section className="entries-section">
                <h2>Verdades Absurdas</h2>
                {entries.length === 0 ? (
                    <div className="empty">Nenhum registro salvo ainda.</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="pd-table">
                            <thead>
                                <tr>
                                    <th>Texto</th>
                                    <th>Leitor</th>
                                    <th>Adivinhador</th>
                                    <th className="right">Acertos</th>
                                    <th className="right">Não encontradas</th>
                                    <th className="right">Erros</th>
                                    <th className="right">Pontos Leitor</th>
                                    <th className="right">Pontos Adiv.</th>

                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((e, idx) => (
                                    <tr key={idx}>
                                        <td>{tituloPorTextoId[e.textoId] || e.textoId}</td>
                                        <td>{e.timeLeitor === 'A' ? (gameState.teams.teamA.name || 'Time A') : (gameState.teams.teamB.name || 'Time B')}</td>
                                        <td>{e.timeAdivinhador === 'A' ? (gameState.teams.teamA.name || 'Time A') : (gameState.teams.teamB.name || 'Time B')}</td>
                                        <td className="right">{e.verdadesEncontradas}</td>
                                        <td className="right">{e.verdadesNaoEncontradas}</td>
                                        <td className="right">{e.erros}</td>
                                        <td className="right">{e.pontosLeitor}</td>
                                        <td className="right">{e.pontosAdivinhador}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

