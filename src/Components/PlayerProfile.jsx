import React from 'react';
import styles from './PlayerProfile.module.css';

const PlayerProfile = ({ data }) => {
  if (!data) return null;
  // console.log(data);

  const formatPositions = (posString) => posString?.replace(/,/g, ', ');

  const statsList = [
    { label: 'Name', value: data.name },
    { label: 'Nation', value: data.nation },
    { label: 'Age', value: data.age },
    { label: 'Position', value: formatPositions(data.position) },
    { label: 'Preferred Foot', value: data.preferredFoot },
    { label: 'Role', value: data.role },
    { label: 'Club', value: data.clubName },
    { label: 'League', value: data.league },
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