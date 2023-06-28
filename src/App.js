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

  const backgroundImages = [
    'url("/images/1.jpg")',
    'url("/images/2.jpeg")',
    'url("/images/3.jpeg")',
    'url("/images/6.jpeg")',
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetch(`https://geolocation-db.com/json/${latitude}:${longitude}`)
          .then((response) => response.json())
          .then((data) => {
            setLocation(data.city);
            setLatitude(data.latitude);
            setLongitude(data.longitude);
            setCountry(data.country_name);
          })
          .catch((error) => {
            console.error('Error fetching location:', error);
          });
      });
    }
  };

  useEffect(() => {
    fetchNewQuote(); // Fetch initial quote
    fetchCurrentTime(); // Set initial time
    getCurrentLocation(); // Fetch location data

    const quoteIntervalId = setInterval(fetchNewQuote, 600000); // Fetch new quote every 10 minutes
    const timeIntervalId = setInterval(fetchCurrentTime, 1000); // Update time every second
    const backgroundIntervalId = setInterval(changeBackground, 600000); // Change background every 10 minutes

    return () => {
      clearInterval(quoteIntervalId); // Clean up quote interval when component unmounts
      clearInterval(timeIntervalId); // Clean up time interval when component unmounts
      clearInterval(backgroundIntervalId); // Clean up background interval when component unmounts
    };
  }, []);

  const appStyle = {
    background: backgroundImages[backgroundIndex],
  };

  return (
    <div className="App" style={appStyle}>
      <div className="clock">
        <h2 id="time">{currentTime}</h2>
      </div>
      {location && (
        <div className="location">
          <h3>Location: {location}</h3>
          <p>Latitude: {latitude}</p>
          <p>Longitude: {longitude}</p>
          <p>Country: {country}</p>
        </div>
      )}
      <div className="quote">
        <h2>{quote}</h2>
        <small>- {author} -</small>
      </div>
    </div>
  );
}

export default App;
