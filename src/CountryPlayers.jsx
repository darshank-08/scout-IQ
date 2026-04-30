import React from 'react'
import styles from "./CountryPlayers.module.css"
import { useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CountryPlayers = () => {
   const { id } = useParams();

    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

const countries = [
  { id: 1, country: 'ARG', flagCode: 'AR', fifaRank: 3, worldCups: 3 },
  { id: 2, country: 'FRA', flagCode: 'FR', fifaRank: 1, worldCups: 2 },
  { id: 3, country: 'ESP', flagCode: 'ES', fifaRank: 2, worldCups: 1 },
  { id: 4, country: 'ENG', flagCode: 'GB', fifaRank: 4, worldCups: 1 },
  { id: 5, country: 'BRA', flagCode: 'BR', fifaRank: 6, worldCups: 5 },
  { id: 6, country: 'BEL', flagCode: 'BE', fifaRank: 9, worldCups: 0 },
  { id: 7, country: 'NED', flagCode: 'NL', fifaRank: 7, worldCups: 0 },
  { id: 8, country: 'POR', flagCode: 'PT', fifaRank: 5, worldCups: 0 },
  { id: 9, country: 'ITA', flagCode: 'IT', fifaRank: 12, worldCups: 4 },
  { id: 10, country: 'COL', flagCode: 'CO', fifaRank: 13, worldCups: 0 },
  { id: 11, country: 'CRO', flagCode: 'HR', fifaRank: 11, worldCups: 0 },
  { id: 12, country: 'GER', flagCode: 'DE', fifaRank: 10, worldCups: 4 },
  { id: 13, country: 'MAR', flagCode: 'MA', fifaRank: 11, worldCups: 0 },
  { id: 14, country: 'URU', flagCode: 'UY', fifaRank: 17, worldCups: 2 },
  { id: 15, country: 'SUI', flagCode: 'CH', fifaRank: 19, worldCups: 0 },
  { id: 16, country: 'JPN', flagCode: 'JP', fifaRank: 18, worldCups: 0 },
  { id: 17, country: 'MEX', flagCode: 'MX', fifaRank: 15, worldCups: 0 },
  { id: 18, country: 'SEN', flagCode: 'SN', fifaRank: 14, worldCups: 0 },
  { id: 19, country: 'IRN', flagCode: 'IR', fifaRank: 21, worldCups: 0 },
  { id: 20, country: 'KOR', flagCode: 'KR', fifaRank: 25, worldCups: 0 },
  { id: 21, country: 'AUS', flagCode: 'AU', fifaRank: 27, worldCups: 0 },
  { id: 22, country: 'UKR', flagCode: 'UA', fifaRank: 32, worldCups: 0 },
  { id: 23, country: 'TUR', flagCode: 'TR', fifaRank: 22, worldCups: 0 },
  { id: 24, country: 'ECU', flagCode: 'EC', fifaRank: 23, worldCups: 0 },
  { id: 25, country: 'SWE', flagCode: 'SE', fifaRank: 38, worldCups: 0 },
  { id: 26, country: 'NOR', flagCode: 'NO', fifaRank: 31, worldCups: 0 },
  { id: 27, country: 'ALG', flagCode: 'DZ', fifaRank: 28, worldCups: 0 },
  { id: 28, country: 'QAT', flagCode: 'QA', fifaRank: 55, worldCups: 0 },
  { id: 29, country: 'SCO', flagCode: 'GB', fifaRank: 43, worldCups: 0 },
  { id: 30, country: 'GHA', flagCode: 'GH', fifaRank: 74, worldCups: 0 },
  { id: 31, country: 'RSA', flagCode: 'ZA', fifaRank: 60, worldCups: 0 },
  { id: 32, country: 'UZB', flagCode: 'UZ', fifaRank: 50, worldCups: 0 }
];

  const selectedCountry = countries.find(c => c.id === parseInt(id));
  console.log("Selected country:", selectedCountry.country);


  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!selectedCountry) return;
      try {
        setLoading(true);
        
        const res = await fetch(`http://localhost:8080/api/scouting/nation?nation=${selectedCountry.country}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (res.ok) {
          const data = await res.json();
          setPlayers(data);
        } else {
          setError(`Failed to fetch player data (${res.status})`);
        }
      } catch (err) {
        console.error("Network error:", err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [id]);

  return (

    
    <div className={styles.container}>
        <div className={styles.header}>
            <h1> <span className={styles.countryName}>{selectedCountry?.country} </span>National Players</h1>
            <img src={`https://flagsapi.com/${selectedCountry?.flagCode}/shiny/64.png`} alt={`${selectedCountry?.country} Flag`} />      
        </div>

        <div className={styles.minorDetails}>
            <div>
                <p>Fifa Ranking: <span>{selectedCountry.fifaRank}</span></p>
                <p>World Cups: <span>{selectedCountry.worldCups}</span></p>
            </div>

            <p className={styles.playerCount}>Players: <span>{players.length}</span></p>
        </div>

       <div className={styles["table-wrapper"]}>
         <table className={styles.table}>
            <thead>
            <tr >
                <th>Logo</th>
                <th>Name</th>
                <th>Nation</th>
                <th>Age</th>
                <th>Position</th>
                <th>Club</th>
            </tr>
            </thead>

            <tbody>
            {players.length > 0 ? (
                players.map((player, index) => (
                <tr key={`${player.id}-${index}`}>  
                    <td>
                    <img
                        src={`/assets/teams/${player.clubName}.png`}
                        alt={player.clubName}
                        className={styles["club-logo"]}
                    />
                    </td>
                    <td className={styles.name}>
                    <Link to={`/player/${player.id}`} className={styles.link}>
                        {player.name}
                    </Link>
                    </td>
                    <td>{player.nation}</td>
                    <td>{player.age}</td>
                    <td>{player.position}</td>
                    <td>{player.clubName}</td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                    No players found
                </td>
                </tr>
            )}
            </tbody>

            </table>
        </div>

    </div>
  )
}

export default CountryPlayers