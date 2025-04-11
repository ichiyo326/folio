import React, { useEffect, useState } from 'react';
import { Product } from '../types/types';

// React-Bootstrapの読み込み
import { Card, Button } from 'react-bootstrap';

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error('データ取得失敗');
        }
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const addToCart = (productId: number) => {
    const currentCart = localStorage.getItem('cart');
    const cartData: { productId: number; quantity: number }[] =
      currentCart ? JSON.parse(currentCart) : [];

    const existingIndex = cartData.findIndex(
      (item) => item.productId === productId
    );

    if (existingIndex >= 0) {
      cartData[existingIndex].quantity += 1;
    } else {
      cartData.push({ productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cartData));
    alert('カートに追加: ' + productId);
  };

  return (
    <div className="row">
      {products.map((p) => (
        <div key={p.id} className="col-sm-6 col-md-4 col-lg-3 mb-3">
          <Card>
            <Card.Body>
              <Card.Title>{p.name}</Card.Title>
              <Card.Text>在庫: {p.stock}</Card.Text>
              <Button
                variant="primary"
                onClick={() => addToCart(p.id)}
              >
                カートに入れる
              </Button>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
