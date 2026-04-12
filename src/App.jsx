import React from 'react'
import { Routes, Route } from 'react-router-dom';
import League from './League'
import Country from './Country';
import LeagueData from './LeagueData';  
import Player from './Player';
import Compare from './Compare';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<League />} />
      <Route path="/countries" element={<Country />} />
      <Route path="/leagues/:name" element={<LeagueData />} />
      <Route path="/player/:id" element={<Player />} />
      <Route path="/compare/:id" element={<Compare />} />
    </Routes>
  )
}

export default App