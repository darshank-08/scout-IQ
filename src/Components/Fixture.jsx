import React from 'react'
import styles from "./Fixture.module.css"
import { useEffect, useState } from 'react'

export const Fixture = ({ name }) => {

    const [fixtures, setFixtures] = useState([])

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
        const fetchFixtures = async () => {
            if (!clubCode) return;

            const res = await fetch(`http://localhost:8080/api/football/fixtures/${clubCode}`, {
                method: "GET",
            });

            if (res.ok) {
                const data = await res.json();
                setFixtures(data.matches);
            } else {
                console.error("Failed to fetch fixtures data");
            }
        }
        fetchFixtures();
    }, [name, clubCode]);

    return (
        <div className={styles["table-wrapper"]}>
            {fixtures.map((fix) => (   // ✅ fixtures not Fixture
                <div key={fix.id} className={styles.matchCard}>
                    
                    <div className={styles.matchday}>
                        Matchday {fix.matchday}
                    </div>

                    <div className={styles.teams}>
                        {/* Home Team */}
                        <div className={styles.team}>
                            <img src={fix.homeTeam.crest} alt={fix.homeTeam.shortName} />
                            <span>{fix.homeTeam.shortName}</span>
                        </div>

                        {/* VS */}
                        <div className={styles.vs}>VS</div>

                        {/* Away Team */}
                        <div className={styles.team}>
                            <img src={fix.awayTeam.crest} alt={fix.awayTeam.shortName} />
                            <span>{fix.awayTeam.shortName}</span>
                        </div>
                    </div>

                    <div className={styles.date}>
                        {new Date(fix.date).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </div>

                </div>
            ))}
        </div>
    )
}

export default Fixture