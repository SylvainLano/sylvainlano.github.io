import React, { useEffect, useState } from 'react';
import './BackgroundBlur.css'; // Create a separate CSS file for styling

const BackgroundBlur = () => {
    const [circles, setCircles] = useState([]);
    const numCircles = 20; // Number of circles
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
          setPosition({ x: e.clientX, y: e.clientY });
        };
    
        window.addEventListener('mousemove', handleMouseMove);
    
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const { x, y } = position; // Extract x and y from position
        const newCircles = [];

        for (let i = 0; i < numCircles; i++) {
            // Generate sizes for the circles
            const size = 50 + (200/numCircles*i);

            newCircles.push({ x, y, size });
        }

        setCircles(newCircles);
    }, [position]); // Position should be in the dependency array
    

  return (
    <div className="background-blur">
        {circles.map((circle, index) => (
        <div
            key={index}
            className="blur-circle"
            style={{
            top: circle.y,
            left: circle.x,
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            }}
        ></div>
        ))}
    </div>
  );
};

export default BackgroundBlur;
