import React from 'react'
import styles from "./LeagueData.module.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const LeagueData = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { name } = useParams();
  const [players, setPlayers] = useState([]);

  switch (name) {
    case "Premier League":
      var country = "England";
      break;
    case "La Liga":
      var country = "Spain";
      break;
    case "Bundesliga":
      var country = "Germany";
      break;
    case "Serie A":
      var country = "Italy";
      break;
    case "Ligue 1":
      var country = "France"; 
      break;
    default:
      var country = "Unknown";
  }

useEffect(() => {
  const playersData = async () =>{
    
    var league = name;

      const res = await fetch(`http://localhost:8080/api/scouting/playersByLeague/${league}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      setPlayers(data);
    } else {
      console.error("Failed to fetch players data");
    }


  }
  playersData();}
, [name]);

// console.log(players.forEach(player => console.log(player)))

return (
  <div className={styles.dashboard}>
    <div className={styles["dashboard-container"]}>
      <p className={styles.brand}>SCOUT IQ</p>

      <h1 className={styles.title}>{name}</h1>
      <p className={styles.subtitle}>
        {country}

       
        <img className={styles.flag} src={`../public/assets/country/${country}.jpg`} alt={country} />
      </p>

      <div className={styles.card}>
        <div className={styles["card-header"]}>
          <h2>Players</h2>
          <span className={styles.count}>Players: {players.length}</span>
        </div>

        <div className={styles["table-wrapper"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Logo</th>
                <th>Name</th>
                <th>Nation</th>
                <th>Age</th>
                <th>Position</th>
                <th>Club</th>
              </tr>
            </thead>


            <tbody>
              {players.map((player) => (
                <tr key={player.id}>
                  <td>
                    <img
                      src={`../public/assets/teams/${player.clubName}.png`}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
}

export default LeagueData 