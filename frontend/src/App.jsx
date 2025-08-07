import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryPage from './components/CategoryPage';
import ProductPage from './components/ProductPage';
import CartOverlay from './components/CartOverlay';
import ThankYou from './components/ThankYou';
import { CategoryProvider } from './CategoryContext';
import { CartProvider } from './CartContext';

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsCartOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen overflow-x-hidden w-screen bg-white relative">
      <CartProvider>
        <CategoryProvider>
          <Header setIsCartOpen={setIsCartOpen} />
          <div className="relative">
            <Routes>
              <Route path="/:category?" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/thank-you" element={<ThankYou />} />
            </Routes>
            {isCartOpen && (
              <>
                <div
                  className="fixed top-[64px] bottom-0 left-0 right-0 bg-gray-600 opacity-75 z-10"
                  onClick={() => setIsCartOpen(false)}
                />
                <CartOverlay setIsCartOpen={setIsCartOpen} />
              </>
            )}
          </div>
        </CategoryProvider>
      </CartProvider>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;