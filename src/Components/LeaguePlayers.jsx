import React from 'react'
import { Link } from 'react-router-dom';
import styles from "./LeaguePlayers.module.css"

const LeaguePlayers = ({ name, query, players }) => {  


  const filteredPlayers = query
    ? players.filter((player) =>
        player.name.toLowerCase().includes(query.toLowerCase())
      )
    : players;


  return (
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
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player, index) => (
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
  );
};

export default LeaguePlayers;