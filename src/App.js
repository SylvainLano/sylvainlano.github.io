import React, { useState } from 'react';
import './App.css';
import BackgroundBlur from './BackgroundBlur';

function App() {
  const [backgroundText, setBackgroundText] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [refreshBackgroundTimer, setRefreshBackgroundTimer] = useState(0);
  const framesBeforeBackgroundRefresh = 4;
  const [newWordsStep, setNewWordStep] = useState(0);
  const stepsBeforeAddingNewWordToBackground = 5;
  const maxWordsToAdd = 80;
  const [randomBackgroundWords, setRandomBackgroundWords] = useState([]);
  const [functionNames, setFunctionNames] = useState([
    'handleClick',
    'handleChange',
    'render',
    'componentDidMount',
    'componentDidUpdate',
    'componentWillUnmount',
    'useState',
    'useEffect',
    'useContext',
    'useReducer',
    'useRef',
    'props',
    'state',
    'children',
    'createElement',
    'Fragment',
    'createContext',
    'useMemo',
    'useCallback',
    'useLayoutEffect',
    'forwardRef',
    'createRef',
    'createContext',
    'cloneElement',
    'Children',
  ]);
  const [qualityNames, setQualityNames] = useState([
    'passionate',
    'creative',
    'problem&nbsp;solving',
    'analytical',
    'detail&nbsp;oriented',
    'autonomous',
    'adaptable',
    'critical&nbsp;thinker',
    'self&nbsp;motivated',
    'time&nbsp;management',
    'continuous&nbsp;learner',
    'patient',
    'organized',
    'innovative',
    'collaborative',
    'technical&nbsp;expertise',
    'debugging&nbsp;skills',
    'version&nbsp;control'
  ]);
  const [technologyNames, setTechnologyNames] = useState([
    'Java',
    'Maven',
    'Java&nbsp;Shading',
    'JavaFX',
    'ProGuard',
    'PHP',
    'React',
    'Three.js',
    'React.three.fiber',
    'Javascript',
    'Typescript',
    'Node.js',
    'CSS',
    'Gson',
    'Angular',
    'MariaDB',
    'Docker',
    'Hibernate',
    'MongoDB',
    'Cucumber'
  ]);

  // Function to choose a random React function names to display in the background
  const chooseRandomFunctionNames = () => {
    const randomIndex = Math.floor(Math.random() * functionNames.length);
    const selectedFunction = functionNames[randomIndex];
  
    // Create a new array without the selected quality
    const updatedFunctionNames = functionNames.filter((name, index) => index !== randomIndex);
  
    // Update the state with the new array
    setFunctionNames(updatedFunctionNames);
  
    return selectedFunction;
  };

  // Function to choose a random quality to display in the background
  const chooseRandomQuality = () => {
    const randomIndex = Math.floor(Math.random() * qualityNames.length);
    const selectedQuality = qualityNames[randomIndex];
  
    // Create a new array without the selected quality
    const updatedQualityNames = qualityNames.filter((name, index) => index !== randomIndex);
  
    // Update the state with the new array
    setQualityNames(updatedQualityNames);
  
    return selectedQuality;
  };

  // Function to choose a random technology to display in the background
  const chooseRandomTechnology = () => {
    const randomIndex = Math.floor(Math.random() * technologyNames.length);
    const selectedTechnology = technologyNames[randomIndex];
  
    // Create a new array without the selected quality
    const updatedTechnologyNames = technologyNames.filter((name, index) => index !== randomIndex);
  
    // Update the state with the new array
    setTechnologyNames(updatedTechnologyNames);
  
    return selectedTechnology;
  };  

  // Function to add words in the background
  const addWordsInBackgroundText = (randomText) => {
    setNewWordStep ((prevNewWordsStep) => prevNewWordsStep + 1);
    
    // Replace the random part of the text with the random function name
    randomBackgroundWords.forEach(({ text, position, length }) => {
      randomText =
        randomText.substring(0, position) +
        text +
        randomText.substring(position + length);
    });

    if ( randomBackgroundWords.length < maxWordsToAdd && newWordsStep > stepsBeforeAddingNewWordToBackground ) {

      setNewWordStep (0);

      // Generate a random starting index
      let positionToAddWord = Math.floor(Math.random() * randomText.length);
      while ( isPositionWithinSpan(randomText, positionToAddWord) ) {
        positionToAddWord = Math.floor(Math.random() * randomText.length);
      }
      
      let newWord = {};
      if ( randomBackgroundWords.length < maxWordsToAdd / 4 || randomBackgroundWords.length % 3 == 0 ) {

        // Choose a random React function name
        const randomFunctionName = chooseRandomFunctionNames();

        // Create an object representing the text and position
        newWord = {
          text: `<span class="function-name">${randomFunctionName}</span>`,
          position: positionToAddWord,
          length: randomFunctionName.length
        };

      } else if ( randomBackgroundWords.length % 3 == 1 ) {

        const randomQualityName = chooseRandomQuality();
        let adjustedLength = randomQualityName.length;

        if (randomQualityName.includes("&nbsp;")) {
          adjustedLength -= 5;
        }

        newWord = {
          text: `<span class="quality-name">${randomQualityName}</span>`,
          position: positionToAddWord,
          length: adjustedLength
        };
      } else {

        const randomTechnologyName = chooseRandomTechnology();
        let adjustedLength = randomTechnologyName.length;

        if (randomTechnologyName.includes("&nbsp;")) {
          adjustedLength -= 5;
        }

        newWord = {
          text: `<span class="technology-name">${randomTechnologyName}</span>`,
          position: positionToAddWord,
          length: adjustedLength
        };

      }
      
      setRandomBackgroundWords((prevRandomBackgroundWords) => prevRandomBackgroundWords.concat([newWord]));
    }

    return randomText;
  };

  // Function to avoid the overlapping of words in the background
  function isPositionWithinSpan(htmlText, position) {
    const spanStartRegex = new RegExp(`<span\\s+class=["'][^"']*["'][^>]*>`, 'g');
    const spanEndRegex = /<\/span>/g;
  
    const spanStartPositions = [];
    const spanEndPositions = [];
  
    let match;
    while ((match = spanStartRegex.exec(htmlText)) !== null) {
      spanStartPositions.push(match.index);
    }

    while ((match = spanEndRegex.exec(htmlText)) !== null) {
      spanEndPositions.push(match.index + match.length);
    }
  
    for (let i = 0; i < spanStartPositions.length; i++) {
      if (position+30 >= spanStartPositions[i] && position-5 < spanEndPositions[i]) {
        return true;
      }
    }
  
    return false;
  }  
    
  // Function to update the background text when the mouse moves
  const handleMouseMove = (e) => {
    setRefreshBackgroundTimer ((prevRefreshBackgroundTimer) => prevRefreshBackgroundTimer + 1);
    if ( refreshBackgroundTimer > framesBeforeBackgroundRefresh ) {
      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let randomText = Array.from({ length: 2500 }, () =>
      characters.charAt(Math.floor(Math.random() * 86))
      ).join('');
      randomText = addWordsInBackgroundText(randomText);
      setBackgroundText(randomText);
      setRefreshBackgroundTimer (0);
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
      <div
        className={`background-text ${showInfo ? 'blur-background' : ''}`}
        style={{ zIndex: -1,
          width: `${window.innerWidth + 10}px`,
          height: `${window.innerHeight + 30}px`}}
        dangerouslySetInnerHTML={{ __html: backgroundText }}
      >
      </div>
      <BackgroundBlur />
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
