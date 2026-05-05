import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Positions.module.css";
import { ImGift } from "react-icons/im";

const positionMap = {
  Goalkeeper: "GK",
  Defender: "DF",
  Midfielder: "MF",
  Forward: "FW",
};

const LEAGUES = ["All", "Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1"];

const Positions = () => {
  const { position } = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState("All");
  const [text, setText] = useState("")

  const PP = positionMap[position] || "";

  useEffect(() => {
    if (!PP) return;

    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const leagueQuery = selectedLeague === "All" ? "" : selectedLeague;

        const res = await fetch(
          `http://localhost:8080/api/scouting/primaryPosition?primaryPosition=${PP}&league=${leagueQuery}`
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

  const filteredPlayers = players.filter(player =>
    player.name?.toLowerCase().includes(text.toLowerCase())
  );

  const toTitleCase = (text) => {
    if (!text) return "--";
    return text
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const inputHandler = (e) => {
    setText(e.target.value);
  };

  if (loading)
    return (
      <div className={styles.rosterContainer}>
        <p className={styles.stateMsg}>Loading players...</p>
      </div>
    );

  return (
    <div className={styles.rosterContainer}>

      {/* Header */}
      <header className={styles.rosterHeader}>
        <div className={styles.titleRow}>
          <h1>
            <span className={styles.countryName}>{position}S</span>
            <span className={styles.titleSub}>SCOUTING REPORT</span>
          </h1>
        </div>

        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Search player..."
            onChange={inputHandler}
            className={styles.inputField}
          />
        </div>
      </header>

      {/* Filters */}
      <div className={styles.filtersBar}>

        {/* League Filter Buttons */}
        <div className={`${styles.filterGroup} ${styles.positionFilter}`}>
          <label>LEAGUE</label>
          <div className={styles.positionButtons}>
            {LEAGUES.map((lg) => (
              <button
                key={lg}
                className={selectedLeague === lg ? styles.active : ""}
                onClick={() => setSelectedLeague(lg)}
              >
                {lg}
              </button>
            ))}
          </div>
        </div>

        {/* Player Count */}
        <div className={styles.playerCount}>
          {filteredPlayers.length} Players
        </div>
      </div>

      {/* Player Grid */}
      <div className={styles.playerGrid}>
        {filteredPlayers.length === 0 ? (
          <p className={styles.noResults}>
            No players found for <strong>{position}</strong>.
          </p>
        ) : (
          filteredPlayers.map((player, index) => (
            <div
              key={`${player.id}-${index}`}
              className={styles.playerCard}
            >

              {/* Card Header */}
              <div className={styles.cardHeader}>
                <h3
                  className={styles.playerName}
                  onClick={() => navigate(`/player/${player.id}`)}
                >
                  {player.name ?? "Unknown"}
                </h3>
                <span className={styles.playerAge}>
                  AGE<br />{player.age ?? "--"}
                </span>
              </div>

              {/* Player Info */}
              <div className={styles.playerDetails}>

                <div className={styles.infoRow}>
                  <span className={styles.detailLabel}>POSITION</span>
                  <span className={styles.detailValue}>
                    {player.position ?? "--"}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.detailLabel2}>ROLE</span>
                  <span className={styles.detailValue}>
                    {toTitleCase(player.role)}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.detailLabel2}>FOOT</span>
                  <span className={styles.detailValue}>{player.preferredFoot ?? "--"}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.detailLabel2}>LEAGUE</span>
                  <span className={styles.detailValue}>
                    {player.league ?? "--"}
                  </span>
                </div>
              </div>

              {/* Footer Stats */}
              <div className={styles.playerStats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{player.nation ?? "--"}</span>
                  <span className={styles.statLabel}>NATION</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {player.clubName ?? "--"}
                  </span>
                  <span className={styles.statLabel}>CLUB</span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Positions;