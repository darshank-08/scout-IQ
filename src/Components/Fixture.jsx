import React, { useEffect, useState } from 'react';
import styles from "./Fixture.module.css";

export const Fixture = ({ name, title, FixStatus }) => {

    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(false);

    const getLeagueCode = (name) => {
        switch (name) {
            case "Premier League": return "PL";
            case "La Liga": return "PD";
            case "Bundesliga": return "BL1";
            case "Serie A": return "SA";
            case "Ligue 1": return "FL1";
            default: return "";
        }
    };

    const LeagueCode = getLeagueCode(name);
    const status = FixStatus || "SCHEDULED";

    const fetchFixtures = async () => {
        if (!LeagueCode) return;
        setLoading(true);

        try {
            const API = import.meta.env.VITE_API_BASE_URL;
            const res = await fetch(
                `${API}/api/football/fixtures/${LeagueCode}?status=${status}`,
                { 
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setFixtures(data.matches || []);
            } else {
                setFixtures([]);
            }
        } catch (error) {
            console.error("Error fetching fixtures:", error);
            setFixtures([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFixtures();

        let pollingInterval;
        if (status === 'IN_PLAY') {
            pollingInterval = setInterval(() => {
                fetchFixtures();
            }, 10000);
        }

        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [LeagueCode, status]);

    const getStatusLabel = (status) => {
        switch(status) {
            case 'IN_PLAY': return 'Live';
            case 'SCHEDULED': return 'Upcoming';
            case 'FINISHED': return 'Finished';
            case 'TIMED': return 'Upcoming';
            default: return status;
        }
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'IN_PLAY': return styles.live;
            case 'SCHEDULED': return styles.scheduled;
            case 'TIMED': return styles.scheduled;
            case 'FINISHED': return styles.finished;
            default: return '';
        }
    };

    if (loading && fixtures.length === 0) {
        return <div className={styles.loading}>Loading fixtures...</div>;
    }

    if (!fixtures || fixtures.length === 0) {
        return (
            <div className={styles.noFixtures}>
                No <span >{getStatusLabel(status)}</span> fixtures available
            </div>
        );
    }

    return (
        <div className={title === "home" ? styles["mini-table-wrapper"] : styles["table-wrapper"]}>
            {status === 'IN_PLAY' && (
                <div className={styles.liveIndicator}>
                    <span className={styles.liveIndicatorDot}></span>
                    <span>Updating in real-time...</span>
                </div>
            )}

            {(title === "home" ? fixtures.slice(0, 4) : fixtures).map((fix) => (
                <div key={fix.id} className={styles.matchCard}>

                    <div className={styles.matchday}>
                        Matchday {fix.matchday}
                    </div>

                    <div className={styles.teams}>
                        <div className={styles.team}>
                            <img
                                src={fix.homeTeam.crest}
                                alt={fix.homeTeam.shortName}
                                className={styles.crest}
                            />
                            <span>{fix.homeTeam.shortName}</span>
                        </div>

                        {fix.score?.fullTime?.home !== null && fix.score?.fullTime?.home !== undefined ? (
                            <div className={styles.score}>
                                <span className={styles.homeScore}>{fix.score.fullTime.home}</span>
                                <span className={styles.separator}>-</span>
                                <span className={styles.awayScore}>{fix.score.fullTime.away}</span>
                            </div>
                        ) : (
                            <div className={styles.vs}>VS</div>
                        )}

                        <div className={styles.team}>
                            <img
                                src={fix.awayTeam.crest}
                                alt={fix.awayTeam.shortName}
                                className={styles.crest}
                            />
                            <span>{fix.awayTeam.shortName}</span>
                        </div>
                    </div>

                    <div className={styles.date}>
                        <div className={`${styles.status} ${getStatusClass(fix.status)}`}>
                            {getStatusLabel(fix.status)}
                        </div>
                        
                        <div className={styles.time}>
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

                </div>
            ))}
        </div>
    );
};

export default Fixture;