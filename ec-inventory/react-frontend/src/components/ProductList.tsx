import React, { useEffect, useState } from 'react';
import { Product } from '../types/types';

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
    let currentCart = localStorage.getItem('cart');
    let cartData: { productId: number; quantity: number }[] = currentCart
      ? JSON.parse(currentCart)
      : [];

    const existingIndex = cartData.findIndex((item) => item.productId === productId);
    if (existingIndex >= 0) {
      cartData[existingIndex].quantity += 1;
    } else {
      cartData.push({ productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cartData));
    alert('カートに追加: ' + productId);
  };

  return (
    <div>
      <h2>商品一覧</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} (在庫: {p.stock}){' '}
            <button onClick={() => addToCart(p.id)}>カートに入れる</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
