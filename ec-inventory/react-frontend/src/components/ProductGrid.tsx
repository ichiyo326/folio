import React from 'react';
import { Card } from 'react-bootstrap';

// ダミーデータ例
const items = [
  {
    id: 1,
    title: 'Toyota Woven City',
    imageUrl: '/images/sample1.png',
    date: '2025/03/11'
  },
  {
    id: 2,
    title: 'Flags Niigata',
    imageUrl: '/images/sample2.png',
    date: '2025/03/11'
  },
  {
    id: 3,
    title: 'JAIC RECRUIT SITE',
    imageUrl: '/images/sample3.png',
    date: '2024/12/04'
  },
  // 必要に応じて増やす
];

function ProductGrid() {
  return (
    <div className="row">
      {items.map((item) => (
        <div key={item.id} className="col-12 col-md-6 col-lg-4 mb-4">
          <Card>
            <Card.Img variant="top" src={item.imageUrl} />
            <Card.Body>
              <Card.Title>{item.title}</Card.Title>
              <p>{item.date}</p>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;
