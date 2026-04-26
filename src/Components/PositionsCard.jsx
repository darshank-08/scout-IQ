import React from 'react'
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

  return (
    <div className={styles.grid}>
      {pos.map((item) => (
        <article key={item.id} className={styles.card}>
          <img src={item.img} alt={item.position} />

          <div className={styles.action}>
            <h3>{item.position}</h3>
            <button onClick={() => navigate(`/positions/${item.position}`)}>
              View
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default Positions;