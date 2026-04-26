import React from 'react'
import { useState, useEffect } from 'react'
import styles from "./TopScorers.module.css"

const TopScorers = ({league}) => {
    const [scorers, setScorers] = useState([]);

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

    const leagueCode = getLeagueCode(league);
    // console.log("League Code:", leagueCode); // Debugging log

  return (
    <div className={styles.card}>
        <h2 className={styles.title}>{league}</h2>
    </div>
  )
}

export default TopScorers