import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Receipt } from 'lucide-react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface CartProduct {
  id_carrito: number;
  name: string;
  price: number;
  quantity: number;
  months?: number; // cantidad de meses, si aplica
  tipo_pago: 'contado' | 'credito';
  image: string;
}

interface ReceiptData {
  orderId: string;
  date: string;
  user: {
    name: string;
    email: string;
    address: string;
  };
  products: CartProduct[];
  subtotal: number;
  shipping: number;
  total: number;
}

const PaymentProduct: React.FC = () => {
  const navigate = useNavigate();
  const { theme, language } = useThemeLanguage();
  const { user } = useAuth();
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (!user?.id_usuario) return;
      try {
        const response = await fetch(
          `http://localhost:3001/cart-items/${user.id_usuario}`
        );
        if (!response.ok) throw new Error('Failed to fetch cart items');
        const data = await response.json();
        setCartProducts(data);
      } catch (error) {
        console.error('Error fetching cart products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [user?.id_usuario]);

  const calculateTotals = () => {
    const subtotal = cartProducts.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const shipping = subtotal * 0.05; // 5% shipping fee
    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  };

  const calculateMonthlyPayments = (product: CartProduct) => {
    if (product.tipo_pago === 'credito' && product.months) {
      const firstPayment = product.price * product.quantity * 0.1; // Ej. 10% de entrada
      const monthlyPayment = (product.price * product.quantity - firstPayment) / product.months;
      return { firstPayment, monthlyPayment };
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id_usuario) {
      alert(
        language === 'en'
          ? 'Please log in to complete your purchase'
          : 'Por favor inicie sesión para completar su compra'
      );
      return;
    }

    try {
      const { subtotal, shipping, total } = calculateTotals();
      const orderData = {
        userId: user.id_usuario,
        products: cartProducts,
        paymentInfo,
        totals: { subtotal, shipping, total },
      };

      const response = await fetch('http://localhost:3001/process-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Payment processing failed');

      const receiptData: ReceiptData = {
        orderId: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        user: {
          name: user.name,
          email: user.email,
          address: 'User Address', // Se obtendría de los datos del usuario
        },
        products: cartProducts,
        ...calculateTotals(),
      };

      setReceipt(receiptData);
      setShowReceipt(true);

      // Clear cart after successful payment
      await fetch(`http://localhost:3001/clear-cart/${user.id_usuario}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert(
        language === 'en'
          ? 'Payment processing failed'
          : 'Error al procesar el pago'
      );
    }
  };

  const handleGoBack = () => {
    if (showReceipt) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (showReceipt && receipt) {
    return (
      <div className={`container mx-auto mt-10 p-8 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg max-w-2xl`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Receipt className="mr-2" />
            {language === 'en' ? 'Purchase Receipt' : 'Recibo de Compra'}
          </h1>
          <button
            onClick={handleGoBack}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {language === 'en' ? 'Return to Home' : 'Volver al Inicio'}
          </button>
        </div>

        <div className="border-t border-b py-4 mb-4">
          <p>
            <strong>{language === 'en' ? 'Order ID: ' : 'ID de Orden: '}</strong>
            {receipt.orderId}
          </p>
          <p>
            <strong>{language === 'en' ? 'Date: ' : 'Fecha: '}</strong>
            {new Date(receipt.date).toLocaleDateString()}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">
            {language === 'en' ? 'Customer Information' : 'Información del Cliente'}
          </h2>
          <p>{receipt.user.name}</p>
          <p>{receipt.user.email}</p>
          <p>{receipt.user.address}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">
            {language === 'en' ? 'Products' : 'Productos'}
          </h2>
          {receipt.products.map((product) => {
            const paymentDetails = calculateMonthlyPayments(product);
            return (
              <div
                key={product.id_carrito}
                className="flex justify-between items-center mb-2"
              >
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm">
                    {language === 'en' ? 'Quantity: ' : 'Cantidad: '}
                    {product.quantity}
                  </p>
                  {product.tipo_pago === 'credito' && paymentDetails && (
                    <>
                      <p className="text-sm text-gray-500">
                        {language === 'en' ? 'First Payment: ' : 'Primer Pago: '}
                        ${paymentDetails.firstPayment.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {language === 'en' ? 'Monthly Payment: ' : 'Pago Mensual: '}
                        ${paymentDetails.monthlyPayment.toFixed(2)}
                      </p>
                    </>
                  )}
                </div>
                <p>${(product.price * product.quantity).toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }


  return (
    <div
      className={`container mx-auto mt-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex items-center mb-8">
        <button
          onClick={handleGoBack}
          className={`flex items-center font-bold transition duration-200 ${
            theme === 'dark'
              ? 'text-gray-100 hover:text-white'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="mr-2" />
          {language === 'en' ? 'Go Back' : 'Regresar'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {language === 'en' ? 'Complete Your Purchase' : 'Completar su Compra'}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">
              {language === 'en' ? 'Order Summary' : 'Resumen del Pedido'}
            </h2>
            <div
              className={`${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              } p-6 rounded-lg`}
            >
              {cartProducts.map((product) => (
                <div
                  key={product.id_carrito}
                  className="flex justify-between mb-4"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm">
                      {language === 'en' ? 'Quantity: ' : 'Cantidad: '}
                      {product.quantity}
                    </p>
                  </div>
                  <p>${(product.price * product.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span>{language === 'en' ? 'Subtotal' : 'Subtotal'}</span>
                  <span>${calculateTotals().subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>{language === 'en' ? 'Shipping' : 'Envío'}</span>
                  <span>${calculateTotals().shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>{language === 'en' ? 'Total' : 'Total'}</span>
                  <span>${calculateTotals().total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">
              {language === 'en' ? 'Payment Information' : 'Información de Pago'}
            </h2>
            <form
              onSubmit={handlePayment}
              className={`${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-lg rounded-lg p-6`}
            >
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block font-bold mb-2">
                  {language === 'en'
                    ? 'Card Number'
                    : 'Número de Tarjeta'}
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="expiryDate" className="block font-bold mb-2">
                    {language === 'en'
                      ? 'Expiry Date'
                      : 'Fecha de Expiración'}
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={paymentInfo.expiryDate}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-white text-gray-800'
                    }`}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block font-bold mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-white text-gray-800'
                    }`}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`w-full font-bold py-2 px-4 rounded transition duration-200 ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {language === 'en'
                  ? `Pay $${calculateTotals().total.toFixed(2)}`
                  : `Pagar $${calculateTotals().total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProduct;