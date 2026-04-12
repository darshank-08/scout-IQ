import React from 'react';
import styles from './PhaseStats.module.css';

const PhaseStats = ({ title, data }) => {

  console.log(data)

  // Define stats based on title
  const getStats = () => {
    switch (title) {
      case "Attacking":
        return [
          { label: 'G/A', value: data.gA ?? 'N/A' },
          { label: 'Goals', value: data.goals ?? 'N/A' },
          { label: 'Goals/90', value: data.goalsPer90 ?? 'N/A' },
          { label: 'xG', value: data.xg ?? 'N/A' },
          { label: 'xAG', value: data.xag ?? 'N/A' },
          { label: 'Non Penalty xG', value: data.npxg ?? 'N/A' },
          { label: 'Shots', value: data.shots ?? 'N/A' },
          { label: 'Shots on Target', value: data.shotsOnTarget ?? 'N/A' },
          { label: 'SOT%', value: data.sotPercentage + '%' ?? 'N/A' },
          { label: 'Shots/90', value: data.shotsPer90 ?? 'N/A' },
          { label: 'SOT/90', value: data.sotPer90 ?? 'N/A' },
        ];

      case "Passing":
        return [
          { label: 'Assists', value: data.assists ?? 'N/A' },
          { label: 'Assists/90', value: data.assistsPer90 ?? 'N/A' },
          { label: 'Passes Attempted', value: data.passesAttempted ?? 'N/A' },
          { label: 'Passes Completed', value: data.completedPasses ?? 'N/A' },
          { label: 'Successful Pass Rate', value: data.passComplPerce + '%' ?? 'N/A' },
          { label: 'Key Passes', value: data.keyPasses ?? 'N/A' },
          { label: 'Progressive Passes', value: data.progressivePasses ?? 'N/A' },
          { label: 'Shot Creating Actions', value: data.sca ?? 'N/A' },
          { label: 'SCA/90', value: data.sca90 ?? 'N/A' },
          { label: 'Goal Creating Actions', value: data.gca ?? 'N/A' },
          { label: 'GCA/90', value: data.gca90 ?? 'N/A' },
        ];

      case "Possession & Carries":
        return [
          { label: 'Touches', value: data.touches ?? 'N/A' },
          { label: 'Def 3rd Touches', value: data.defThirdTouches ?? 'N/A' },
          { label: 'Mid 3rd Touches', value: data.midThirdTouches ?? 'N/A' },
          { label: 'Att 3rd Touches', value: data.attThirdTouches ?? 'N/A' },
          { label: 'Carries', value: data.carries ?? 'N/A' },
          { label: 'Progressive Carries', value: data.progressiveCarries ?? 'N/A' },
          { label: 'Progressive Runs', value: data.progressiveRuns ?? 'N/A' },
          { label: 'Carry Distance', value: data.carryDistance ?? 'N/A' },
          { label: 'Prog Carry Distance', value: data.progCarryDistance ?? 'N/A' },
          { label: 'Prog Carries', value: data.progCarriesPerce + '%' ?? 'N/A' },
          { label: 'Dribbles', value: data.dribbles ?? 'N/A' },
          { label: 'Dribbles Completed', value: data.dribblesCompleted + '%' ?? 'N/A' },
        ];

      case "Defensive":
        return [
          { label: 'Tackles', value: data.tackles ?? 'N/A' },
          { label: 'Tackles Won', value: data.tklWon ?? 'N/A' },
          { label: 'Tackle', value: data.tklPerce + '%' ?? 'N/A' },
          { label: 'Interceptions', value: data.interceptions ?? 'N/A' },
          { label: 'Blocks', value: data.blocks ?? 'N/A' },
          { label: 'Clearances', value: data.clr ?? 'N/A' },
          { label: 'Aerials Won', value: data.aerialsWon ?? 'N/A' },
        ];

      case "Discipline":
        return [
          { label: 'Yellow Cards', value: data.yellowCards ?? 'N/A' },
          { label: 'Red Cards', value: data.redCards ?? 'N/A' },
        ];

      case "General":
        return [
          { label: 'Minutes', value: data.minutes ?? 'N/A' },
          { label: 'Matches', value: data.matches ?? 'N/A' },
          { label: '90s Played', value: data.nineties ?? 'N/A' },
        ];

      default:
        return [];
    }
  };

  const stats = getStats();

  return (
    <div className={styles.phaseStats}>
      <h2 className={styles.phaseTitle}>{title}</h2>
      

      <ul className={styles.statsList}>
        {stats.map((stat, index) => (
          <li key={index} className={styles.statRow}>
            <span className={styles.label}>{stat.label}: </span>
            <span className={styles.value}>{stat.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhaseStats;