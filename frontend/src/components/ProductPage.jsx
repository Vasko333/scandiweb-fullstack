import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../CartContext';
import parse from 'html-react-parser';
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

export default function ProductPage() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCTS, { variables: { category: null } });
  const { addToCart } = useCart();
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data.products.find((p) => p.id === id);
  if (!product) return <p>Product not found</p>;

  const repeatedGallery = product.gallery.length >= 5
    ? product.gallery
    : Array(5).fill(null).map((_, i) => product.gallery[i % product.gallery.length]);

  const handleSelectAttribute = (attrName, value) => {
    setSelectedAttributes((prev) => ({ ...prev, [attrName]: value }));
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    if (Object.keys(selectedAttributes).length === product.attributes.length) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.prices[0].amount,
        image: repeatedGallery[currentImageIndex],
        attributes: product.attributes,
        selectedAttributes,
      });
    } else {
      console.log('Please select all attributes before adding to cart.');
    }
  };

  const isAttributeSelected = (attrName, value) => selectedAttributes[attrName] === value;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % repeatedGallery.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + repeatedGallery.length) % repeatedGallery.length);
  };

  return (
    <div className="bg-white overflow-x-hidden mt-[5%] pl-[14%] pr-[14%] max-w-screen flex justify-between">

      {/* Thumbnails */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] scrollbar-hide">
        {repeatedGallery.map((thumb, index) => (
          <img
            key={index}
            src={thumb}
            alt={`${product.name} thumbnail ${index + 1}`}
            className="w-[100px] h-[100px] object-contain cursor-pointer"
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>

      {/* Main Image with arrows */}
      <div className="relative flex items-center justify-center w-[500px] h-[500px] mx-8">
        <button
          onClick={prevImage}
          className="absolute border bg-gray-700 left-0 text-3xl text-black hover:text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08" />
          </svg>
        </button>
        <img
          src={repeatedGallery[currentImageIndex]}
          alt={product.name}
          className="max-w-full max-h-full object-contain"
        />
        <button
          onClick={nextImage}
          className="absolute border bg-gray-700 right-0 text-3xl text-black hover:text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08" />
          </svg>
        </button>
      </div>

      {/* Product details */}
      <div className="flex flex-col items-start justify-start max-w-xl">
        <h1 className="text-3xl font-bold mb-6 text-black">{product.name}</h1>

        {product.attributes.map((attr, index) => (
          <div key={`${attr.name}-${index}`} className="mb-6 flex flex-col">
            <p className="text-lg font-semibold mb-2 text-black">{attr.name}:</p>
            <div className="flex space-x-2 flex-wrap">
              {attr.items.map((option) => (
                <button
                  key={option.value}
                  className={`px-4 py-2 border-2 border-black hover:bg-black hover:text-white cursor-pointer ${
                    isAttributeSelected(attr.name, option.value)
                      ? attr.type !== 'swatch'
                        ? 'bg-black text-white'
                        : 'border-2 border-black'
                      : attr.type !== 'swatch'
                      ? 'bg-white text-black'
                      : 'bg-white'
                  } ${attr.type === 'swatch' ? 'w-8 h-8 p-0 rounded-full' : 'rounded'}`}
                  style={
                    attr.type === 'swatch'
                      ? {
                          backgroundColor: option.value,
                          border: isAttributeSelected(attr.name, option.value)
                            ? '2px solid black'
                            : '1px solid transparent',
                        }
                      : {}
                  }
                  onClick={() => handleSelectAttribute(attr.name, option.value)}
                >
                  {attr.type !== 'swatch' && option.displayValue}
                </button>
              ))}
            </div>
          </div>
        ))}

        <p className="text-2xl font-bold mb-6 text-black">
          PRICE: ${product.prices[0].amount.toFixed(2)}
        </p>

        {product.inStock ? (
          <button
            className="bg-emerald-400 text-white px-6 py-3 mb-6 rounded-lg hover:bg-emerald-500 hover:scale-90 transition duration-200"
            onClick={handleAddToCart}
          >
            ADD TO CART
          </button>
        ) : (
          <button
            className="bg-gray-400 text-white px-6 py-3 mb-6 rounded-lg cursor-not-allowed"
            disabled
          >
            OUT OF STOCK
          </button>
        )}

        <div className="text-base w-60 text-black" data-testid="product-description">
          {parse(product.description)}
        </div>

      </div>
    </div>
  );
}