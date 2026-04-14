import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from "./LeaguePlayers.module.css"

const LeaguePlayers = ({name}) => {

  const [players, setPlayers] = useState([]);

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

  return (

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
                      src={`../../public/assets/teams/${player.clubName}.png`}
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
  )
}

export default LeaguePlayers