// ThreeBackground.js
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShaderPixelatedNeon } from './CustomShaders';

const ThreeBackground = React.memo(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  let cube;
  const material = new THREE.ShaderMaterial({
    uniforms: {
      resolution: { value: new THREE.Vector2() }, // Custom uniform for screen resolution
      time: { value: 0.0 }, // Custom uniform for time
    },
    vertexShader,
    fragmentShader: fragmentShaderPixelatedNeon,
  });

  const createCube = () => {
    const cubeSize = Math.max(window.innerWidth, window.innerHeight); // Normalize to fit within [-1, 1] on the y-axis

    cube = new THREE.Mesh(new THREE.BoxGeometry(cubeSize, cubeSize, 1), material);
    scene.add(cube);
  };

  const animate = () => {
    requestAnimationFrame(animate);

    // Update resolution uniform with current screen dimensions
    material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);

    // Update time uniform
    material.uniforms.time.value += 0.01; // Increment time, adjust as needed

    renderer.render(scene, camera);
  };

  useEffect(() => {
    // Set up Three.js scene

    camera.position.z = 5;
    createCube();

    scene.background = new THREE.Color(0x000000); // Set background color to black
    cube.material = material; // Apply shader material to the cube

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-10';
    document.body.appendChild(renderer.domElement);

    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);

      // Remove existing cube from the scene
      if (cube) {
        scene.remove(cube);
      }

      // Create a new cube with updated size
      createCube();
    };

    window.addEventListener('resize', handleResize);

    // Clean up Three.js scene on component unmount
    return () => {
      document.body.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  });

  return null; // No need for a DOM element in this component
});

export default ThreeBackground;
