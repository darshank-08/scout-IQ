import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from "./Positions.module.css"

const positionMap = {
  Goalkeeper: "GK",
  Defender: "DF",
  Midfielder: "MF",
  Forward: "FW"
};

const Positions = () => {

  const { position } = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState("");

  const PP = positionMap[position] || "";

useEffect(() => {

    if (!PP) return;

    const fetchPlayers = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          ` http://localhost:8080/api/scouting/primaryPosition?primaryPosition=${PP}&league=${selectedLeague}`
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setPlayers(data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();

  }, [PP, selectedLeague]);

  return (
    <div className={styles.container}>

      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.header}>
          <h1>{position ?? "N/A"}s</h1>
          <p>{players.length} Players Found</p>
        </div>

        <div className={styles.dropdownContainer}>
          <select
            className={styles.dropdown}
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
          >
            <option value="">All</option>
            <option value="Premier League">Premier League</option>
            <option value="La Liga">La Liga</option>
            <option value="Bundesliga">Bundesliga</option>
            <option value="Serie A">Serie A</option>
            <option value="Ligue 1">Ligue 1</option>
          </select>
        </div>
      </div>

      {/* LOADING */}
      {loading && <div className={styles.loading}>Loading players...</div>}

      {/* EMPTY */}
      {!loading && players.length === 0 && (
        <div className={styles.empty}>No players found</div>
      )}

      {/* GRID */}
      {!loading && (
        <div className={styles.grid}>
          {players.map(player => (
            <div key={player.id} className={styles.card}>

              <div className={styles.top}>
                <h3>{player.name ?? "N/A"}</h3>
                <span className={styles.nation}>
                  {player.nation ?? "N/A"}
                </span>
              </div>

              <div className={styles.top}>
                <p className={styles.club}>
                  {player.clubName ?? "N/A"}
                </p>
                <p className={styles.nation}>
                  {player.league ?? "N/A"}
                </p>
              </div>

              <div className={styles.meta}>
                <span>{player.age ?? "N/A"} yrs</span>
                <span>{player.preferredFoot ?? "N/A"}</span>
              </div>

              <div className={styles.meta}>
                <p className={styles.nation}>
                  {player.position ?? "N/A"}
                </p>
                {player.role ?? "N/A"}
              </div>

              <button
                className={styles.viewBtn}
                onClick={() => navigate(`/player/${player.id}`)}
              >
                View Profile →
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Positions;