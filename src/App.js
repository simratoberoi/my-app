import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [country, setCountry] = useState('');
  const [isLocationVisible, setLocationVisible] = useState(false);

  const backgroundImages = [
    'url("/images/1.jpg")',
    'url("/images/0.jpeg")',
    'url("/images/3.jpg")',
    'url("/images/4.jpeg")',
    'url("/images/5.jpeg")',
    'url("/images/7.jpeg")',
    'url("/images/8.jpeg")',
    'url("/images/9.jpeg")',
  ];

  const fetchNewQuote = () => {
    fetch('http://api.quotable.io/random')
      .then((res) => res.json())
      .then((data) => {
        setQuote(data.content);
        setAuthor(data.author);
      })
      .catch((error) => {
        console.log('Error fetching quote:', error);
      });
  };

  const fetchCurrentTime = () => {
    const time = new Date().toLocaleTimeString();
    setCurrentTime(time);
  };

  const changeBackground = () => {
    setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
  };

  const getCurrentLocation = () => {

    const mockLocation = {
      city: 'Mock City',
      latitude: 'Mock Latitude',
      longitude: 'Mock Longitude',
      country_name: 'Mock Country',
    };

    setLocation(mockLocation.city);
    setLatitude(mockLocation.latitude);
    setLongitude(mockLocation.longitude);
    setCountry(mockLocation.country_name);
  };

  useEffect(() => {
    fetchNewQuote();
    fetchCurrentTime();
    getCurrentLocation();

    const quoteIntervalId = setInterval(fetchNewQuote, 600000);
    const timeIntervalId = setInterval(fetchCurrentTime, 1000);
    const backgroundIntervalId = setInterval(changeBackground, 600);

    return () => {
      clearInterval(quoteIntervalId);
      clearInterval(timeIntervalId);
      clearInterval(backgroundIntervalId);
    };
  }, []);

  const appStyle = {
    background: backgroundImages[backgroundIndex],
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  const toggleLocationVisible = () => {
    setLocationVisible((prevState) => !prevState);
  };

  return (
    <div className="App" style={appStyle}>
      <div className="clock">
        <h2 id="time">{currentTime}</h2>
      </div>
      <div
        className="location"
        onMouseEnter={toggleLocationVisible}
        onMouseLeave={toggleLocationVisible}
      >
        <button className="location-button">&#x25BC;</button>
        {isLocationVisible && (
          <div className="location-details">
            <h3>Location: {location}</h3>
            <p>Latitude: {latitude}</p>
            <p>Longitude: {longitude}</p>
            <p>Country: {country}</p>
          </div>
        )}
      </div>
      <div className="quote">
        <h2>{quote}</h2>
        <small>- {author} -</small>
      </div>
    </div>
  );
}

export default App;
