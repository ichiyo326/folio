import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';

type Product = {
  id: number;
  name: string;
  stock: number;
  price: number;
  imageUrl: string;
  category: 'food' | 'drink';
};

type ProductListProps = {
  selectedCategory: string; // "All" | "food" | "drink"
};

function ProductList({ selectedCategory }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // ダミーデータ
    const mockData: Product[] = [
      {
        id: 1,
        name: 'カステラ',
        stock: 10,
        price: 1000,
        imageUrl: '/images/castella.png',
        category: 'food'
      },
      {
        id: 2,
        name: 'いちごマリトッツオ',
        stock: 5,
        price: 2000,
        imageUrl: '/images/maritozzo.png',
        category: 'food'
      },
      {
        id: 3,
        name: 'コーヒー',
        stock: 20,
        price: 300,
        imageUrl: '/images/coffee.png',
        category: 'drink'
      },
      {
        id: 4,
        name: '紅茶',
        stock: 15,
        price: 250,
        imageUrl: '/images/tea.png',
        category: 'drink'
      }
    ];
    setProducts(mockData);
  }, []);

  // カテゴリフィルタ
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // カート追加処理
  const addToCart = (productId: number) => {
    const currentCart = localStorage.getItem('cart');
    const cartData: { productId: number; quantity: number }[] =
      currentCart ? JSON.parse(currentCart) : [];

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
    <div className="row">
      {filteredProducts.map((p) => (
        // col-md-4 で1行3列 (中画面以上)
        // col-sm-6 で1行2列 (小画面)
        <div key={p.id} className="col-12 col-sm-6 col-md-4 mb-4">
          <Card>
            <Card.Img
              variant="top"
              src={p.imageUrl}
              alt={p.name}
              style={{ objectFit: 'cover', height: '200px' }}
            />
            <Card.Body>
              <Card.Title>{p.name}</Card.Title>
              <Card.Text>在庫: {p.stock}</Card.Text>
              <Card.Text>価格: {p.price}円</Card.Text>
              <Button
                variant="primary"
                onClick={() => addToCart(p.id)}
                disabled={p.stock === 0}
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
