import React from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import './App.css'; // create-react-app で生成。不要なら削除可。

function App() {
  return (
    <div style={{ margin: '20px' }}>
      <h1>EC Site</h1>
      <ProductList />
      <Cart />
    </div>
  );
}

export default App;
