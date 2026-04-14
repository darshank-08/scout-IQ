import React from 'react'
import styles from "./LeagueData.module.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Table from './Components/Table';
import LeaguePlayers from './Components/LeaguePlayers';
import { Fixture } from './Components/Fixture';

const LeagueData = () => {

  const { name } = useParams();
  const [players, setPlayers] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("players");

  switch (name) {
    case "Premier League":
      var country = "England";
      var start = "2025/08/15";
      var end = "2026/05/24";
      break;
    case "La Liga":
      var country = "Spain";
      var start = "2025/08/16";
      var end = "2026/05/24";
      break;
    case "Bundesliga":
      var country = "Germany";
      var start = "2025/08/22";
      var end = "2026/05/16";
      break;
    case "Serie A":
      var country = "Italy";
      var start = "2025/08/15";
      var end = "2026/05/24";
      break;
    case "Ligue 1":
      var country = "France"; 
      var start = "2025/08/23";
      var end = "2026/05/24";
      break;
    default:
      var country = "Unknown";
  }

useEffect(() => {
  const playersData = async () =>{
    
    var league = name;

      const res = await fetch(`http://localhost:8080/api/scouting/playersByLeague/${league}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      setPlayers(data);
    } else {
      console.error("Failed to fetch players data");
    }


  }
  playersData();}
, [name]);


return (
  <div className={styles.dashboard}>
    <div className={styles["dashboard-container"]}>

      <h1 className={styles.title}>{name}</h1>
      <p className={styles.subtitle}>
        {country}
        <img className={styles.flag} src={`../public/assets/country/${country}.jpg`} alt={country} />
      </p>

      <p className={styles.dates}>{start ?? "N/A"} - {end ?? "N/A"}</p>

      <div className={styles.filterRow}>
        <label
          className={`${styles.filterOption} ${
            selectedFilter === "table" ? styles.active : ""
          }`}
        >
          <input
            type="radio"
            name="filter"
            value="table"
            checked={selectedFilter === "table"}
            onChange={(e) => setSelectedFilter(e.target.value)}
            hidden
          />
          Table
        </label>

        <label
          className={`${styles.filterOption} ${
            selectedFilter === "players" ? styles.active : ""
          }`}
        >
          <input
            type="radio"
            name="filter"
            value="players"
            checked={selectedFilter === "players"}
            onChange={(e) => setSelectedFilter(e.target.value)}
            hidden
          />
          Players
        </label>


        <label
          className={`${styles.filterOption} ${
            selectedFilter === "fixtures" ? styles.active : ""
          }`}
        >
          <input
            type="radio"
            name="filter"
            value="fixtures"
            checked={selectedFilter === "fixtures"}
            onChange={(e) => setSelectedFilter(e.target.value)}
            hidden
          />
          Fixtures
        </label>
      </div>

      <div className={styles.card}>
        
        <div className={styles["card-header"]}>
          <h2>{selectedFilter === 'table' ? "Table" : selectedFilter === 'players' ? 'Players' : selectedFilter === 'fixtures' ? 'Fixtures': 'table'} </h2>
          <span className={styles.count}>
            {selectedFilter === 'table' ? "Table" : selectedFilter === 'players' ? players.length : selectedFilter === 'fixtures' ? 'Fixtures': 'table'}
          </span>
        </div>

        {selectedFilter === 'table' ? <Table name={name}/> :
         selectedFilter === 'players' ? <LeaguePlayers name={name}/>:
         selectedFilter === 'fixtures' ? <Fixture name={name}/>: 'table'}

      </div>

      {selectedFilter === 'players' ?
        <p className={styles.disclaimer}>
          *Player data based on 2024–25 season performance. Player ability may vary beyond these metrics.
        </p> :
        ""
       }
    </div>
  </div>
);
}

export default LeagueData 