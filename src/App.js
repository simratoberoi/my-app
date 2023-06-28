import React, { useState, useEffect } from 'react';
import './App.css';
import GeolocationDB from 'geolocation-db';

function App() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [locationData, setLocationData] = useState(null);

  const backgroundImages = [
    'url("/src/1.jpg")',
    'url("/src/2.jpeg")',
    'url("/src/3.jpeg")',
    'url("/src/4.webp")',
    'url("/src/6.jpeg")',
  ];

  const fetchNewQuote = () => {
    fetch('http://api.quotable.io/random')
      .then((res) => res.json())
      .then((quote) => {
        setQuote(quote.content);
        setAuthor(quote.author);
      });
  };

  const fetchCurrentTime = () => {
    const time = new Date().toLocaleTimeString();
    setCurrentTime(time);
  };

  const fetchLocationData = () => {
    GeolocationDB.get()
      .then((response) => {
        setLocationData(response);
      })
      .catch((error) => {
        console.log('Error fetching location data:', error);
      });
  };

  const changeBackground = () => {
    setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
  };

  useEffect(() => {
    fetchNewQuote(); // Fetch initial quote
    fetchCurrentTime(); // Set initial time
    fetchLocationData(); // Fetch location data

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
      {locationData && (
        <div className="location">
          <h3>Location: {locationData.country_name}, {locationData.state}</h3>
          <p>Time Zone: {locationData.time_zone}</p>
          <p>Number of Days: {locationData.day_of_year}</p>
          <p>Day: {locationData.day_of_week}</p>
          <p>Date: {locationData.current_date}</p>
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
