import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { useAuth } from '../contexts/AuthContext';

const PaymentProduct: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, language } = useThemeLanguage();
  const { user } = useAuth();
  
  const products = location.state?.products; // Suponemos que los productos vienen en el estado de ubicación
  const totalPrice = products?.reduce((total, product) => total + product.price, 0).toFixed(2); // Calcula el precio total

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id_usuario) {
      alert(language === 'en' ? 'User is not logged in.' : 'El usuario no ha iniciado sesión.');
      return;
    }

    const purchaseDate = new Date();
    
    const payload = {
      id_usuario: user.id_usuario,
      products: products.map(product => ({
        id_producto: product.id,
        nombre: product.name,
        precio: product.price,
      })),
      fecha_compra: purchaseDate.toISOString(),
    };

    console.log('Datos que se enviarán al backend:', payload); // Verificar los datos

    try {
      const response = await fetch('http://localhost:3001/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar el pago.');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      // Generar un recibo (puedes adaptarlo según tus necesidades)
      alert(language === 'en' 
        ? `Payment successful! Receipt: ${JSON.stringify(data.receipt)}` 
        : `¡Pago exitoso! Recibo: ${JSON.stringify(data.receipt)}`);

      navigate('/'); // Redirige a la página principal

    } catch (error) {
      console.error('Error en el pago:', error);
      alert(language === 'en' 
        ? 'There was an error processing your payment.' 
        : 'Hubo un error al procesar el pago.');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!products || products.length === 0) {
    return <p>{language === 'en' ? 'No products in the cart.' : 'No hay productos en el carrito.'}</p>;
  }

  return (
    <div className={`container mx-auto mt-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex items-center mb-8">
        <button onClick={handleGoBack} className={`flex items-center font-bold transition duration-200 ${theme === 'dark' ? 'text-gray-100 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
          <ArrowLeft className="mr-2" />
          {language === 'en' ? 'Go Back' : 'Regresar'}
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-8">
        {language === 'en' ? 'Pay for Your Products' : 'Pagar por Sus Productos'}
      </h1>
      <form onSubmit={handlePayment} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-8 max-w-md mx-auto`}>
        <div className="mb-6">
          <label htmlFor="cardNumber" className="block font-bold mb-2">
            {language === 'en' ? 'Card Number' : 'Número de Tarjeta'}
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="expiryDate" className="block font-bold mb-2">
            {language === 'en' ? 'Expiry Date' : 'Fecha de Expiración'}
          </label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
            placeholder="MM/YY"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="cvv" className="block font-bold mb-2">
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
            placeholder="123"
            required
          />
        </div>
        <div className="mb-6">
          <p className="font-bold">{language === 'en' ? `Total: $${totalPrice}` : `Total: $${totalPrice}`}</p>
        </div>
        <button
          type="submit"
          className={`w-full font-bold py-2 px-4 rounded transition duration-200 ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          {language === 'en' ? `Pay $${totalPrice}` : `Pagar $${totalPrice}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentProduct;
