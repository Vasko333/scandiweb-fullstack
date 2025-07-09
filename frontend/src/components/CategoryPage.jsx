// src/components/CategoryPage.jsx
import { useQuery, gql } from '@apollo/client';
import { useCategory } from '../CategoryContext';
import { useCart } from '../CartContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { FaCartPlus } from 'react-icons/fa';

const GET_PRODUCTS = gql`
  query GetProducts($category: String) {
    products(category: $category) {
      id
      name
      inStock
      gallery
      description
      prices {
        amount
        currency {
          symbol
        }
      }
      attributes {
        name
        type
        items {
          displayValue
          value
          slug
        }
      }
    }
  }
`;

export default function CategoryPage() {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const { addToCart, isCartOpen } = useCart();
  const navigate = useNavigate();
  const { category } = useParams();

  useEffect(() => {
    if (category && category !== selectedCategory) {
      setSelectedCategory(category);
    } else if (!category && selectedCategory) {
      setSelectedCategory(null);
    }
  }, [category, selectedCategory, setSelectedCategory]);

  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { category: selectedCategory },
    skip: false,
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('GraphQL Error:', error);
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="relative p-4 pl-[14%] pr-[14%] overflow-x-hidden">
      <h2 className="md:text-4xl tracking-wide capitalize md:mt-[3%] md:mb-[4%]">
        {selectedCategory ? selectedCategory : 'All Products'}
      </h2>
      <div
        className={`transition-opacity duration-300 ${
          isCartOpen ? 'opacity-50 bg-black/30' : ''
        }`}
      >
        <div className="flex md:flex-wrap md:justify-center md:gap-x-40 md:gap-y-8 w-full">
          {data.products.map((product) => (
            <div
              key={product.id}
              data-testid={`product-${product.name.toLowerCase().replace(/ /g, '-')}`}
              className="flex flex-col md:items-start justify-start md:w-1/3 w-screen md:max-w-[23%] p-2 hover:shadow-2xl hover:border hover:border-gray-100 relative group"
              style={{ height: '400px', minHeight: '400px' }}
            >
              <img
                src={product.gallery[0] || 'https://via.placeholder.com/150'}
                alt={product.name}
                className={`w-fit md:h-[60%] md:mx-auto h-full object-cover cursor-pointer ${
                  !product.inStock ? 'opacity-70' : ''
                }`}
                onClick={() => navigate(`/product/${product.id}`)}
              />
              <div className="flex items-start md:ml-[10%] mt-1 justify-center flex-col">
                <p className="md:mt-2 text-md">
                  {product.name}
                </p>
                <p
                  className={`mt-1 font-semibold tracking-wide ${
                    !product.inStock ? 'text-gray-600/50' : ''
                  }`}
                >
                  {product.prices[0]?.currency?.symbol || '$'}
                  {product.prices[0].amount.toFixed(2)}
                </p>
              </div>
              {!product.inStock && (
                <span className="relative bottom-[50%] mx-auto uppercase text-2xl font-semibold text-gray-600">
                  Out of Stock
                </span>
              )}
              {product.inStock && (
                <button
                  data-testid="add-to-cart"
                  className="bg-green-500 md:relative md:bottom-[24%] md:mx-auto md:mr-12 text-white rounded-full p-3 mt-2 w-10 h-10 flex items-center justify-center hover:bg-green-600 transition-all opacity-0 group-hover:opacity-100 absolute"
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.prices[0].amount,
                      image: product.gallery[0],
                      attributes: product.attributes,
                    })
                  }
                >
                  <FaCartPlus />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}