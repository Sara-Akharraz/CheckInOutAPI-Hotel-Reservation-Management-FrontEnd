import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarNav from '../components/SideBar';
import Header from '../components/Header';
import '../styles/Dashboard.css'; 
import '../styles/react-calender.css';
import '../styles/react-clock.css';
import Calendar from 'react-calendar';
import { TfiKey } from 'react-icons/tfi';
import { RiDoorOpenFill } from 'react-icons/ri';
import { VscOutput } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

import ReactClock from 'react-clock'; 

const Dashboard = () => {
  const [stats, setStats] = useState({ reservations: 0, checkins: 0, checkouts: 0 });
  const [weather, setWeather] = useState(null);
  const [user, setUser] = useState({ nom: '', prenom: '' });
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios.get('/api/reservation/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));

    axios.get('/api/user/profile')
      .then(res => setUser(res.data))
      .catch(err => console.error(err));

    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const city = 'Agadir';
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
      .then(res => {
        const data = res.data;
        setWeather({
          temp: data.main.temp,
          description: data.weather[0].description,
          icon: data.weather[0].icon
        });
      })
      .catch(err => console.error("Weather API Error:", err));
  }, []);

  return (
    <div className="container">
      <Header />
      <div className="right-side">
        <SidebarNav />
        <div className="content">
          <h2 className="welcome">Bonjour, {user.prenom} {user.nom}</h2>

          <div className="dashboard-grid">
            <div className="left-panel">
              <div className="weather-card large">
                <h3>Météo à Agadir</h3>
                {weather ? (
                  <div className="weather-info">
                    <img 
                      src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                      alt="weather icon" 
                      style={{ width: '50px', height: '50px' }}
                    />
                    <p>{weather.temp}°C - {weather.description}</p>
                  </div>
                ) : <p>Chargement météo...</p>}
              </div>

              <div className="cards-row">
                <div className="card-dash stat-card" onClick={() => navigate('/reservations')}>
                  <TfiKey className="icon-dash" />
                  <div>
                    <h4>Réservations</h4>
                    <p>{stats.reservations}</p>
                  </div>
                </div>

                <div className="card-dash stat-card" onClick={() => navigate('/checkin')}>
                  <RiDoorOpenFill className="icon-dash" />
                  <div>
                    <h4>Check-ins</h4>
                    <p>{stats.checkins}</p>
                  </div>
                </div>

                <div className="card-dash stat-card" onClick={() => navigate('/checkout')}>
                  <VscOutput className="icon-dash" />
                  <div>
                    <h4>Check-outs</h4>
                    <p>{stats.checkouts}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel (Clock + Calendar) */}
            <div className="right-panel">
              <div className="clock-calendar-card">
                {/* <div className="clock">
                  <ReactClock value={value} size={150} renderNumbers />
                </div> */}
                <div className="calendar">
                  <Calendar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
