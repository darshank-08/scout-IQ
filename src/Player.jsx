import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Radar } from "react-chartjs-2";
import PlayerProfile from "./Components/PlayerProfile";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";
import styles from "./Player.module.css";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// HELPER FUNCTIONS
const safeNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  return isNaN(num) || num === null || num === undefined ? defaultValue : num;
};

const normalize = (value, maxValue) => {
  const val = safeNumber(value);
  const max = safeNumber(maxValue, 1);
  if (max === 0) return 0;
  return Math.min(100, (val / max) * 100);
};

const per90 = (value, nineties) => {
  const val = safeNumber(value);
  const n = safeNumber(nineties, 1);
  if (n === 0) return 0;
  return val / n;
};

const getNineties = (p) => {
  if (p.nineties && p.nineties > 0) return p.nineties;
  return safeNumber(p.minutes, 0) / 90;
};

// ATTACKING - Pure goal threat (Strikers excel here)
const calculateAttacking = (p) => {
  if (!p) return 0;
  const n = getNineties(p);
  if (n === 0) return 0;

  // Balanced benchmarks - Elite strikers: 80-95, Wingers: 60-80, Midfielders: 40-60
  const GOALS_PER90_MAX = 1.0;      // Haaland: 0.95, Salah: 0.77, Griezmann: 0.46
  const XG_PER90_MAX = 0.85;        // Elite: 0.7-0.85
  const NPXG_PER90_MAX = 0.7;       // Non-penalty threat
  const SHOTS_PER90_MAX = 5.0;      // High volume
  const SOT_PERCENT_MAX = 55.0;     // Good accuracy (lowered from 55)
  const PROG_CARRIES_PER90_MAX = 5.5; // Elite dribblers: 4-6
  const SUCCESSFUL_DRIBBLES_PER90_MAX = 3.5; // Elite: 3-5

  const goalThreat = normalize(safeNumber(p.goalsPer90), GOALS_PER90_MAX);
  const xgImpact = normalize(per90(safeNumber(p.xg), n), XG_PER90_MAX);
  const npxgImpact = normalize(per90(safeNumber(p.npxg), n), NPXG_PER90_MAX);
  const shootingVolume = normalize(safeNumber(p.shotsPer90), SHOTS_PER90_MAX);
  const shotQuality = normalize(safeNumber(p.sotPercentage), SOT_PERCENT_MAX);
  const carries = normalize(per90(safeNumber(p.progressiveCarries), n), PROG_CARRIES_PER90_MAX);
  const dribbles = normalize(per90(safeNumber(p.dribblesCompleted), n), SUCCESSFUL_DRIBBLES_PER90_MAX);


  const score = Math.min(100, Math.round(
    goalThreat * 0.30 +        
    xgImpact * 0.25 +
    npxgImpact * 0.15 +
    shootingVolume * 0.15 +
    shotQuality * 0.15 +       
    carries * 0.14 +           
    dribbles * 0.12           
  ));

  return score;
};

// CREATIVITY - Playmaking (Creative midfielders excel)
const calculateCreativity = (p) => {
  if (!p) return 0;
  const n = getNineties(p);
  if (n === 0) return 0;

  // Balanced - Elite playmakers: 80-95, Attackers: 50-75, Defenders: 20-40
  const XAG_PER90_MAX = 0.7;        // De Bruyne: 0.5, Ødegaard: 0.38, Griezmann: 0.23
  const KEY_PASSES_PER90_MAX = 4.0; // Elite: 3-4
  const SCA90_MAX = 6.5;            // De Bruyne: 6.5, Creative wingers: 4-5
  const SCA_MAX = 50.0;             // Total shot-creating actions
  const ASSISTS_PER90_MAX = 0.6;    // Elite: 0.4-0.6
  const GCA90_MAX = 1.0;            // Top tier: 0.6-1.0


  const xA = normalize(per90(safeNumber(p.xag), n), XAG_PER90_MAX);
  const keyPass = normalize(per90(safeNumber(p.keyPasses), n), KEY_PASSES_PER90_MAX);
  const goalCreation90 = normalize(safeNumber(p.gca90), GCA90_MAX);
  const shotCreation90 = normalize(safeNumber(p.sca90), SCA90_MAX);
  const shotCreation = normalize(safeNumber(p.sca), SCA_MAX);
  const assists = normalize(safeNumber(p.assistsPer90), ASSISTS_PER90_MAX);

  const score = Math.min(100, Math.round(
    xA * 0.25 +
    keyPass * 0.25 +           
    goalCreation90 * 0.10 +
    shotCreation90 * 0.10  +    
    shotCreation * 0.27 +
    assists * 0.15 
  ));

  return score;
};


// PASSING - Distribution quality (Midfielders shine)
const calculatePassing = (p) => {
  if (!p) return 0;
  const n = getNineties(p);
  if (n === 0) return 0;

  // Only elite passers score 85+
  const PASS_ACCURACY_MAX = 95.0;   // Elite: 90-92% (raised from 90)
  const COMPLETED_PASSES_PER90_MAX = 58.0; // Elite: 50-65 (raised from 50)
  const PROGRESSIVE_PASSES_PER90_MAX = 10.0; // Elite: 7-11 (raised from 8)
  const PASS_ATTEMPTS_PER90_MAX = 68.0; // High involvement (raised from 60)

  const accuracy = normalize(safeNumber(p.passComplPerce), PASS_ACCURACY_MAX);
  const volume = normalize(per90(safeNumber(p.completedPasses), n), COMPLETED_PASSES_PER90_MAX);
  const progressive = normalize(per90(safeNumber(p.progressivePasses), n), PROGRESSIVE_PASSES_PER90_MAX);
  const involvement = normalize(per90(safeNumber(p.passesAttempted), n), PASS_ATTEMPTS_PER90_MAX);

  
  const score = Math.min(100, Math.round(
    accuracy * 0.35 +          
    volume * 0.25 +
    progressive * 0.25 +
    involvement * 0.10
  ));

  return score;
};

// DRIBBLING - Ball handling (Elite dribblers score 85+)
const calculateDribbling = (p) => {
  if (!p) return 0;
  const n = getNineties(p);
  if (n === 0) return 0;

  // Only elite dribblers score 85+
  const PROG_CARRIES_PER90_MAX = 6.5;       // Elite: 5-7 (was 5.5)
  const PROG_RUNS_PER90_MAX = 15.0;         // Elite: 12-18 (was 12.0)
  const PROG_CARRY_DIST_PER90_MAX = 170.0;  // Elite: 140-200 (was 140.0)
  const SUCCESSFUL_DRIBBLES_PER90_MAX = 4.0; // Elite: 3.5-5 (was 3.5)
  const ATT_THIRD_TOUCHES_PER90_MAX = 40.0; // Elite: 35-45 (was 35.0)

  const carries = normalize(per90(safeNumber(p.progressiveCarries), n), PROG_CARRIES_PER90_MAX);
  const runs = normalize(per90(safeNumber(p.progressiveRuns), n), PROG_RUNS_PER90_MAX);
  const carryDistance = normalize(per90(safeNumber(p.progCarryDistance), n), PROG_CARRY_DIST_PER90_MAX);
  const dribbles = normalize(per90(safeNumber(p.dribblesCompleted), n), SUCCESSFUL_DRIBBLES_PER90_MAX);
  const attThird = normalize(per90(safeNumber(p.attThirdTouches), n), ATT_THIRD_TOUCHES_PER90_MAX);

  const score = Math.min(100, Math.round(
    carries * 0.25 +
    runs * 0.25 +
    carryDistance * 0.20 +
    dribbles * 0.20 +
    attThird * 0.10
  ));

  return score;
};

// DEFENDING - Defensive contribution (SIMPLIFIED & BALANCED)
const calculateDefending = (p) => {
  if (!p) return 0;
  const n = getNineties(p);
  if (n === 0) return 0;

  // Defenders: 80-95, Defensive midfielders: 60-80, Attackers: 20-40
  const TACKLES_PER90_MAX = 2.5;           // Defenders: 2-4, Attackers: 0.3-1.5
  const INTERCEPTIONS_PER90_MAX = 1.5;     // Defenders: 1-2.5, Attackers: 0-0.5
  const BLOCKS_PER90_MAX = 1.5;            // Defenders: 1-2, Attackers: 0.5-1.5
  const CLEARANCES_PER90_MAX = 2.0;        // Defenders: 1.5-4, Attackers: 0-0.5
  const AERIALS_WON_PER90_MAX = 3.0;       // Defenders: 2-5, Attackers: 0.2-1.5
  const TACKLE_SUCCESS_MAX = 70.0;         // Elite: 65-75%
  const DEF_THIRD_TOUCHES_PER90_MAX = 20.0; // Defenders: 15-25, Attackers: 0-5

  const tackles = normalize(per90(safeNumber(p.tackles), n), TACKLES_PER90_MAX);
  const interceptions = normalize(per90(safeNumber(p.interceptions), n), INTERCEPTIONS_PER90_MAX);
  const blocks = normalize(per90(safeNumber(p.blocks), n), BLOCKS_PER90_MAX);
  const clearances = normalize(per90(safeNumber(p.clr), n), CLEARANCES_PER90_MAX);
  const aerials = normalize(per90(safeNumber(p.aerialsWon), n), AERIALS_WON_PER90_MAX);
  const tackleSuccess = normalize(safeNumber(p.tklPerce), TACKLE_SUCCESS_MAX);
  const defThirdTouches = normalize(per90(safeNumber(p.defThirdTouches), n), DEF_THIRD_TOUCHES_PER90_MAX);

  const score = Math.min(100, Math.round(
    tackles * 0.20 +
    interceptions * 0.13 +
    blocks * 0.18 +
    clearances * 0.17 +
    aerials * 0.17 +
    tackleSuccess * 0.10 +
    defThirdTouches * 0.10
  ));

  
  return score;
};

// MAIN COMPONENT
const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const res = await fetch(`http://localhost:8080/api/scouting/players/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (res.ok) {
          const data = await res.json();
          console.log("✅ Fetched player data:", data);
          setPlayer(data);
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

  // Calculate all stats
  const attacking = player ? calculateAttacking(player) : 0;
  const creativity = player ? calculateCreativity(player) : 0;
  const passing = player ? calculatePassing(player) : 0;
  const dribbling = player ? calculateDribbling(player) : 0;
  const defending = player ? calculateDefending(player) : 0;

  useEffect(() => {
    if (player) {
      console.log("📊 FINAL CALCULATED STATS:", {
        attacking,
        creativity,
        passing,
        dribbling,
        defending
      });
    }
  }, [player, attacking, creativity, passing, dribbling, defending]);

  // Radar chart data
// Each point has its own color like in the image
const pointColors = [
  "#22c55e",  // Attacking  - cyan
  "#f59e0b",  // Dribbling  - red
  "#a855f7",  // Creativity - orange
  "#3b82f6",  // Passing    - blue
  "#ef4444",  // Defending  - purple
];

const radarData = {
  labels: [
    `Attacking\n${attacking}`,
    `Dribbling\n${dribbling}`,
    `Creativity\n${creativity}`,
    `Passing\n${passing}`,
    `Defending\n${defending}`,
  ],
  datasets: [
    {
      label: "Player Stats",
      data: [attacking, dribbling, creativity, passing, defending],

      // Gradient-like fill from cyan to purple (matches image)
      backgroundColor: "rgba(0, 180, 255, 0.25)",
      borderColor: "rgba(0, 200, 255, 0.9)",
      borderWidth: 2,

      // Each point has its own color
      pointBackgroundColor: pointColors,
      pointBorderColor: pointColors,
      pointBorderWidth: 0.5,
      pointRadius: 6,
      pointHoverRadius: 9,
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: pointColors,
    }
  ]
};

const radarOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      min: 0,
      max: 100,
      beginAtZero: true,

      // Dark hexagonal grid lines like the image
      grid: {
        color: "rgba(255, 255, 255, 0.08)",
        lineWidth: 1,
      },
      angleLines: {
        color: "rgba(255, 255, 255, 0.08)",
        lineWidth: 1,
      },

      // Label styling - name on top, value bold below (like image)
      pointLabels: {
        color: "#cbd5e1",
        font: {
          size: 13,
          weight: "400",
          family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        // This callback splits the label into 2 lines
        callback: function (label) {
          return label.split("\n");
        },
      },

      // Hide tick numbers on the rings
      ticks: {
        display: false,
        stepSize: 20,
        backdropColor: "transparent",
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(10, 15, 30, 0.95)",
      weight: "500",
      titleColor: "#ffffff",
      bodyColor: "#00c8ff",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      padding: 14,
      cornerRadius: 10,
      callbacks: {
        // Clean tooltip: "Attacking: 82 / 100"
        label: (ctx) => `  ${ctx.label.replace("\n", " ")}: ${ctx.parsed.r} / 100`,
      },
    },
  },
};

  const attributes = [
    { name: "Attacking", value: attacking, color: "#22c55e", icon: "⚽" },
    { name: "Dribbling", value: dribbling, color: "#f59e0b", icon: "🔥" },
    { name: "Creativity", value: creativity, color: "#a855f7", icon: "✨" },
    { name: "Passing", value: passing, color: "#3b82f6", icon: "📊" },
    { name: "Defending", value: defending, color: "#ef4444", icon: "🛡️" }
  ];

  const statsCards = [
    { label: "Matches", value: safeNumber(player?.matches), icon: "🎮" },
    { label: "Goals", value: safeNumber(player?.goals), icon: "⚽" },
    { label: "Assists", value: safeNumber(player?.assists), icon: "🅰️" },
    { label: "xG", value: safeNumber(player?.xg).toFixed(1), icon: "📈" },
    { label: "xAG", value: safeNumber(player?.xag).toFixed(1), icon: "📊" },
    { label: "Minutes", value: safeNumber(player?.minutes), icon: "⏱️" }
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading player data...</p>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className={styles.errorContainer}>
        <h2>⚠️ {error || "Player not found"}</h2>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Go Back
        </button>
      </div>
    );
  }

 return (
    <div className={styles.container}>

      {/* Back Button */}
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* ===== MAIN LAYOUT ===== */}
      <div className={styles.mainLayout}>

        {/* ===== LEFT SIDE ===== */}
        <div className={styles.leftSide}>

          {/* Player Profile Info Card */}
          <PlayerProfile data={player} />

          {/* Season Overview Stats */}
          <div className={styles.quickStatsPanel}>
            <h3 className={styles.panelTitle}>
              Season Overview
            </h3>
            <div className={styles.statsGrid}>
              {statsCards.map((stat, i) => (
                <div key={i} className={styles.statCard}>
                  <span className={styles.statCardValue}>{stat.value}</span>
                  <span className={styles.statCardLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ===== RIGHT SIDE ===== */}
        <div className={styles.rightSide}>

          {/* Radar Chart */}
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>
              Player Radar
            </h3>
            <div className={styles.radarWrapper}>
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          {/* Attribute Bars */}
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>
              Attribute Ratings
            </h3>
            <div className={styles.attributesList}>
              {attributes.map((attr, i) => (
                <div key={i} className={styles.barRow}>
                  <span className={styles.attrIcon}>{attr.icon}</span>
                  <span className={styles.attrName}>{attr.name}</span>
                  <div className={styles.bar}>
                    <div
                      className={styles.fill}
                      style={{
                        width: `${attr.value}%`,
                        background: `linear-gradient(90deg, ${attr.color}DD, ${attr.color})`
                      }}
                    />
                  </div>
                  <span className={styles.attrValue} style={{ color: attr.color }}>
                    {attr.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Player;