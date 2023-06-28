import React, { useState, useEffect } from 'react';
import './App.css';
import { IPInfo } from 'react-ip';

function App() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [day, setDay] = useState('');
  const [date, setDate] = useState('');
  const [numDays, setNumDays] = useState('');
  const [backgroundIndex, setBackgroundIndex] = useState(0);

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
    fetch('http://worldtimeapi.org/api/ip')
      .then((res) => res.json())
      .then((data) => {
        const time = new Date(data.datetime);
        setCurrentTime(time.toLocaleTimeString());
        setTimeZone(data.timezone);
        setDay(data.day_of_week);
        setDate(data.day_of_month);
        setNumDays(data.day_of_year);
      });
  };

  const changeBackground = () => {
    setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
  };

  useEffect(() => {
    fetchNewQuote(); // Fetch initial quote
    fetchCurrentTime(); // Fetch current time

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
      <IPInfo>
        {(ip) => (
          <div>
            <div className="clock">
              <h2 id="time">{currentTime}</h2>
            </div>
            <div className="quote">
              <h2>{quote}</h2>
              <small>- {author} -</small>
            </div>
            <div className="user-info">
              <p>Location: {ip.city}, {ip.region}, {ip.country_name}</p>
              <p>Time Zone: {timeZone}</p>
              <p>Day: {day}</p>
              <p>Date: {date}</p>
              <p>Number of Days: {numDays}</p>
            </div>
          </div>
        )}
      </IPInfo>
    </div>
  );
}

export default App;
