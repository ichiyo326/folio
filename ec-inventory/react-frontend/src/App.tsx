import React from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Banner from './components/Banner';  // 追加
import Footer from './components/Footer';  // 追加
import './App.css'; // 必要なら調整

function App() {
  return (
    <div className="container mt-4">
      <h1>EC Site</h1>

      {/* 追加コンポーネント */}
      <Banner />

      <div className="row mt-4">
        <div className="col-12 col-md-6">
          <h2>商品一覧</h2>
          <ProductList />
        </div>
        <div className="col-12 col-md-6">
          <h2>カート</h2>
          <Cart />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
