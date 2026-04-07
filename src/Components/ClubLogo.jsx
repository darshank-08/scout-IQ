import { useState } from 'react';
import { getClubLogo } from '../utils/clubLogos';
import styles from './ClubLogo.module.css';

const ClubLogo = ({ league, club, size = 'medium', className = '' }) => {
  const [imageError, setImageError] = useState(false);
  
  const logoPath = getClubLogo(league, club);
  const defaultLogo = '/assets/clubs/default-club.svg'; // Create a default placeholder

  const sizeClasses = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  return (
    <img
      src={imageError ? defaultLogo : logoPath}
      alt={`${club} logo`}
      className={`${styles.clubLogo} ${sizeClasses[size]} ${className}`}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};

export default ClubLogo;