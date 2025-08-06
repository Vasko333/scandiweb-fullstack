import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartOverlay({ setIsCartOpen }) {
  const { cartItems, updateQuantity, updateAttribute, getTotalItems } = useCart();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    // You can add order submission logic here (API call or mutation)
    // For now, just clear cart or simulate order submission if needed

    // Redirect to Thank You page
    navigate('/thank-you');
  };

  return (
    <div
      className="fixed pl-6 pr-6 pb-6 overflow-x-hidden top-0 right-4 bg-white shadow-lg w-[20%] z-50"
      style={{ top: '64px' }}
    >
      <button
        className="absolute top-2 right-2 text-black"
        onClick={() => setIsCartOpen(false)}
      >
        X
      </button>

      <h3 className="font-bold md:mt-2 md:mb-2 text-lg text-black">
        My Bag, {getTotalItems()} items
      </h3>

      {cartItems.length === 0 ? (
        <p className="text-black">Cart is empty</p>
      ) : (
        <div className="flex flex-col max-h-[75vh]">
          <div className="overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-row mb-4">
                <div className="selectables flex flex-col w-1/4 pr-2">
                  <p className="text-black">{item.name}</p>
                  <p className="text-black">${item.price.toFixed(2)}</p>

                  {item.attributes &&
                    item.attributes.map((attr, index) => {
                      const attrNameKebab = attr.name.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <div
                          key={`${item.id}-${attr.name}-${index}`}
                          data-testid={`cart-item-attribute-${attrNameKebab}`}
                          className="mb-2"
                        >
                          <p className="font-semibold text-black">{attr.name}:</p>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                            {attr.items.map((option) => {
                              const isSelected =
                                item.selectedAttributes?.[attr.name] === option.value;
                              const optionKebab = option.value.toLowerCase().replace(/\s+/g, '-');
                              const baseTestId = `cart-item-attribute-${attrNameKebab}-${optionKebab}`;
                              return (
                                <span
                                  key={`${item.id}-${attr.name}-${option.value}`}
                                  data-testid={`${baseTestId}${isSelected ? '-selected' : ''}`}
                                  className={`border ${
                                    attr.type === 'swatch'
                                      ? 'px-4 py-2 rounded'
                                      : 'w-12 h-fit rounded'
                                  } ${
                                    isSelected
                                      ? attr.type !== 'swatch'
                                        ? 'bg-black text-white'
                                        : ''
                                      : attr.type !== 'swatch'
                                      ? 'bg-white text-black border-black'
                                      : ''
                                  } transition duration-200`}
                                  style={
                                    attr.type === 'swatch'
                                      ? {
                                          backgroundColor: option.value,
                                          border: isSelected
                                            ? '2px solid black'
                                            : '1px solid transparent',
                                        }
                                      : {}
                                  }
                                >
                                  {attr.type !== 'swatch' && option.displayValue}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="quantity flex flex-col justify-between items-center w-1/4 mx-2">
                  <button
                    data-testid="cart-item-amount-decrease"
                    className="px-2 bg-gray-200 text-black"
                    onClick={() => updateQuantity(item.id, item.selectedAttributes, -1)}
                  >
                    -
                  </button>
                  <span data-testid="cart-item-amount" className="text-black mx-2">
                    {item.quantity}
                  </span>
                  <button
                    data-testid="cart-item-amount-increase"
                    className="px-2 bg-gray-200 text-black"
                    onClick={() => updateQuantity(item.id, item.selectedAttributes, 1)}
                  >
                    +
                  </button>
                </div>

                <div className="image flex items-center justify-center w-2/4">
                  <img
                    src={item.image || 'https://via.placeholder.com/50'}
                    alt={item.name}
                    className="h-max w-fit"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2">
            <p data-testid="cart-total" className="text-black">
              Total: ${total.toFixed(2)}
            </p>
            <button
              className="bg-green-500 text-white px-4 py-2 mt-2 w-full"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
