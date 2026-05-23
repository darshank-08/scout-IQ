import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LeagueData from './LeagueData';  
import Player from './Player';
import Compare from './Compare';
import Positions from './Positions';
import Home from './Home';
import Countries from './Components/Country';
import CountryPlayers from './CountryPlayers';
import About from './Components/About';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/countries" element={<Countries />} />
      <Route path="/leagues/:name" element={<LeagueData />} />
      <Route path="/player/:id" element={<Player />} />
      <Route path="/compare/:id" element={<Compare />} />
      <Route path="/positions/:position" element={<Positions />}></Route>
      <Route path="/National/:id" element={<CountryPlayers />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App