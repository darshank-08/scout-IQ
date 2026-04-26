import styles from "./Home.module.css";
import { useState } from "react";
import Navigation from "./Components/Navigation";
import League from "./Components/League";
import Positions from "./Components/PositionsCard";
import Country from "./Country";

function Home() {

  const [current, setCurrent] = useState("leagues");

  return (
    <>
      <Navigation current={current} setCurrent={setCurrent} />

      <section className={styles.app}>
        <div className={styles.container}>

          <div className={styles.netflix_style}>
            <span>|</span>
            <h3 className={styles.sectionTitle}>
              {current.charAt(0).toUpperCase() + current.slice(1)}
            </h3>
          </div>

          {current === "leagues" && <League />}
          {current === "countries" && <Country /> }
          {current === "positions" && <Positions />}
          {current === "search" && <h2>Search Content</h2>}

        </div>
      </section>
    </>
  );
}

export default Home;