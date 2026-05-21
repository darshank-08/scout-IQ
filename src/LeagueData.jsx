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
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState("LIVE")

  switch (name) {
    case "Premier League":
      var country = "England";
      var start = "2025/08/15";
      var end = "2026/05/24";
      var img = "../public/assets/leagues/PL.jpg";
      break;
    case "La Liga":
      var country = "Spain";
      var start = "2025/08/16";
      var end = "2026/05/24";
      var img = "../public/assets/leagues/LaLiga.jpg";
      break;
    case "Bundesliga":
      var country = "Germany";
      var start = "2025/08/22";
      var end = "2026/05/16";
      var img = "../public/assets/leagues/Bundesliga.jpg";
      break;
    case "Serie A":
      var country = "Italy";
      var start = "2025/08/15";
      var end = "2026/05/24";
      var img = "../public/assets/leagues/Serie_A.jpg";
      break;
    case "Ligue 1":
      var country = "France"; 
      var start = "2025/08/23";
      var end = "2026/05/24";
      var img = "../public/assets/leagues/Ligue_1.jpg";
      break;
    default:
      var country = "Unknown";
  }

useEffect(() => {
  const playersData = async () =>{
    
    var league = name;
    const API = import.meta.env.VITE_API_BASE_URL;

    const res = await fetch(`${API}/api/scouting/playersByLeague/${league}`,
    {
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

  const nameQuery = (e) => {
    setQuery(e.target.value);
  };

  const handleFixtureChange = (value) => {
    setStatus(value);
  }

return (
  <div className={styles.dashboard}>
    <div className={styles["dashboard-container"]}>

      <div className={styles.header}>
        <div className={styles.content}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{name}</h1>
            <img  src={img} alt={name} />
          </div>
          <p className={styles.subtitle}>
            {country}
            <img className={styles.flag} src={`../public/assets/country/${country}.jpg`} alt={country} />
          </p>

          <p className={styles.dates}>{start ?? "N/A"} - {end ?? "N/A"}</p>
        </div>


        {selectedFilter === 'players' ? 
         <div className="search-area">
          
          <input
            type="text"
            className={styles.nameInput}
            onChange={nameQuery}
            value={query}
            placeholder="Search player..."
          />
        </div>       
        : ""}


      </div>

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
          <span className={selectedFilter === 'players' ? styles.on : styles.off}>
            {selectedFilter === 'players' && players.length}

            {selectedFilter === 'fixtures' && (
              <select 
                className={styles.dropdown} 
                onChange={(e) => handleFixtureChange(e.target.value)}
              >
                <option value="LIVE">Live</option>
                <option value="SCHEDULED">Upcoming</option>
                <option value="FINISHED">Completed</option>
              </select>
            )}
          </span>
        </div>

        {selectedFilter === 'table' ? <Table name={name}/> :
         selectedFilter === 'players' ? <LeaguePlayers name={name} query={query} players={players}/>:
         selectedFilter === 'fixtures' ? <Fixture name={name} title={"league"} FixStatus={status}/>: 'table'}

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