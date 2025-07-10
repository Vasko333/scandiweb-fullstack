import { useQuery, gql } from '@apollo/client';
import { useCategory } from '../CategoryContext';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

export default function Header({ setIsCartOpen }) {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const { selectedCategory, setSelectedCategory } = useCategory();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('GraphQL Error:', error);
    return <p>Error: {error.message}</p>;
  }

  const totalItems = getTotalItems();

  const handleCategoryClick = (catName) => {
    const categoryPath = `/${catName.toLowerCase()}`;
    setSelectedCategory(catName);
    navigate(categoryPath);
  };

  // Handler to navigate home on SVG click
  const handleLogoClick = () => {
    setSelectedCategory(null); // reset category selection on home nav
    navigate('/');
  };

  return (
    <header className="p-4 overflow-x-hidden flex justify-between pl-[14%] pr-[14%] items-center">
      <div className="space-x-4">
        {(data?.categories || []).map((cat) => (
          <a
            key={cat.id}
            href={`/${cat.name.toLowerCase()}`}
            data-testid="category-link"
            className={`text-black hover:text-green-400 hover:border-b-2 hover:border-b-green-400 transition-all uppercase ${
              selectedCategory === cat.name
                ? 'text-green-400 border-b-2 border-b-green-400 pb-4 transition-all font-bold'
                : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleCategoryClick(cat.name);
            }}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* Logo SVG with navigation on click */}
      <div
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
        aria-label="Home"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleLogoClick();
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3.01 11.22v4.49C3.01 20.2 4.81 22 9.3 22h5.39c4.49 0 6.29-1.8 6.29-6.29v-4.49"
            stroke="#74E789"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 12c1.83 0 3.18-1.49 3-3.32L14.34 2H9.67L9 8.68C8.82 10.51 10.17 12 12 12Z"
            stroke="#74E789"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.31 12c2.02 0 3.5-1.64 3.3-3.65l-.28-2.75C20.97 3 19.97 2 17.35 2H14.3l.7 7.01c.17 1.65 1.66 2.99 3.31 2.99ZM5.64 12c1.65 0 3.14-1.34 3.3-2.99l.22-2.21.48-4.8H6.59C3.97 2 2.97 3 2.61 5.6l-.27 2.75C2.14 10.36 3.62 12 5.64 12ZM12 17c-1.67 0-2.5.83-2.5 2.5V22h5v-2.5c0-1.67-.83-2.5-2.5-2.5Z"
            stroke="#74E789"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <button
        data-testid="cart-btn"
        onClick={() => setIsCartOpen(true)}
        className="relative"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M2 2h1.74c1.08 0 1.93.93 1.84 2l-.83 9.96a2.796 2.796 0 0 0 2.79 3.03h10.65c1.44 0 2.7-1.18 2.81-2.61l.54-7.5c.12-1.66-1.14-3.01-2.81-3.01H5.82M16.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM8.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM9 8h12"
            stroke="#101018"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {totalItems > 0 && (
          <div className="absolute top-0 right-0 bg-[#101018] text-white rounded-full w-4 h-4 flex items-center justify-center">
            {totalItems}
          </div>
        )}
      </button>
    </header>
  );
}