import {jarallax} from 'jarallax';

// Select all elements with the class 'grid-parallax'
const parallaxElements = document.querySelectorAll('.grid-parallax');

// Initialize jarallax if there are any elements found
if (parallaxElements.length) {
  jarallax(parallaxElements, {
    speed: 0.5,
    imgPosition: '100%'
  });
}
