import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook

interface CartItem {
  id_carrito: number;
  name: string;
  price: number;
  quantity: number;
  months: number;
  tipo_pago: 'contado' | 'credito';
  image: string;
}

const Cart: React.FC = () => {
  const { theme } = useThemeLanguage();
  const { user } = useAuth();
  const userId = user?.id_usuario;
  const { fetchCartCount } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:3001/cart-items/${userId}`);
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to fetch cart items: ${errorMessage}`);
        }
        const data: CartItem[] = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Su carrito esta vacio, por favor agregue productos.');
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleQuantityChange = async (id_carrito: number, newQuantity: number) => {
    if (newQuantity <= 0) return;

    try {
      const response = await fetch(`http://localhost:3001/update-cart-item/${id_carrito}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item quantity');
      }

      setCartItems(cartItems.map(item =>
        item.id_carrito === id_carrito ? { ...item, quantity: newQuantity } : item
      ));
      await fetchCartCount();
    } catch (error) {
      console.error('Error updating item quantity:', error);
      setError('No se pudo actualizar la cantidad del producto.');
    }
  };

  const handleRemoveItem = async (id_carrito: number) => {
    try {
      const response = await fetch(`http://localhost:3001/delete-cart-item/${id_carrito}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setCartItems(cartItems.filter(item => item.id_carrito !== id_carrito));
      await fetchCartCount();
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('No se pudo eliminar el producto del carrito.');
    }
  };

  const getShippingCost = (months: number, totalPrice: number) => {
    return months === 6 || months === 12 ? totalPrice * 0.03 : totalPrice * 0.05;
  };

  const calculatePaymentDetails = (item: CartItem) => {
    const totalPrice = item.price * item.quantity;
    let firstPayment = 0;
    let shippingCost = 0;
    let monthlyPayment = 0;

    if (item.tipo_pago === 'credito') {
      firstPayment = (item.months === 6 || item.months === 12) 
          ? totalPrice * 0.1 
          : totalPrice * 0.15;

      shippingCost = getShippingCost(item.months, totalPrice);

      if (item.months === 6 || item.months === 12) {
          monthlyPayment = ((totalPrice - firstPayment) / (item.months - 1) * 1.20);
      } else if (item.months === 18 || item.months === 24) {
          monthlyPayment = ((totalPrice - firstPayment) / (item.months - 1) * 1.25);
      }
    } else {
      // Si el tipo de pago es contado
      firstPayment = totalPrice;
      shippingCost = getShippingCost(0, totalPrice);  // Envío único para contado
    }

    const totalCost = firstPayment + shippingCost;
    return { firstPayment, shippingCost, totalCost, monthlyPayment };
  };

  if (loading) {
    return <div className={`mx-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>Loading...</div>;
  }

  if (error) {
    return <div className={`mx-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>{error}</div>;
  }

  const totalContado = cartItems
    .filter(item => item.tipo_pago === 'contado')
    .reduce((sum, item) => sum + item.price * item.quantity + getShippingCost(0, item.price * item.quantity), 0);

  const totalCreditoPrimerPago = cartItems
    .filter(item => item.tipo_pago === 'credito')
    .reduce((sum, item) => {
      const { firstPayment, shippingCost } = calculatePaymentDetails(item);
      return sum + firstPayment + shippingCost;
    }, 0);

  const Handlepayproduct =() =>{
    navigate("/paymentproduct");
  };

  return (
    <div className={`mx-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Back
      </button>
      
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="shadow-md rounded my-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-600 text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Product</th>
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-center">Quantity</th>
                <th className="py-3 px-6 text-center">Payment Plan</th>
                <th className="py-3 px-6 text-center">Price</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {cartItems.map(item => {
                const { monthlyPayment } = calculatePaymentDetails(item);
                const totalPrice = item.price * item.quantity;

                return (
                  <tr key={item.id_carrito} className="border-b border-gray-200">
                    <td className="py-3 px-6">{item.name}</td>
                    <td className="py-3 px-6">
                      <img src={item.image} alt={item.name} className="w-16 h-16" />
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button onClick={() => handleQuantityChange(item.id_carrito, item.quantity - 1)}>-</button>
                      <span className="mx-2">{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.id_carrito, item.quantity + 1)}>+</button>
                    </td>
                    <td className="py-3 px-6 text-center">
                      {item.tipo_pago === 'credito' ? `${item.months} months` : 'Contado'}
                      {item.tipo_pago === 'credito' && (
                        <div className="text-sm text-gray-500">
                          Mensualidad: ${monthlyPayment.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">${totalPrice.toFixed(2)}</td>
                    <td className="py-3 px-6 text-center">
                      <button onClick={() => handleRemoveItem(item.id_carrito)} className="text-red-500">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className={`flex justify-between p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="flex justify-between w-full">
              <div>
                <h2 className="font-bold">Total Contado: ${totalContado.toFixed(2)}</h2>
                <h2 className="font-bold">Total Crédito Primer Pago: ${totalCreditoPrimerPago.toFixed(2)}</h2>
              </div>
              <div>
                <button className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-3 transition duration-300' onClick={Handlepayproduct}>
                  Proceder al pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
