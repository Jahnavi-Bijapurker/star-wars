import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [planets, setPlanets] = useState([]);
  const [nextPage, setNextPage] = useState(null);

  useEffect(() => {
    fetchPlanets('https://swapi.dev/api/planets/?format=json');
  }, []);

  const fetchPlanets = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    setPlanets(data.results.slice(0, 5)); 
    setNextPage(data.next);
  };

  const fetchMorePlanets = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    setPlanets(prevPlanets => [...prevPlanets, ...data.results.slice(0, 5)]); 
    setNextPage(data.next);
  };

  const fetchResidents = async (residents) => {
    const residentsData = await Promise.all(
      residents.map(async (residentUrl) => {
        const response = await fetch(residentUrl);
        return await response.json();
      })
    );
    return residentsData;
  };

  const handleLoadMore = () => {
    if (nextPage) {
      fetchMorePlanets(nextPage);
    }
  };

  return (
    <div className="App">
      <h1>Star Wars Planets Directory</h1>
      <div className="planets">
        {planets.map((planet, index) => (
          <div key={index} className="planet-card">
            <h2>{planet.name}</h2>
            <p>Climate: {planet.climate}</p>
            <p>Population: {planet.population}</p>
            <p>Terrain: {planet.terrain}</p>
            <h3>Residents:</h3>
            <ul>
              {planet.residents.length > 0 ? (
                <Residents residents={planet.residents} fetchResidents={fetchResidents} />
              ) : (
                <li>No residents</li>
              )}
            </ul>
          </div>
        ))}
      </div>
      {nextPage && (
        <button onClick={handleLoadMore}>Load More</button>
      )}
    </div>
  );
}

const Residents = ({ residents, fetchResidents }) => {
  const [residentData, setResidentData] = useState([]);

  useEffect(() => {
    fetchResidents(residents).then((data) => setResidentData(data));
  }, [residents, fetchResidents]);

  return (
    <>
      {residentData.map((resident, index) => (
        <li key={index}>
          Name: {resident.name}, Height: {resident.height}, Mass: {resident.mass}, Gender: {resident.gender}
        </li>
      ))}
    </>
  );
};

export default App;
