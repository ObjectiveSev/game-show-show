import React, { useMemo, useEffect, useState } from 'react';
import { loadVerdadesAbsurdasScores, loadDicionarioSurrealScores } from '../utils/scoreStorage';
import { useGameState } from '../hooks/useGameState';
import '../styles/PlacarDetalhado.css';
import { carregarVerdadesAbsurdas } from '../utils/verdadesAbsurdasLoader';
import { carregarDicionarioSurreal } from '../utils/dicionarioLoader';

export const PlacarDetalhado: React.FC = () => {
    const { gameState } = useGameState();

    const entries = loadVerdadesAbsurdasScores();
    const dicEntries = loadDicionarioSurrealScores();
    const [tituloPorTextoId, setTituloPorTextoId] = useState<Record<string, string>>({});
    const [palavraPorId, setPalavraPorId] = useState<Record<string, string>>({});

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
        carregarDicionarioSurreal()
            .then(data => {
                if (!isMounted) return;
                const map: Record<string, string> = {};
                data.palavras.forEach(p => { map[p.id] = p.palavra; });
                setPalavraPorId(map);
            })
            .catch(() => { });
        return () => { isMounted = false; };
    }, []);

    const totais = useMemo(() => {
        const base = entries.reduce(
            (acc, e) => {
                acc.A += e.pontosAdivinhador * (e.timeAdivinhador === 'A' ? 1 : 0) + e.pontosLeitor * (e.timeLeitor === 'A' ? 1 : 0);
                acc.B += e.pontosAdivinhador * (e.timeAdivinhador === 'B' ? 1 : 0) + e.pontosLeitor * (e.timeLeitor === 'B' ? 1 : 0);
                return acc;
            },
            { A: 0, B: 0 }
        );
        // Dicionário: pontos vão apenas para o time adivinhador
        dicEntries.forEach((d) => {
            if (d.timeAdivinhador === 'A') base.A += d.pontos; else base.B += d.pontos;
        });
        return base;
    }, [entries, dicEntries]);

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

            <section className="entries-section" style={{ marginTop: 16 }}>
                <h2>Dicionário Surreal</h2>
                {dicEntries.length === 0 ? (
                    <div className="empty">Nenhum registro salvo ainda.</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="pd-table">
                            <thead>
                                <tr>
                                    <th>Palavra</th>
                                    <th>Adivinhador</th>
                                    <th className="right">Dicas</th>
                                    <th className="right">Acertou?</th>
                                    <th className="right">Pontos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dicEntries.map((e, idx) => (
                                    <tr key={idx}>
                                        <td>{palavraPorId[e.palavraId] || e.palavraId}</td>
                                        <td>{e.timeAdivinhador === 'A' ? (gameState.teams.teamA.name || 'Time A') : (gameState.teams.teamB.name || 'Time B')}</td>
                                        <td className="right">{e.dicasAbertas}</td>
                                        <td className="right">{e.acertou ? 'Sim' : 'Não'}</td>
                                        <td className="right">{e.pontos}</td>
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

