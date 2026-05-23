import styles from "./Home.module.css";
import { useState } from "react";
import Navigation from "./Components/Navigation";
import League from "./Components/League";
import Positions from "./Components/PositionsCard";
import Country from "./Components/Country";
import LandingPage from "./Components/LandingPage";
import About from "./Components/About";


function Home() {

  const [current, setCurrent] = useState("home");

  return (
    <>
      <Navigation current={current} setCurrent={setCurrent} />

      <section className={styles.app}>
        {current !== "home" && current !== "about" ? (
          <div className={styles.netflix_style}>
            <span>|</span>
            <h3 className={styles.sectionTitle}>
              {current.charAt(0).toUpperCase() + current.slice(1)}
            </h3>
          </div>
        ) : null}
        <div className={styles.content}>

          {/* CONTENT */}
          {current === "home" && <LandingPage setCurrent={setCurrent} />}
          {current === "leagues" && <League />}
          {current === "countries" && <Country />}
          {current === "positions" && <Positions />}
          {current === "about" && <About />}

        </div>
      </section>
    </>
  );
}

export default Home;