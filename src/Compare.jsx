import React, { useState, useEffect, useRef } from 'react';
import styles from "./Compare.module.css";
import { useParams } from 'react-router-dom';
import PlayerProfile from './Components/PlayerProfile';
import PlayerRadar from './Components/PlayerRadar';
import AttributeRating from './Components/AttibuteRating';
import PhaseStats from './Components/PhaseStats';
import RadarCompare from './Components/RadarCompare';
import { FaInfoCircle } from 'react-icons/fa';

const Compare = () => {
  const { id } = useParams();
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [player2Error, setPlayer2Error] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchWrapperRef = useRef(null);

  // Fetch Player 1 on mount / when id changes
  useEffect(() => {
    if (!id) {
      // No id in the route — nothing to fetch, don't hang on "Loading..." forever
      setLoading(false);
      setError("No player selected");
      return;
    }

    // Reset comparison state whenever the primary player changes
    setPlayer2(null);
    setPlayer2Error(null);
    setQuery('');
    setResults([]);

    let cancelled = false;

    const fetchPlayer1 = async () => {
      try {
        setLoading(true);
        setError(null);

        const API = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${API}/api/scouting/players/${id}`);

        if (cancelled) return;

        if (res.ok) {
          const data = await res.json();
          setPlayer1(data);
        } else {
          setError(`Failed to fetch player data (${res.status})`);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Network error:", err);
          setError("Network error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPlayer1();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const API = import.meta.env.VITE_API_BASE_URL;
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API}/api/scouting/names?query=${encodeURIComponent(query)}`
        );
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setDropdownOpen(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Player 2 when user selects
  const handleSelectPlayer2 = async (selectedId) => {
    try {
      setPlayer2Error(null);

      const API = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API}/api/scouting/players/${selectedId}`);

      if (res.ok) {
        const data = await res.json();
        setPlayer2(data);
      } else {
        setPlayer2Error(`Failed to fetch player 2 data (${res.status})`);
      }
    } catch (err) {
      console.error("Network error:", err);
      setPlayer2Error("Network error");
    }
  };

  const nameQuery = (e) => {
    setQuery(e.target.value);
  };

  // Placeholder stats when player2 is not selected
  const placeholderStats = [
    { label: 'Name', value: 'N/A' },
    { label: 'Nation', value: 'N/A' },
    { label: 'Age', value: 'N/A' },
    { label: 'Position', value: 'N/A' },
    { label: 'Preferred Foot', value: 'N/A' },
    { label: 'Role', value: 'N/A' },
    { label: 'Club', value: 'N/A' },
    { label: 'League', value: 'N/A' },
  ];

  const statsCards1 = [
    { label: "Matches", value: player1?.matches ?? 'N/A' },
    { label: "Goals", value: player1?.goals ?? 'N/A' },
    { label: "Assists", value: player1?.assists ?? 'N/A' },
    { label: "Yellow", value: player1?.yellowCards ?? 'N/A' },
    { label: "Red", value: player1?.redCards ?? 'N/A' },
    { label: "Minutes", value: player1?.minutes ?? 'N/A' },
  ];

  const statsCards2 = [
    { label: "Matches", value: player2?.matches ?? 'N/A' },
    { label: "Goals", value: player2?.goals ?? 'N/A' },
    { label: "Assists", value: player2?.assists ?? 'N/A' },
    { label: "Yellow", value: player2?.yellowCards ?? 'N/A' },
    { label: "Red", value: player2?.redCards ?? 'N/A' },
    { label: "Minutes", value: player2?.minutes ?? 'N/A' },
  ];

  const buildAttackingStats = (p) => p ? {
    goals: p.goals ?? 0,
    gA: p.gA ?? 0,
    goalsPer90: p.goalsPer90 ?? 0,
    xg: p.xg ?? 0,
    xag: p.xag ?? 0,
    npxg: p.npxg ?? 0,
    shots: p.shots ?? 0,
    shotsOnTarget: p.shotsOnTarget ?? 0,
    sotPercentage: p.sotPercentage ?? 0,
    shotsPer90: p.shotsPer90 ?? 0,
    sotPer90: p.sotPer90 ?? 0,
  } : null;

  const buildPassingStats = (p) => p ? {
    assists: p.assists ?? 0,
    assistsPer90: p.assistsPer90 ?? 0,
    passesAttempted: p.passesAttempted ?? 0,
    completedPasses: p.completedPasses ?? 0,
    passComplPerce: p.passComplPerce ?? 0,
    keyPasses: p.keyPasses ?? 0,
    progressivePasses: p.progressivePasses ?? 0,
    sca: p.sca ?? 0,
    sca90: p.sca90 ?? 0,
    gca: p.gca ?? 0,
    gca90: p.gca90 ?? 0,
  } : null;

  const buildPossessionStats = (p) => p ? {
    touches: p.touches ?? 0,
    defThirdTouches: p.defThirdTouches ?? 0,
    midThirdTouches: p.midThirdTouches ?? 0,
    attThirdTouches: p.attThirdTouches ?? 0,
    carries: p.carries ?? 0,
    progressiveCarries: p.progressiveCarries ?? 0,
    progressiveRuns: p.progressiveRuns ?? 0,
    carryDistance: p.carryDistance ?? 0,
    progCarryDistance: p.progCarryDistance ?? 0,
    progCarriesPerce: p.progCarriesPerce ?? 0,
    dribbles: p.dribbles ?? 0,
    dribblesCompleted: p.dribblesCompleted ?? 0,
  } : null;

  const buildDefensiveStats = (p) => p ? {
    tackles: p.tackles ?? 0,
    tklWon: p.tklWon ?? 0,
    tklPerce: p.tklPerce ?? 0,
    interceptions: p.interceptions ?? 0,
    blocks: p.blocks ?? 0,
    clr: p.clr ?? 0,
    aerialsWon: p.aerialsWon ?? 0,
  } : null;

  const attackingStats1 = buildAttackingStats(player1);
  const passingStats1 = buildPassingStats(player1);
  const possessionStats1 = buildPossessionStats(player1);
  const defensiveStats1 = buildDefensiveStats(player1);

  const attackingStats2 = buildAttackingStats(player2);
  const passingStats2 = buildPassingStats(player2);
  const possessionStats2 = buildPossessionStats(player2);
  const defensiveStats2 = buildDefensiveStats(player2);

  if (loading) return <div className={styles.loading}><h2>Loading...</h2></div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!player1) return <div className={styles.error}>Player not found</div>;

  return (
    <div className={styles.container}>

      <div className={styles.headerBar}>
        <h1 className={styles.sectionTitle}>Compare Players</h1>

        <div className={styles.searchInput} ref={searchWrapperRef}>
          <input
            type="text"
            className={styles.nameInput}
            onChange={nameQuery}
            onFocus={() => results.length > 0 && setDropdownOpen(true)}
            value={query}
            placeholder="Search player..."
          />

          {/* Results Dropdown */}
          {dropdownOpen && query.trim().length >= 2 && results.length > 0 && (
            <ul className={styles.dropdown}>
              {results.map((player) => (
                <li
                  key={player.id}
                  onClick={() => {
                    handleSelectPlayer2(player.id);
                    setQuery('');
                    setResults([]);
                    setDropdownOpen(false);
                  }}
                >
                  {player.name}  ·  {player.clubName}
                </li>
              ))}
            </ul>
          )}

          {player2Error && (
            <div className={styles.searchError}>{player2Error}</div>
          )}
        </div>

      </div>

      <div className={styles.compareGrid}>

        <div className={styles.profileCard}>
          <PlayerProfile data={player1} />
        </div>

        <div className={styles.vsDivider}>
          <span>VS</span>
        </div>

        <div className={styles.profileCard}>
          {player2 ? (
            <PlayerProfile data={player2} />
          ) : (
            <div className={styles.placeholder}>
              {/* Placeholder Stats */}
              <div className={styles.playerProfile}>
                <h2 className={styles.title}>Player Info</h2>
                <div className={styles.statsList}>
                  {placeholderStats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className={`${styles.statRow} ${
                        index !== placeholderStats.length - 1 ? styles.statRowBorder : ''
                      }`}
                    >
                      <span className={styles.statLabel}>{stat.label}</span>
                      <span className={styles.statValuePlaceholder}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className={styles.RadarWrapper}>
        {player2 ? (
          <>
            <h3 className={styles.radarTitle}>
              <span className={styles.p1Dot} />
              {player1?.name ?? "N/A"} <span className={styles.vsText}>vs</span>
              <span className={styles.p2Dot} />
              {player2?.name ?? "N/A"}
            </h3>

            <RadarCompare player1={player1} player2={player2} />
          </>
        ) : (
          <>
            <h3 className={styles.radarTitle}>
              {player1?.name ?? "N/A"} <span className={styles.vsText}>vs</span>
              {"N/A"}
            </h3>

            {player1?.id ? <PlayerRadar id={player1.id} /> : <div className={styles.NaN}>N/A</div>}
          </>
        )}
      </div>

      <div className={styles.compareGrid}>
        <div className={styles.quickStatsPanel}>
          <h3 className={styles.panelTitle}>
            {player1?.name ?? "N/A"}
          </h3>
          <div className={styles.statsGrid}>
            {statsCards1.map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <span className={styles.statCardValue}>{stat.value}</span>
                <span className={styles.statCardLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.vsDivider}>
          <span>VS</span>
        </div>

        <div className={styles.quickStatsPanel}>
          <h3 className={styles.panelTitle}>
            {player2?.name ?? "N/A"}
          </h3>
          <div className={styles.statsGrid}>
            {statsCards2.map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <span className={styles.statCardValue}>{stat.value}</span>
                <span className={styles.statCardLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.compareGrid}>
        {player1?.id ? (
          <AttributeRating id={player1.id} />
        ) : (
          <div className={styles.NaN}>
            <h2 className={styles.placeholderText}>N/A</h2>
          </div>
        )}

        <div className={styles.vsDivider}>
          <span>VS</span>
        </div>

        {player2?.id ? (
          <AttributeRating id={player2.id} />
        ) : (
          <div className={styles.NaN}>
            <h2 className={styles.placeholderText}>N/A</h2>
          </div>
        )}
      </div>

      {/* Attack */}
      <div className={styles.compareGrid}>
        <PhaseStats title={"Attacking"} data={attackingStats1} />

        <div className={styles.vsDivider}>
          <span>VS</span>
        </div>

        {player2 ? (
          <PhaseStats title={"Attacking"} data={attackingStats2} />
        ) : (
          <div className={styles.NaN}>
            <h2 className={styles.placeholderText}>N/A</h2>
          </div>
        )}
      </div>

      {/* Passing */}
      <div className={styles.compareGrid}>
        <PhaseStats title={"Passing"} data={passingStats1} />

        <div className={styles.vsDivider}>
          <span>VS</span>
        </div>

        {player2 ? (
          <PhaseStats title={"Passing"} data={passingStats2} />
        ) : (
          <div className={styles.NaN}>
            <h2 className={styles.placeholderText}>N/A</h2>
          </div>
        )}
      </div>

      {/* Possession & Carries */}
      <div className={styles.compareGrid}>
        <PhaseStats title={"Possession & Carries"} data={possessionStats1} />

        <div className={styles.vsDivider}>
          <span>VS</span>
        </div>

        {player2 ? (
          <PhaseStats title={"Possession & Carries"} data={possessionStats2} />
        ) : (
          <div className={styles.NaN}>
            <h2 className={styles.placeholderText}>N/A</h2>
          </div>
        )}
      </div>

      {/* Defensive */}
      <div className={styles.compareGrid}>
        <PhaseStats title={"Defensive"} data={defensiveStats1} />

        <div className={styles.vsDivider}>
          <span>VS</span>
        </div>

        {player2 ? (
          <PhaseStats title={"Defensive"} data={defensiveStats2} />
        ) : (
          <div className={styles.NaN}>
            <h2 className={styles.placeholderText}>N/A</h2>
          </div>
        )}
      </div>

      <p className={styles.dataNote}>
        <FaInfoCircle className={styles.noteIcon} />
        <span>
          Data based on 2024–25 season performance. Player ability may vary beyond these metrics.
        </span>
      </p>

    </div>
  );
};

export default Compare;