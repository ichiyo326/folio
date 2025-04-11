import React from 'react';
import { Carousel } from 'react-bootstrap';

function HeroCarousel() {
  return (
    <Carousel>
      <Carousel.Item style={{ height: '400px' }}>
        <img
          className="d-block w-100"
          src="https://via.placeholder.com/1200x400"
          alt="Slide 1"
          style={{ objectFit: 'cover', height: '400px' }}
        />
      </Carousel.Item>

      <Carousel.Item style={{ height: '400px' }}>
        <img
          className="d-block w-100"
          src="https://via.placeholder.com/1200x400"
          alt="Slide 2"
          style={{ objectFit: 'cover', height: '400px' }}
        />
      </Carousel.Item>

      <Carousel.Item style={{ height: '400px' }}>
        <img
          className="d-block w-100"
          src="https://via.placeholder.com/1200x400"
          alt="Slide 3"
          style={{ objectFit: 'cover', height: '400px' }}
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default HeroCarousel;
