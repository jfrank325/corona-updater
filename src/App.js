import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import CanvasJSReact from './canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function App() {
  const [state, setState] = useState({
    confirmed: 0,
    recovered: 0,
    deaths: 0,
    countries: [],
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await axios('https://covid19.mathdro.id/api');
    const resCountries = await axios('https://covid19.mathdro.id/api/countries');
    const { confirmed, recovered, deaths } = res.data;
    const countries = Object.values(resCountries.data.countries);
    console.log('country response', resCountries);
    console.log('full response', res);
    setState(() => ({
      ...state,
      confirmed: confirmed.value,
      recovered: recovered.value,
      deaths: deaths.value,
      countries,
    }));
  };

  const getCountriesData = async (event) => {
    const res = await axios(`https://covid19.mathdro.id/api/countries/${event.target.value}`);
    const { confirmed, recovered, deaths } = res.data;
    setState({ ...state, confirmed: confirmed.value, recovered: recovered.value, deaths: deaths.value });
  };

  const countryOptions = () => {
    return state.countries.map((country, index) => {
      return <option key={index}>{country.name}</option>;
    });
  };

  const options = {
    animationEnabled: true,
    // exportEnabled: true,
    theme: 'light1', // "light1", "dark1", "dark2"
    title: {
      text: 'Ratios',
    },
    data: [
      {
        type: 'pie',
        indexLabel: '{label}: {y}',
        startAngle: 0,
        dataPoints: [
          { y: state.confirmed, label: 'Confirmed' },
          { y: state.deaths, label: 'Deaths' },
          { y: state.recovered, label: 'Recovered' },
        ],
      },
    ],
  };

  return (
    <div className="container">
      <h1>Corona Country Comparison</h1>

      <select className="select" placeholder="World" onChange={getCountriesData}>
        {countryOptions()}
      </select>
      <div>
        <CanvasJSChart options={options} />
      </div>
      <div className="flex">
        <div className="box confirmed">
          <h3>Confirmed Cases</h3>
          <h4>{state.confirmed}</h4>
        </div>
        <div className="box recovered">
          <h3>Recovered</h3>
          <h4>{state.recovered}</h4>
        </div>
        <div className="box deaths">
          <h3>Deaths</h3>
          <h4>{state.deaths}</h4>
        </div>
      </div>
    </div>
  );
}

export default App;
