import React from 'react'
import styles from "./RadarCompare.module.css"
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
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
    clearances * 0.20 +
    aerials * 0.20 +
    tackleSuccess * 0.10 +
    defThirdTouches * 0.10
  ));

};

const RadarCompare = ({ player1, player2 }) => {


  // Calculate stats for Player 1
  const attacking1  = player1 ? calculateAttacking(player1)  : 0;
  const creativity1 = player1 ? calculateCreativity(player1) : 0;
  const passing1    = player1 ? calculatePassing(player1)    : 0;
  const dribbling1  = player1 ? calculateDribbling(player1)  : 0;
  const defending1  = player1 ? calculateDefending(player1)  : 0;

  // Calculate stats for Player 2
  const attacking2  = player2 ? calculateAttacking(player2)  : 0;
  const creativity2 = player2 ? calculateCreativity(player2) : 0;
  const passing2    = player2 ? calculatePassing(player2)    : 0;
  const dribbling2  = player2 ? calculateDribbling(player2)  : 0;
  const defending2  = player2 ? calculateDefending(player2)  : 0;


  const radarData = {
    labels: [
    `ATT\n${attacking1}` + " /" + `\n${attacking2}`,
    `DRI\n${dribbling1}` + " /" + `\n${dribbling2}`,
    `CRE\n${creativity1}` + " /" + `\n${creativity2}`,
    `PAS\n${passing1}` + " /" + `\n${passing2}`,
    `DEF\n${defending1}` + " /" + `\n${defending2}`,
    ],
    datasets: [
      // Player 1 Dataset - Blue
      {
        data: [attacking1, dribbling1, creativity1, passing1, defending1],
        
        // Gradient-like fill from cyan to purple (matches image)
        backgroundColor: "rgba(0, 180, 255, 0.25)",
        borderColor: "rgba(0, 200, 255, 0.9)",
        borderWidth: 1.5,

        pointBackgroundColor: "rgba(0, 200, 255, 0.9)",
        pointBorderColor: "rgba(0, 200, 255, 0.9)",
        pointBorderWidth: 0.3,
        pointRadius: 4,
        pointHoverRadius: 9,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(0, 200, 255, 0.9)",
      },
      // Player 2 Dataset - Red
      {
        data: [attacking2, dribbling2, creativity2, passing2, defending2],
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        borderColor: "rgba(239, 68, 68, 0.9)",
        borderWidth: 1.5,
        pointBackgroundColor: "rgba(239, 68, 68, 0.9)",
        pointBorderColor: "rgba(239, 68, 68, 0.9)",
        pointBorderWidth: 0.3,
        pointRadius: 4,
        pointHoverRadius: 9,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(239, 68, 68, 0.9)",
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
        grid: {
          color: "rgba(255, 255, 255, 0.08)",
          lineWidth: 1,
        },
        angleLines: {
          color: "rgba(255, 255, 255, 0.08)",
          lineWidth: 1,
        },
        pointLabels: {
          color: "#cbd5e1",
          font: {
            size: 13,
            weight: "400",
            family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          },
        },
        ticks: {
          display: false,
          stepSize: 20,
          backdropColor: "transparent",
        },
      },
    },
    plugins: {
        legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(10, 15, 30, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#00c8ff",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 14,
        cornerRadius: 10,
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Radar data={radarData} options={radarOptions} />
    </div>
  );
};

export default RadarCompare;