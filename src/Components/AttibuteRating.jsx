import React from 'react'
import styles from "./AttributeRating.module.css"
import { useState, useEffect } from 'react';

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

// ATTACKING
const calculateAttacking = (p) => {
  if (!p) return 0;
  const n = getNineties(p);
  if (n === 0) return 0;

  const GOALS_PER90_MAX = 1.0;
  const XG_PER90_MAX = 0.85;
  const NPXG_PER90_MAX = 0.7;
  const SHOTS_PER90_MAX = 5.0;
  const SOT_PERCENT_MAX = 55.0;
  const PROG_CARRIES_PER90_MAX = 5.5;
  const SUCCESSFUL_DRIBBLES_PER90_MAX = 3.5;

  const goalThreat = normalize(safeNumber(p.goalsPer90), GOALS_PER90_MAX);
  const xgImpact = normalize(per90(safeNumber(p.xg), n), XG_PER90_MAX);
  const npxgImpact = normalize(per90(safeNumber(p.npxg), n), NPXG_PER90_MAX);
  const shootingVolume = normalize(safeNumber(p.shotsPer90), SHOTS_PER90_MAX);
  const shotQuality = normalize(safeNumber(p.sotPercentage), SOT_PERCENT_MAX);
  const carries = normalize(per90(safeNumber(p.progressiveCarries), n), PROG_CARRIES_PER90_MAX);
  const dribbles = normalize(per90(safeNumber(p.dribblesCompleted), n), SUCCESSFUL_DRIBBLES_PER90_MAX);

  return Math.min(100, Math.round(
    goalThreat * 0.30 +
    xgImpact * 0.25 +
    npxgImpact * 0.15 +
    shootingVolume * 0.15 +
    shotQuality * 0.15 +
    carries * 0.14 +
    dribbles * 0.12
  ));
};

// CREATIVITY
const calculateCreativity = (p) => {
  if (!p) return 0;
  const n = getNineties(p);
  if (n === 0) return 0;

  const XAG_PER90_MAX = 0.7;
  const KEY_PASSES_PER90_MAX = 4.0;
  const SCA90_MAX = 6.5;
  const SCA_MAX = 50.0;
  const ASSISTS_PER90_MAX = 0.6;
  const GCA90_MAX = 1.0;

  const xA = normalize(per90(safeNumber(p.xag), n), XAG_PER90_MAX);
  const keyPass = normalize(per90(safeNumber(p.keyPasses), n), KEY_PASSES_PER90_MAX);
  const goalCreation90 = normalize(safeNumber(p.gca90), GCA90_MAX);
  const shotCreation90 = normalize(safeNumber(p.sca90), SCA90_MAX);
  const shotCreation = normalize(safeNumber(p.sca), SCA_MAX);
  const assists = normalize(safeNumber(p.assistsPer90), ASSISTS_PER90_MAX);

  return Math.min(100, Math.round(
    xA * 0.25 +
    keyPass * 0.25 +
    goalCreation90 * 0.10 +
    shotCreation90 * 0.10 +
    shotCreation * 0.27 +
    assists * 0.15
  ));
};

// PASSING
const calculatePassing = (p) => {
  if (!p) return 0;
  const n = getNineties(p);
  if (n === 0) return 0;

  const PASS_ACCURACY_MAX = 95.0;
  const COMPLETED_PASSES_PER90_MAX = 58.0;
  const PROGRESSIVE_PASSES_PER90_MAX = 10.0;
  const PASS_ATTEMPTS_PER90_MAX = 68.0;

  const accuracy = normalize(safeNumber(p.passComplPerce), PASS_ACCURACY_MAX);
  const volume = normalize(per90(safeNumber(p.completedPasses), n), COMPLETED_PASSES_PER90_MAX);
  const progressive = normalize(per90(safeNumber(p.progressivePasses), n), PROGRESSIVE_PASSES_PER90_MAX);
  const involvement = normalize(per90(safeNumber(p.passesAttempted), n), PASS_ATTEMPTS_PER90_MAX);

  return Math.min(100, Math.round(
    accuracy * 0.35 +
    volume * 0.25 +
    progressive * 0.25 +
    involvement * 0.10
  ));
};

// DRIBBLING
const calculateDribbling = (p) => {
  if (!p) return 0;
  const n = getNineties(p);
  if (n === 0) return 0;

  const PROG_CARRIES_PER90_MAX = 6.5;
  const PROG_RUNS_PER90_MAX = 15.0;
  const PROG_CARRY_DIST_PER90_MAX = 170.0;
  const SUCCESSFUL_DRIBBLES_PER90_MAX = 4.0;
  const ATT_THIRD_TOUCHES_PER90_MAX = 40.0;

  const carries = normalize(per90(safeNumber(p.progressiveCarries), n), PROG_CARRIES_PER90_MAX);
  const runs = normalize(per90(safeNumber(p.progressiveRuns), n), PROG_RUNS_PER90_MAX);
  const carryDistance = normalize(per90(safeNumber(p.progCarryDistance), n), PROG_CARRY_DIST_PER90_MAX);
  const dribbles = normalize(per90(safeNumber(p.dribblesCompleted), n), SUCCESSFUL_DRIBBLES_PER90_MAX);
  const attThird = normalize(per90(safeNumber(p.attThirdTouches), n), ATT_THIRD_TOUCHES_PER90_MAX);

  return Math.min(100, Math.round(
    carries * 0.25 +
    runs * 0.25 +
    carryDistance * 0.20 +
    dribbles * 0.20 +
    attThird * 0.10
  ));
};

// DEFENDING
const calculateDefending = (p) => {
  if (!p) return 0;
  const n = getNineties(p);
  if (n === 0) return 0;

  const TACKLES_PER90_MAX = 2.5;
  const INTERCEPTIONS_PER90_MAX = 1.5;
  const BLOCKS_PER90_MAX = 1.5;
  const CLEARANCES_PER90_MAX = 2.0;
  const AERIALS_WON_PER90_MAX = 3.0;
  const TACKLE_SUCCESS_MAX = 70.0;
  const DEF_THIRD_TOUCHES_PER90_MAX = 20.0;

  const tackles = normalize(per90(safeNumber(p.tackles), n), TACKLES_PER90_MAX);
  const interceptions = normalize(per90(safeNumber(p.interceptions), n), INTERCEPTIONS_PER90_MAX);
  const blocks = normalize(per90(safeNumber(p.blocks), n), BLOCKS_PER90_MAX);
  const clearances = normalize(per90(safeNumber(p.clr), n), CLEARANCES_PER90_MAX);
  const aerials = normalize(per90(safeNumber(p.aerialsWon), n), AERIALS_WON_PER90_MAX);
  const tackleSuccess = normalize(safeNumber(p.tklPerce), TACKLE_SUCCESS_MAX);
  const defThirdTouches = normalize(per90(safeNumber(p.defThirdTouches), n), DEF_THIRD_TOUCHES_PER90_MAX);

  return Math.min(100, Math.round(
    tackles * 0.20 +
    interceptions * 0.13 +
    blocks * 0.18 +
    clearances * 0.17 +
    aerials * 0.17 +
    tackleSuccess * 0.10 +
    defThirdTouches * 0.10
  ));
};

// ✅ Accept id as prop instead of useParams
const AttributeRating = ({ id }) => {

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch player data using the id prop
  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:8080/api/scouting/players/${id}`);

        if (res.ok) {
          const data = await res.json();
          setPlayer(data);
        } else {
          setError(`Failed to fetch player (${res.status})`);
        }
      } catch (err) {
        console.error("Network error:", err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPlayer();
  }, [id]);

  // Calculate all stats
  const attacking = player ? calculateAttacking(player) : 0;
  const creativity = player ? calculateCreativity(player) : 0;
  const passing = player ? calculatePassing(player) : 0;
  const dribbling = player ? calculateDribbling(player) : 0;
  const defending = player ? calculateDefending(player) : 0;

  const attributes = [
    { name: "Attacking", value: attacking, color: "#d0cdcd" },
    { name: "Dribbling", value: dribbling, color: "#d0cdcd" },
    { name: "Creativity", value: creativity, color: "#d0cdcd" },
    { name: "Passing", value: passing, color: "#d0cdcd" },
    { name: "Defending", value: defending, color: "#d0cdcd" },
  ];

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.panel}>
      <h3 className={styles.panelTitle}>Attribute Ratings</h3>
      <div className={styles.attributesList}>
        {attributes.map((attr, i) => (
          <div key={i} className={styles.barRow}>
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
            <span className={styles.attrValue} style={{ color: "#FFFFFF" }}>
              {attr.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributeRating;