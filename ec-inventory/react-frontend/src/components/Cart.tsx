import React, { useEffect, useState } from 'react';
import { CartItem } from '../types/types';

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    let storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const purchase = () => {
    if (cartItems.length === 0) {
      alert('カートが空');
      return;
    }
    const userId = 1234; // 固定値
    const productIds = cartItems.map((c) => c.productId);
    const quantities = cartItems.map((c) => c.quantity);

    fetch('http://localhost:8080/api/purchase/multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productIds, quantities }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('購入失敗');
        }
        return res.text();
      })
      .then((msg) => {
        alert('購入完了: ' + msg);
        localStorage.removeItem('cart');
        setCartItems([]);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div>
      <h2>カート</h2>
      {cartItems.length === 0 ? (
        <p>カートが空です</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, idx) => (
              <li key={idx}>
                商品ID: {item.productId}, 数量: {item.quantity}
              </li>
            ))}
          </ul>
          <button onClick={purchase}>購入</button>
        </>
      )}
    </div>
  );
}

export default Cart;
