import React, { useState, useRef } from 'react';
import './App.css';
import BackgroundText from './components/BackgroundText';
import BackgroundBlur from './components/BackgroundBlur';
import ThreeBackground from './components/ThreeBackground';

function App() {
  const backgroundTextRef = useRef(null);
  const [showInfo, setShowInfo] = useState(false);
    
  // Function to update the background text when the mouse moves
  const handleMouseMove = () => {
    // Call the nextStep method of the ChildComponent
    if (backgroundTextRef.current) {
      backgroundTextRef.current.nextStep();
    }
  };

  // Function to toggle the display of the info box
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div
      className="App"
      onMouseMove={handleMouseMove}
      onClick={toggleInfo}
    >
      <ThreeBackground />
      <div className="info-box">
        {showInfo && (
          <div className="full-display">
            <h2 style={{ display: 'inline-block', marginRight: '10px' }}>Sylvain Lano</h2>
            <span style={{ display: 'inline-block' }}>- Software Engineer</span>
            <h3>Personnal projects:</h3>
            <ol>
              <li>
                <a href="http://sylvainlano.github.io/EvolvingBoids/index.html">Evolving Boids</a> - Angular.ts & SASS
              </li>
              <li>
                <a href="http://sylvainlano.github.io/VoyageVue/index.html">Voyage Vue</a> - Vue.js & TailwindCSS
              </li>
              <li>
                <a href="http://sylvainlano.github.io/GravityStar/index.html">Gravity Star</a> - React.three.fiber
              </li>
              <li>
                <a href="http://sylvainlano.github.io/HexaSnake/index.html">Hexagonal Snake</a> - Vanilla JavaScript
              </li>
              <li>
                <a href="http://sylvainlano.github.io/PlanetRescue/index.html">Planet Rescue</a> - Old 2010 Javascript
              </li>
            </ol>
          </div>
        )}
        {!showInfo && (
          <div className="empty-display">
            <h2>Sylvain Lano</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
