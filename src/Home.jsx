import styles from "./Home.module.css";
import { useState } from "react";
import Navigation from "./Components/Navigation";
import League from "./Components/League";
import Positions from "./Components/PositionsCard";
import Country from "./Country";
import logo from "../public/assets/leagues/UCL_logo.png";

function Home() {

  const [current, setCurrent] = useState("home");

  return (
    <>
      <Navigation current={current} setCurrent={setCurrent} />

      <section className={styles.app}>
        <div className={styles.container}>
          
          {/* SECTION TITLE */}
          {current === "home" ? (
            <div className={styles.heroSection}>
              <img src={logo} alt="logo" />

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

              <button className={styles.ctaButton} onClick={() => setCurrent("leagues")}>
                Get Started
              </button>
            </div>
          ) : (          
            <div className={styles.netflix_style}>
            <span>|</span>
            <h3 className={styles.sectionTitle}>
              {current.charAt(0).toUpperCase() + current.slice(1)}
            </h3>
          </div>)}


          {/* CONTENT */}
          {current === "leagues"   && <League />}
          {current === "countries" && <Country />}
          {current === "positions" && <Positions />}
          {current === "search"    && <Search />}

        </div>
      </section>
    </>
  );
}

export default Home;