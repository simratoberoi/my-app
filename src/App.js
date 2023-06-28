import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

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
    axios.get('http://api.quotable.io/random')
      .then((res) => {
        const { content, author } = res.data;
        setQuote(content);
        setAuthor(author);
      })
      .catch((error) => {
        console.log('Error fetching quote:', error);
      });
  };

  const fetchCurrentTime = () => {
    const time = new Date().toLocaleTimeString();
    setCurrentTime(time);
  };

  const fetchLocationData = () => {
    axios.get('https://geolocation-db.com/json/')
      .then((res) => {
        setLocationData(res.data);
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
          <h3>Location: {locationData.city}, {locationData.country_name}</h3>
          <p>Time Zone: {locationData.time_zone}</p>
          <p>Number of Days: {locationData.day_of_week}</p>
          <p>Day: {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
          <p>Date: {new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
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
