import React, { useState } from 'react'
import styles from "./PositionsCard.module.css"
import { useNavigate } from 'react-router-dom'

const Positions = () => {

  const navigate = useNavigate(); 

  const pos = [
    { id: 1, position: 'Goalkeeper', img: "/assets/positions/GK.jpg" },
    { id: 2, position: 'Defender', img: "/assets/positions/RAMOS.jpg" },
    { id: 3, position: 'Midfielder', img: "/assets/positions/LUKA.jpg" },
    { id: 4, position: 'Forward', img: "/assets/positions/CR7.jpg" }
  ];

  const [filteredPositions, setFilteredPositions] = useState(pos);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
  
    query.length > 0 
      ? setFilteredPositions(pos.filter(item => item.position.toLowerCase().includes(query))) 
      : setFilteredPositions(pos);
  }

  return (
    <div className={styles.PositionsContainer}>
    
      <div className={styles.search}>
        <input type="text" placeholder='Search for Positions' onChange={handleSearch}/>
      </div>

      <div className={styles.grid}>
        {filteredPositions.length > 0 ? (
          filteredPositions.map((item) => (
            <article key={item.id} className={styles.card}>
              <img src={item.img} alt={item.position} />

              <div className={styles.action}>
                <h3>{item.position}</h3>
                <button onClick={() => navigate(`/positions/${item.position}`)}>
                  View
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className={styles.noResults}>No positions found</p>
        )}
      </div>
    </div>
  )
}

export default Positions;