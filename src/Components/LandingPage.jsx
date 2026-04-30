import React from 'react'
import styles from "./LandingPage.module.css";
import logo from "../../public/assets/leagues/UCL_logo.png";
import { useNavigate } from 'react-router-dom';

const LandingPage = ({ setCurrent }) => {
  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <img className={styles.logo} src={logo} alt="logo" />

        <p className={styles.heroText}>
          {["Welcome to Scout IQ", "Your ultimate player scouting platform !"].map(
            (line, lineIndex) => (
              <span key={lineIndex} className={styles.line}>
                {line.split(" ").map((word, wordIndex) => (
                  <span key={wordIndex} className={styles.word}>
                    {word}&nbsp;
                  </span>
                ))}
                <br />
              </span>
            )
          )}
        </p>

        <p className={styles.subtitle2}>
          Find, Compare, and Evaluate Players Like Never Before
        </p>

        <button 
          className={styles.ctaButton} 
          onClick={() => setCurrent("leagues")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage