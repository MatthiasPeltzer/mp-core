/**
 * Parallax Effects Module
 * Initializes jarallax for parallax scrolling effects
 */

import { jarallax } from 'jarallax';

const parallaxElements = document.querySelectorAll('.grid-parallax');

if (parallaxElements.length) {
  jarallax(parallaxElements, {
    speed: 0.5,
    imgPosition: '100%'
  });
}
