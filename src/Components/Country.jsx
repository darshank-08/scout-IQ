import React from 'react'
import styles from "./Country.module.css"
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa';

const Country = () => {

  const countries = [
    { id: 1,  country: 'ARG', img: "/public/assets/country/Argentina.jpg"},
    { id: 2,  country: 'FRA', img: "/public/assets/country/France.jpg"},
    { id: 3,  country: 'ESP', img: "/public/assets/country/Spain.jpg"},
    { id: 4,  country: 'ENG', img: "/public/assets/country/England.jpg"},
    { id: 5,  country: 'BRA', img: "/public/assets/country/Brazil.jpg"},
    { id: 6,  country: 'BEL', img: "/public/assets/country/Belgium.jpg"},
    { id: 7,  country: 'NED', img: "/public/assets/country/Netherlands.jpg"},
    { id: 8,  country: 'POR', img: "/public/assets/country/Portugal.jpg"},
    { id: 9,  country: 'ITA', img: "/public/assets/country/Italy.jpg"},
    { id: 10, country: 'COL', img: "/public/assets/country/Colombia.jpg"},
    { id: 11, country: 'CRO', img: "/public/assets/country/Croatia.jpg"},
    { id: 12, country: 'GER', img: "/public/assets/country/Germany.jpg"},
    { id: 13, country: 'MAR', img: "/public/assets/country/Morocco.jpg"},
    { id: 14, country: 'URU', img: "/public/assets/country/Uruguay.jpg"},
    { id: 15, country: 'SUI', img: "/public/assets/country/Switzerland.jpg"},
    { id: 16, country: 'JPN', img: "/public/assets/country/Japan.jpg"},
    { id: 17, country: 'SEN', img: "/public/assets/country/Senegal.jpg"},
    { id: 18, country: 'UKR', img: "/public/assets/country/Ukraine.jpg"},
    { id: 19, country: 'TUR', img: "/public/assets/country/Turkey.jpg"},
    { id: 20, country: 'SWE', img: "/public/assets/country/Sweden.jpg"},
    { id: 21, country: 'NOR', img: "/public/assets/country/Norway.jpg"},
    { id: 22, country: 'ALG', img: "/public/assets/country/Algeria.jpg"},
    { id: 23, country: 'SCO', img: "/public/assets/country/Scotland.jpg"},
    { id: 24, country: 'GHA', img: "/public/assets/country/Ghana.jpg"},
  ];

  const [filteredCountries, setFilteredCountries] = useState(countries);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
  
    query.length > 0 
      ? setFilteredCountries(countries.filter(item => item.country.toLowerCase().includes(query))) 
      : setFilteredCountries(countries);
  }

  return (
    <div className={styles.CountryContainer}>
      <div className={styles.search}>
        <input type="text" placeholder='Search for Country' onChange={handleSearch}/>
      </div>

      <div className={styles.grid}>
        {filteredCountries.length > 0 ? (
          filteredCountries.map((item) => (
            <article key={item.id} className={styles.card}>
              <img src={item.img} alt={item.country} />
              <div className={styles.action}>
                <h3>{item.country}</h3>
                <button onClick={() => navigate(`/National/${item.id}`)}>
                  View
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className={styles.noResults}>No countries found</p>
        )}
      </div>

      <p className={styles.dataNote}>
        <FaInfoCircle className={styles.noteIcon} />
        <span>
          Note: This data is sourced from the top 5 European leagues only. 
          Not all nations are fully represented due to limited data coverage.
        </span>
      </p>  
  </div>
  )
}

export default Country