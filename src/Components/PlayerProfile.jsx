import React from 'react';
import styles from './PlayerProfile.module.css';

const PlayerProfile = ({ data }) => {
  if (!data) return null;

  const formatPositions = (posString) => posString?.replace(/,/g, ', ');

  const formatText = (text) =>
  text.replace(/\b\w/g, char => char.toUpperCase());

  const statsList = [
    { label: 'Name', value: data.name? data.name : 'N/A' },
    { label: 'Nation', value: data.nation? data.nation : 'N/A' },
    { label: 'Age', value: data.age? data.age : 'N/A' },
    { label: 'Position', value: formatPositions(data.position) },
    { label: 'Preferred Foot', value: data.preferredFoot? data.preferredFoot : 'N/A' },
    { label: 'Role', value: formatText(data.role) },
    { label: 'Club', value: data.clubName? data.clubName : 'N/A' },
    { label: 'League', value: data.league? data.league : 'N/A' },
  ];

  return (
    <div className={styles.playerProfile}>
      <h2 className={styles.title}>Player Info</h2>
      <div className={styles.statsList}>
        {statsList.map((stat, index) => (
          <div
            key={stat.label}
            className={`${styles.statRow} ${
              index !== statsList.length - 1 ? styles.statRowBorder : ''
            }`}
          >
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerProfile;