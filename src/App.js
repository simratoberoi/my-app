import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const backgroundImages = [
    'url("/my-app/src/images/1.jpg")',
    'url("/my-app/src/images/2.jpeg")',
    'url("/my-app/src/images/3.jpeg")',
    'url("/my-app/src/images/4.webp")',
    'url("/my-app/src/images/6.jpeg")',
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
            <div className="clock">
        <h2 id="time">{currentTime}</h2>
      </div>
      <div className="quote">
        <h2>{quote}</h2>
        <small>- {author} -</small>
      </div>
    </div>
  );
}

export default App;
