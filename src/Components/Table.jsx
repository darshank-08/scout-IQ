import React from 'react'
import { useEffect, useState } from 'react'
import styles from "./Table.module.css"
import { data } from 'react-router-dom'

const Table = ({ name }) => {

    const [table, setTable] = useState([])

    const getLeagueCode = (name) => {
        switch (name) {
            case "Premier League": return "PL";
            case "La Liga": return "PD";
            case "Bundesliga": return "BL1";
            case "Serie A": return "SA";
            case "Ligue 1": return "FL1";
            default: return "";
        }
    }

    const clubCode = getLeagueCode(name);

    
    useEffect(() => {
        const standings = async () => {
            if (!clubCode) return;

            const res = await fetch(`http://localhost:8080/api/football/standings/${clubCode}`, {
                method: "GET",
            });

            if (res.ok) {
                const data = await res.json();
                setTable(data.table);
                console.log(data.table);
            } else {
                console.error("Failed to fetch standings data");
            }
        }
        standings();
    }, [name, clubCode]);

    // console.log("Table Data:", table); // Debugging log


    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Club</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>G/D</th>
                        <th>Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {table.map((team) => (
                        <tr key={team.position} className={styles.tableRow}>
                            <td>{team.position}</td>
                            <td className={styles.clubName}>
                            <img
                                src={team.crest}
                                alt={team.teamName}
                                className={styles.crest}
                            />
                            <span className={styles.teamText}>{team.teamName}</span>
                            </td>
                            <td>{team.played}</td>
                            <td>{team.won}</td>
                            <td>{team.draw}</td>
                            <td>{team.lost}</td>
                            <td>{team.goalDifference}</td>
                            <td className={styles.points}>{team.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table