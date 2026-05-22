import React from 'react'
import styles from "./Country.module.css"
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa';

const Country = () => {

  const countries = [
    { id: 1,  country: 'ARG', img: "https://flagsapi.com/AR/flat/64.png"},
    { id: 2,  country: 'FRA', img: "https://flagsapi.com/FR/flat/64.png"},
    { id: 3,  country: 'ESP', img: "https://flagsapi.com/ES/flat/64.png"},
    { id: 4,  country: 'ENG', img: "https://flagsapi.com/GB/flat/64.png"},
    { id: 5,  country: 'BRA', img: "https://flagsapi.com/BR/flat/64.png"},
    { id: 6,  country: 'BEL', img: "https://flagsapi.com/BE/flat/64.png"},
    { id: 7,  country: 'NED', img: "https://flagsapi.com/NL/flat/64.png"},
    { id: 8,  country: 'POR', img: "https://flagsapi.com/PT/flat/64.png"},
    { id: 9,  country: 'ITA', img: "https://flagsapi.com/IT/flat/64.png"},
    { id: 10, country: 'COL', img: "https://flagsapi.com/CO/flat/64.png"},
    { id: 11, country: 'CRO', img: "https://flagsapi.com/HR/flat/64.png"},
    { id: 12, country: 'GER', img: "https://flagsapi.com/DE/flat/64.png"},
    { id: 13, country: 'MAR', img: "https://flagsapi.com/MA/flat/64.png"},
    { id: 14, country: 'URU', img: "https://flagsapi.com/UY/flat/64.png"},
    { id: 15, country: 'SUI', img: "https://flagsapi.com/CH/flat/64.png"},
    { id: 16, country: 'JPN', img: "https://flagsapi.com/JP/flat/64.png"},
    { id: 17, country: 'SEN', img: "https://flagsapi.com/SN/flat/64.png"},
    { id: 18, country: 'UKR', img: "https://flagsapi.com/UA/flat/64.png"},
    { id: 19, country: 'TUR', img: "https://flagsapi.com/TR/flat/64.png"},
    { id: 20, country: 'SWE', img: "https://flagsapi.com/SE/flat/64.png"},
    { id: 21, country: 'NOR', img: "https://flagsapi.com/NO/flat/64.png"},
    { id: 22, country: 'ALG', img: "https://flagsapi.com/DZ/flat/64.png"},
    { id: 23, country: 'SCO', img: "https://flagsapi.com/GB/flat/64.png"},
    { id: 24, country: 'GHA', img: "https://flagsapi.com/GH/flat/64.png"},
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