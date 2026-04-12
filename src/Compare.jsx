import React, { useState, useEffect } from 'react';
import styles from "./Compare.module.css";
import { useParams } from 'react-router-dom';
import PlayerProfile from './Components/PlayerProfile';
import PlayerRadar from './Components/PlayerRadar';
import AttributeRating from './Components/AttibuteRating';
import PhaseStats from './Components/PhaseStats';

const Compare = () => {
  const { id } = useParams();
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');

  // Fetch Player 1 on mount
  useEffect(() => {
    const fetchPlayer1 = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:8080/api/scouting/players/${id}`);

        if (res.ok) {
          const data = await res.json();
          setPlayer1(data);
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

    if (id) {
      fetchPlayer1();
    }
  }, [id]);

  // Fetch Player 2 when user selects
  const handleSelectPlayer2 = async (selectedId) => {
    try {
      setError(null);

      const res = await fetch(`http://localhost:8080/api/scouting/players/${sectedId}`);

      if (res.ok) {
        const data = await res.json();
        setPlayer2(data);
      } else {
        setError(`Failed to fetch player 2 data (${res.status})`);
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error");
    }
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

   //Filtering Stats for PhaseStats component

  // Attacking Stats - Player 1
  const attackingStats1 = player1 ? {
    goals: player1.goals ?? 0,
    gA: player1.gA ?? 0,
    goalsPer90: player1.goalsPer90 ?? 0,
    xg: player1.xg ?? 0,
    xag: player1.xag ?? 0,
    npxg: player1.npxg ?? 0,
    shots: player1.shots ?? 0,
    shotsOnTarget: player1.shotsOnTarget ?? 0,
    sotPercentage: player1.sotPercentage ?? 0,
    shotsPer90: player1.shotsPer90 ?? 0,
    sotPer90: player1.sotPer90 ?? 0,
  } : null;

  // Passing Stats - Player 1
  const passingStats1 = player1 ? {
    assists: player1.assists ?? 0,
    assistsPer90: player1.assistsPer90 ?? 0,
    passesAttempted: player1.passesAttempted ?? 0,
    completedPasses: player1.completedPasses ?? 0,
    passComplPerce: player1.passComplPerce ?? 0,
    keyPasses: player1.keyPasses ?? 0,
    progressivePasses: player1.progressivePasses ?? 0,
    sca: player1.sca ?? 0,
    sca90: player1.sca90 ?? 0,
    gca: player1.gca ?? 0,
    gca90: player1.gca90 ?? 0,
  } : null;

  // Possession Stats - Player 1
  const possessionStats1 = player1 ? {
    touches: player1.touches ?? 0,
    defThirdTouches: player1.defThirdTouches ?? 0,
    midThirdTouches: player1.midThirdTouches ?? 0,
    attThirdTouches: player1.attThirdTouches ?? 0,
    carries: player1.carries ?? 0,
    progressiveCarries: player1.progressiveCarries ?? 0,
    progressiveRuns: player1.progressiveRuns ?? 0,
    carryDistance: player1.carryDistance ?? 0,
    progCarryDistance: player1.progCarryDistance ?? 0,
    progCarriesPerce: player1.progCarriesPerce ?? 0,
    dribbles: player1.dribbles ?? 0,
    dribblesCompleted: player1.dribblesCompleted ?? 0,
  } : null;

  // Defensive Stats - Player 1
  const defensiveStats1 = player1 ? {
    tackles: player1.tackles ?? 0,
    tklWon: player1.tklWon ?? 0,
    tklPerce: player1.tklPerce ?? 0,
    interceptions: player1.interceptions ?? 0,
    blocks: player1.blocks ?? 0,
    clr: player1.clr ?? 0,
    aerialsWon: player1.aerialsWon ?? 0,
  } : null;



  // Attacking Stats - Player 2
  const attackingStats2 = player2 ? {
    goals: player2.goals ?? 0,
    gA: player2.gA ?? 0,
    goalsPer90: player2.goalsPer90 ?? 0,
    xg: player2.xg ?? 0,
    xag: player2.xag ?? 0,
    npxg: player2.npxg ?? 0,
    shots: player2.shots ?? 0,
    shotsOnTarget: player2.shotsOnTarget ?? 0,
    sotPercentage: player2.sotPercentage ?? 0,
    shotsPer90: player2.shotsPer90 ?? 0,
    sotPer90: player2.sotPer90 ?? 0,
    sca: player2.sca ?? 0,
    sca90: player2.sca90 ?? 0,
    gca: player2.gca ?? 0,
    gca90: player2.gca90 ?? 0,
  } : null;

  // Passing Stats - Player 2
  const passingStats2 = player2 ? {
    assists: player2.assists ?? 0,
    assistsPer90: player2.assistsPer90 ?? 0,
    passesAttempted: player2.passesAttempted ?? 0,
    completedPasses: player2.completedPasses ?? 0,
    passComplPerce: player2.passComplPerce ?? 0,
    keyPasses: player2.keyPasses ?? 0,
    progressivePasses: player2.progressivePasses ?? 0,
    sca: player2.sca ?? 0,
    sca90: player2.sca90 ?? 0,
    gca: player2.gca ?? 0,
    gca90: player2.gca90 ?? 0,
  } : null;

  // Possession Stats - Player 2
  const possessionStats2 = player2 ? {
    touches: player2.touches ?? 0,
    defThirdTouches: player2.defThirdTouches ?? 0,
    midThirdTouches: player2.midThirdTouches ?? 0,
    attThirdTouches: player2.attThirdTouches ?? 0,
    carries: player2.carries ?? 0,
    progressiveCarries: player2.progressiveCarries ?? 0,
    progressiveRuns: player2.progressiveRuns ?? 0,
    carryDistance: player2.carryDistance ?? 0,
    progCarryDistance: player2.progCarryDistance ?? 0,
    progCarriesPerce: player2.progCarriesPerce ?? 0,
    dribbles: player2.dribbles ?? 0,
    dribblesCompleted: player2.dribblesCompleted ?? 0,
  } : null;

  // Defensive Stats - Player 2
  const defensiveStats2 = player2 ? {
    tackles: player2.tackles ?? 0,
    tklWon: player2.tklWon ?? 0,
    tklPerce: player2.tklPerce ?? 0,
    interceptions: player2.interceptions ?? 0,
    blocks: player2.blocks ?? 0,
    clr: player2.clr ?? 0,
    aerialsWon: player2.aerialsWon ?? 0,
  } : null;

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>

      <div className={styles.headerBar}>
        <h1 className={styles.sectionTitle}>Compare Players</h1>

        <input type="text" className={styles.nameInput}/>
      </div>

      <div className={styles.compareGrid}>

        <div className={styles.profileCard}>
          {player1 && <PlayerProfile data={player1} />}
        </div>

        <div className={styles.vsDivider}>
          <span>VS</span>
        </div>

        <div className={styles.profileCard}>
          {player2 ? (
            <PlayerProfile data={player2} />
          ) : (
            <div className={styles.placeholder}>

              {/* Search Input
              <div className={styles.searchWrapper}>
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder="Enter Player ID..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchId.trim()) {
                      handleSelectPlayer2(searchId.trim());
                    }
                  }}
                />
                <button
                  className={styles.searchButton}
                  onClick={() => {
                    if (searchId.trim()) {
                      handleSelectPlayer2(searchId.trim());
                    }
                  }}
                >
                  Search
                </button>
              </div> */}

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
        <h3 style={{fontFamily:"-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        fontWeight: 400
        }}>{player1.name ? player1.name : "NaN"} vs </h3>
        <PlayerRadar id={id}/>
      </div>

      <div className={styles.compareGrid}>
          <div className={styles.quickStatsPanel}>
            <h3 className={styles.panelTitle}>
              {player1.name ? player1.name : "N/A"}
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
              {"NaN"}
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
        {player1 ? (
          <AttributeRating id={player1.id} />
        ) : (
          <div className={styles.NaN}>
            <h2 className={styles.placeholderText}>N/A</h2>
          </div>
        )}

        <div className={styles.vsDivider}>
          <span>VS</span>
        </div>

        {player2 ? (
          <AttributeRating id={player2.id} />
        ) : (
          <div className={styles.NaN}>
            <h2 className={styles.placeholderText}>N/A</h2>
          </div>
        )}

      </div>
      
      {/* Attack */}
      <div className={styles.compareGrid}>
        <PhaseStats title={"Attacking"} data={attackingStats1}/>

        <div className={styles.vsDivider}>
          <span>VS</span>
        </div>

        {player2 ? (
          <PhaseStats title={"Attacking"} data={attackingStats2}/>
        ) : (
          <div className={styles.NaN}>
            <h2 className={styles.placeholderText}>N/A</h2>
          </div>
        )}
      </div>

      {/* Passing */}
      <div className={styles.compareGrid}>
        <PhaseStats title={"Passing"} data={passingStats1}/>

        <div className={styles.vsDivider}>
          <span>VS</span>
        </div>

        {player2 ? (
          <PhaseStats title={"Passing"} data={passingStats2}/>
        ) : (
          <div className={styles.NaN}>
            <h2 className={styles.placeholderText}>N/A</h2>
          </div>
        )}
      </div>

      {/* Possession & Carries */}
      <div className={styles.compareGrid}>
        <PhaseStats title={"Possession & Carries"} data={possessionStats1}/>

        <div className={styles.vsDivider}>
          <span>VS</span>
        </div>

        {player2 ? (
          <PhaseStats title={"Possession & Carries"} data={possessionStats2}/>
        ) : (
          <div className={styles.NaN}>
            <h2 className={styles.placeholderText}>N/A</h2>
          </div>
        )}
      </div>

      {/* Defensive */}
      <div className={styles.compareGrid}>
        <PhaseStats title={"Defensive"} data={defensiveStats1}/>

        <div className={styles.vsDivider}>
          <span>VS</span>
        </div>

        {player2 ? (
          <PhaseStats title={"Defensive"} data={defensiveStats2}/>
        ) : (
          <div className={styles.NaN}>
            <h2 className={styles.placeholderText}>N/A</h2>
          </div>
        )}
      </div>

      <p className={styles.disclaimer}>
        * Data based on 2024–25 season performance. Player ability may vary beyond these metrics.
      </p>

    </div>
  );
};

export default Compare;