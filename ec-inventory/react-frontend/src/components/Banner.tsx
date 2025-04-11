import React from 'react';
import { Alert, Badge } from 'react-bootstrap';

function Banner() {
  return (
    <Alert variant="info" className="mt-3">
      <Alert.Heading>Campaign</Alert.Heading>
      <p>Discount: 10%</p>
      <p>End date: 2025-12-31</p>
      <Badge bg="primary">Units sold: 100</Badge>
    </Alert>
  );
}

export default Banner;
