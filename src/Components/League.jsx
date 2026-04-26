import React from 'react'
import styles from './League.module.css'
import { useNavigate } from "react-router-dom";

const League = () => {
    const navigate = useNavigate();

const leagueData = [
  {
    id: 1,
    name: "Premier League",
    short: "PL",
    country: "England",
    champion: "Liverpool",
    rank: "#1",
    logo: `./assets/leagues/PL.jpg`,
    color: "linear-gradient(135deg, #3d195b, #7c3aed)",
    bgColor: "rgba(124, 58, 237, 0.15)",
  },
  {
    id: 2,
    name: "La Liga",
    short: "LL",
    country: "Spain",
    champion: "FC Barcelona",
    rank: "#2",
    logo: "./assets/leagues/LaLiga.jpg",
    color: "linear-gradient(135deg, #ff5a36, #ea580c)",
    bgColor: "rgba(255, 90, 54, 0.15)",
  },
  {
    id: 3,
    name: "Bundesliga",
    short: "BL",
    country: "Germany",
    champion: "Bayern Munich",
    rank: "#3",
    logo: "./assets/leagues/Bundesliga.jpg",
    color: "linear-gradient(135deg, #ef233c, #dc2626)",
    bgColor: "rgba(239, 35, 60, 0.15)",
  },
  {
    id: 4,
    name: "Ligue 1",
    short: "L1",
    country: "France",
    champion: "PSG",
    rank: "#4",
    logo: "./assets/leagues/Ligue_1.jpg",
    color: "linear-gradient(135deg, #1d4ed8, #06b6d4)",
    bgColor: "rgba(0, 194, 255, 0.15)",
  },
  {
    id: 5,
    name: "Serie A",
    short: "SA",
    country: "Italy",
    champion: "Napoli",
    rank: "#5",
    logo: "./assets/leagues/Serie_A.jpg",
    color: "linear-gradient(135deg, #1e3a5f, #0ea5e9)",
    bgColor: "rgba(30, 144, 255, 0.15)",
  }
];


const leagues = (name) => {
    navigate(`/leagues/${name}`)
}

  return (
           <div className={styles.grid}>
              {leagueData.map((league, index) => (
                <article
                  key={league.id}
                  className={styles.card}
                  style={{
                    "--card-color": league.color,
                    "--card-bg": league.bgColor,
                    "--delay": `${index * 0.1}s`,
                  }}
                >

    
                  {/* Default State - Big Logo */}
                  <div className={styles.logoSection}>
                    <div className={styles.logoWrapper}>
                      <img
                        src={league.logo}
                        alt={league.name}
                        className={styles.logo}
                      />
                    </div>
                    <h3 className={styles.leagueName}>{league.name}</h3>
                    <span className={styles.countryTag}>{league.country}</span>
                  </div>
    
                  {/* Hover State - Info Overlay */}
                  <div className={styles.overlay}>
                    <div className={styles.overlayInner}>
                      {/* Mini Logo */}
                      <div className={styles.overlayLogo}>
                        <img src={league.logo} alt={league.name} />
                      </div>
    
                      {/* League Name */}
                      <h3 className={styles.overlayTitle}>{league.name}</h3>
    
                      {/* Info Stats */}
                      <div className={styles.stats}>
                        <div className={styles.stat}>
                          <span className={styles.statLabel}>Country</span>
                          <span className={styles.statValue}>{league.country}</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statLabel}>Ranking</span>
                          <span className={styles.statValue}>{league.rank}</span>
                        </div>
                      </div>
    
                      {/* Champion */}
                      <div className={styles.champion}>
                        <span className={styles.championLabel}>
                          🏆 Current Champion
                        </span>
                        <span className={styles.championName}>
                          {league.champion}
                        </span>
                      </div>
    
                      {/* CTA Button */}
                        <button 
                        className={styles.btn} 
                        onClick={() => leagues(league.name)}
                        >
                        <span>View League</span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
    
  )
}

export default League