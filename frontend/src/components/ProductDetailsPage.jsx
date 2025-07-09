import { useQuery, gql } from '@apollo/client';

const GET_PRODUCT = gql`
  query ($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      gallery
      description
      attributes {
        name
        type
        items {
          displayValue
          value
        }
      }
      prices {
        amount
        currency {
          symbol
        }
      }
    }
  }
`;

export default function ProductDetailsPage({ productId }) {
  const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { id: productId } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data.product;

  return (
    <div className="p-4 flex pl-[10%] pr-[10%] items-center overflow-x-hidden  justify-center">
      <div data-testid="product-gallery" className="w-1/2">
        <img src={product.gallery[0] || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-auto" />
      </div>
      <div className="w-full pl-4">
        <h2 className="text-xl font-bold">{product.name}</h2>
        {product.attributes.map((attr) => (
          <div key={attr.name} data-testid={`product-attribute-${attr.name.toLowerCase()}`} className="mb-2">
            <p className="font-semibold">{attr.name}</p>
            <div className="flex space-x-2">
              {attr.items.map((item) => (
                <button key={item.value} className="border p-2" data-testid={`attribute-${attr.name.toLowerCase()}-${item.value}`}>
                  {item.displayValue}
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="mt-2">{product.prices[0].symbol}{product.prices[0].amount.toFixed(2)}</p>
        <button data-testid="add-to-cart" disabled={!product.inStock} className="bg-green-500 text-white px-4 py-2 mt-2">
          Add to Cart
        </button>
        <div data-testid="product-description" className="mt-4">{product.description}</div>
      </div>
    </div>
  );
}