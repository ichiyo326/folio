import React, { useState } from 'react';
import SiteNavbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import Banner from './components/Banner';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Footer from './components/Footer';
// 必要があればプロジェクト用CSSを読み込み
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Navbarから受け取るカテゴリ変更コールバック
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <>
      {/* ナビゲーションバー */}
      <SiteNavbar onCategoryChange={handleCategoryChange} />

      {/* カルーセル */}
      <HeroCarousel />

      <div className="container mt-4">
        {/* バナー表示 */}
        <Banner />

        <div className="row mt-4">
          {/* 左側: 商品一覧 (col-lg-8) */}
          <div className="col-12 col-lg-8 mb-4">
            <h2>商品一覧</h2>
            {/* 選択カテゴリを渡す */}
            <ProductList selectedCategory={selectedCategory} />
          </div>

          {/* 右側: カート (col-lg-4) */}
          <div className="col-12 col-lg-4 mb-4">
            <h2>カート</h2>
            <Cart />
          </div>
        </div>

        {/* フッター */}
        <Footer />
      </div>
    </>
  );
}

export default App;
