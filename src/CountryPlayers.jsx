import styles from "./CountryPlayers.module.css";
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import { FaSearch } from "react-icons/fa";

const countries = [
  { id: 1, country: "ARG", flagCode: "AR", fifaRank: 3, worldCups: 3 },
  { id: 2, country: "FRA", flagCode: "FR", fifaRank: 1, worldCups: 2 },
  { id: 3, country: "ESP", flagCode: "ES", fifaRank: 2, worldCups: 1 },
  { id: 4, country: "ENG", flagCode: "GB", fifaRank: 4, worldCups: 1 },
  { id: 5, country: "BRA", flagCode: "BR", fifaRank: 6, worldCups: 5 },
  { id: 6, country: "BEL", flagCode: "BE", fifaRank: 9, worldCups: 0 },
  { id: 7, country: "NED", flagCode: "NL", fifaRank: 7, worldCups: 0 },
  { id: 8, country: "POR", flagCode: "PT", fifaRank: 5, worldCups: 0 },
  { id: 9, country: "ITA", flagCode: "IT", fifaRank: 12, worldCups: 4 },
  { id: 10, country: "COL", flagCode: "CO", fifaRank: 13, worldCups: 0 },
  { id: 11, country: "CRO", flagCode: "HR", fifaRank: 11, worldCups: 0 },
  { id: 12, country: "GER", flagCode: "DE", fifaRank: 10, worldCups: 4 },
  { id: 13, country: "MAR", flagCode: "MA", fifaRank: 11, worldCups: 0 },
  { id: 14, country: "URU", flagCode: "UY", fifaRank: 17, worldCups: 2 },
  { id: 15, country: "SUI", flagCode: "CH", fifaRank: 19, worldCups: 0 },
  { id: 16, country: "JPN", flagCode: "JP", fifaRank: 18, worldCups: 0 },
  { id: 17, country: "SEN", flagCode: "SN", fifaRank: 14, worldCups: 0 },
  { id: 18, country: "UKR", flagCode: "UA", fifaRank: 32, worldCups: 0 },
  { id: 19, country: "TUR", flagCode: "TR", fifaRank: 22, worldCups: 0 },
  { id: 20, country: "SWE", flagCode: "SE", fifaRank: 38, worldCups: 0 },
  { id: 21, country: "NOR", flagCode: "NO", fifaRank: 31, worldCups: 0 },
  { id: 22, country: "ALG", flagCode: "DZ", fifaRank: 28, worldCups: 0 },
  { id: 23, country: "SCO", flagCode: "GB", fifaRank: 43, worldCups: 0 },
  { id: 24, country: "GHA", flagCode: "GH", fifaRank: 74, worldCups: 0 },
];

const POSITIONS = ["ALL", "GK", "DF", "MF", "FW"];

const CountryPlayers = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("ALL");
  const [selectedProfile, setSelectedProfile] = useState("");

  const selectedCountry = countries.find((c) => c.id === Number(id));

  useEffect(() => {
    if (!selectedCountry) return;

    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const API = import.meta.env.VITE_API_BASE_URL;

        const res = await fetch(
          `${API}/api/scouting/nation?nation=${selectedCountry.country}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) throw new Error(`Failed (${res.status})`);

        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error(err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [selectedCountry]);

  useEffect(() => {
    setSelectedProfile("");
  }, [positionFilter]);

  const filteredPlayers = useMemo(() => {
    if (!Array.isArray(players)) return [];

    const search = searchTerm.toLowerCase().trim();

    return players.filter((player) => {
      const name = player.name?.toLowerCase() || "";
      const playerPositions = (player.position || "")
        .toUpperCase()
        .split(",")
        .map((p) => p.trim());
      const role = player.role?.toLowerCase() || "";

      const matchesSearch = !search || name.includes(search);
      const matchesPosition =
        positionFilter === "ALL" || playerPositions.includes(positionFilter);
      const matchesProfile =
        !selectedProfile || role === selectedProfile.toLowerCase();

      return matchesSearch && matchesPosition && matchesProfile;
    });
  }, [players, searchTerm, positionFilter, selectedProfile]);

  if (!selectedCountry) {
    return (
      <div className={styles.rosterContainer}>
        <p className={styles.stateMsg}>Country not found.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.rosterContainer}>
        <p className={styles.stateMsg}>Loading roster...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.rosterContainer}>
        <p className={`${styles.stateMsg} ${styles.errorMsg}`}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.rosterContainer}>
      <header className={styles.rosterHeader}>
        <div className={styles.titleRow}>
          <img
            src={`https://flagsapi.com/${selectedCountry.flagCode}/shiny/64.png`}
            alt={`${selectedCountry.country} flag`}
            className={styles.countryFlag}
          />
          <h1>
            <span className={styles.countryName}>{selectedCountry.country}</span>
            <span className={styles.titleSub}>NATIONAL PLAYERS</span>
          </h1>
        </div>
      </header>

      <div className={styles.filtersBar}>
        <div className={`${styles.filterGroup} ${styles.searchPlayers}`}>
          <label htmlFor="search">SEARCH PLAYERS</label>
          <div className={styles.searchInputWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              id="search"
              type="text"
              placeholder="Player name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={`${styles.filterGroup} ${styles.positionFilter}`}>
          <label>POSITION</label>
          <div className={styles.positionButtons}>
            {POSITIONS.map((pos) => (
              <button
                key={pos}
                className={positionFilter === pos ? styles.active : ""}
                onClick={() => setPositionFilter(pos)}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.playerCount}>{filteredPlayers.length} Players</div>

        <div className={styles.Profile}>
          {positionFilter === "GK" && (
            <select
              className={styles.profileSelect}
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
            >
              <option value="">All GK Profiles</option>
              <option value="attacking gk">Attacking Keeper</option>
              <option value="defensive gk">Defensive Keeper</option>
            </select>
          )}

          {positionFilter === "DF" && (
            <select
              className={styles.profileSelect}
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
            >
              <option value="">All DF Profiles</option>
              <option value="ball playing cb">Ball-Playing Defender</option>
              <option value="stopper">Stopper</option>
              <option value="attacking fullback">Attacking Fullback</option>
              <option value="defensive fullback">Defensive Fullback</option>
            </select>
          )}

          {positionFilter === "MF" && (
            <select
              className={styles.profileSelect}
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
            >
              <option value="">All MF Profiles</option>
              <option value="anchor man">Anchor Man</option>
              <option value="orchestrator">Orchestrator</option>
              <option value="box to box">Box-to-Box</option>
              <option value="creative">Playmaker</option>
              <option value="hole player">Hole Player</option>
            </select>
          )}

          {positionFilter === "FW" && (
            <select
              className={styles.profileSelect}
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
            >
              <option value="">All FW Profiles</option>
              <option value="goal poacher">Goal Poacher</option>
              <option value="target man">Target Man</option>
              <option value="deep lying forward">False 9</option>
              <option value="inverted winger">Inverted Winger</option>
              <option value="wide winger">Wide Winger</option>
            </select>
          )}
        </div>
      </div>

      <div className={styles.playerGrid}>
        {filteredPlayers.length === 0 ? (
          <p className={styles.noResults}>
            No players found for <strong>{selectedCountry.country}</strong>.
          </p>
        ) : (
          filteredPlayers.map((player, index) => {
            const name = player.name ?? "Unknown";
            const age = player.age ?? "--";
            const playerPosition = player.position ?? "--";
            const club = player.clubName ?? "--";

            const displayStats = Object.entries(player)
              .filter(
                ([key]) =>
                  ![
                    "id",
                    "name",
                    "age",
                    "position",
                    "nation",
                    "nationality",
                    "clubName",
                  ].includes(key)
              )
              .slice(0, 2);

            return (
              <div
                key={`${player.id}-${player.clubName}-${index}`}
                className={styles.playerCard}
              >
                <div className={styles.cardHeader}>
                  <h3
                    className={styles.playerName}
                    onClick={() => navigate(`/player/${player.id}`)}
                  >
                    {name}
                  </h3>
                  <span className={styles.playerAge}>
                    AGE<br />
                    {age}
                  </span>
                </div>

                <div className={styles.playerDetails}>
                  <div className={styles.infoRow}>
                    <span className={styles.detailLabel}>POSITION</span>
                    <span className={styles.detailValue}>{playerPosition}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.detailLabel2}>NATIONALITY</span>
                    <div className={styles.iconRow}>
                      <img
                        src={`https://flagsapi.com/${selectedCountry.flagCode}/flat/32.png`}
                        alt={selectedCountry.country}
                        className={styles.flagIcon}
                      />
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.detailLabel2}>CLUB</span>
                    <div className={styles.iconRow}>
                      <img
                        src={`/assets/teams/${club}.png`}
                        alt={club}
                        className={styles.clubIcon}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.playerStats}>
                  {displayStats.length > 0 ? (
                    displayStats.map(([key, value]) => (
                      <div key={key} className={styles.stat}>
                        <span className={styles.statValue}>{value ?? "--"}</span>
                        <span className={styles.statLabel}>
                          {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.stat}>
                      <span className={styles.statValue}>--</span>
                      <span className={styles.statLabel}>STATS</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CountryPlayers;