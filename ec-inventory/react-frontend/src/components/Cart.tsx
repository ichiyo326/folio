import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

type CartItem = {
  productId: number;
  quantity: number;
};

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  const handlePurchase = () => {
    alert('購入処理を実行（仮）');
  };

  if (cartItems.length === 0) {
    return <p>カートが空です</p>;
  }

  return (
    <div>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            ProductID: {item.productId} × {item.quantity}個
          </li>
        ))}
      </ul>
      <Button variant="success" onClick={handlePurchase}>
        購入
      </Button>
    </div>
  );
}

export default Cart;
