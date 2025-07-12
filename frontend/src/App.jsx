import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import CategoryPage from './components/CategoryPage';
import ProductPage from './components/ProductPage';
import CartOverlay from './components/CartOverlay';
import { CategoryProvider } from './CategoryContext';
import { CartProvider } from './CartContext';
import { useState } from 'react';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden w-screen bg-white relative">
      <CartProvider>
        <CategoryProvider>
          <Router>
            <Header setIsCartOpen={setIsCartOpen} />
            <div className="relative">
              <Routes>
                <Route path="/:category?" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
              </Routes>
              {isCartOpen && (
                <>
                  <div
                    className="fixed top-[64px] bottom-0 left-0 right-0 bg-gray-600 opacity-75 z-10"
                    onClick={() => setIsCartOpen(false)}
                  ></div>
                  <CartOverlay setIsCartOpen={setIsCartOpen} />
                </>
              )}
            </div>
          </Router>
        </CategoryProvider>
      </CartProvider>
    </div>
  );
}

export default App;