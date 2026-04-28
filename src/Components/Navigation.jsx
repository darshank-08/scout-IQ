import React from 'react'
import styles from "./Navigation.module.css"
import { IoFlagSharp } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { FaTshirt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";


const Navigation = ({ current, setCurrent }) => {

  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <div className={styles.navInner}>

          <div className={styles.navLogo}>
            <span className={styles.logoText}>Scout IQ</span>
          </div>

          <div className={styles.pages}>

            <button
                className={`${styles.navBtn} ${current === "home" ? styles.active : ""}`}
                onClick={() => setCurrent("home")}
                >
                <IoMdHome size={24} className={styles.icon}/>
                <span className={styles.label}>Home</span>
            </button>

            <button
                className={`${styles.navBtn} ${current === "leagues" ? styles.active : ""}`}
                onClick={() => setCurrent("leagues")}
                >
                <MdGroups size={24} className={styles.icon}/>
                <span className={styles.label}>Leagues</span>
            </button>

            <button
                className={`${styles.navBtn} ${current === "countries" ? styles.active : ""}`}
                onClick={() => setCurrent("countries")}
                >
                <IoFlagSharp size={22} className={styles.icon}/>
                <span className={styles.label}>Countries</span>
            </button>

            <button
                className={`${styles.navBtn} ${current === "positions" ? styles.active : ""}`}
                onClick={() => setCurrent("positions")}
                >
                <FaTshirt size={22} className={styles.icon}/>
                <span className={styles.label}>Positions</span>
            </button>

            <button
                className={`${styles.navBtn} ${current === "search" ? styles.active : ""}`}
                onClick={() => setCurrent("search")}
                >
                <IoSearch size={22} className={styles.icon}/>
                <span className={styles.label}>Search</span>
            </button>

          </div>

        </div>
      </nav>
    </header>
  )
}

export default Navigation