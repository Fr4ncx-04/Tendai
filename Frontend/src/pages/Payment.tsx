import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, language } = useThemeLanguage();
  const { updateMembership, user } = useAuth();
  const membership = location.state?.membership;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id_usuario) {
      alert(language === 'en' ? 'User is not logged in.' : 'El usuario no ha iniciado sesión.');
      return;
    }

    if (membership) {
      const purchaseDate = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 días de membresía

      const payload = {
        id_usuario: user.id_usuario,
        nombre: membership.name,
        color: membership.color,
        fecha_inicio: purchaseDate.toISOString(),
        fecha_expiracion: expiryDate.toISOString(),
      };

      console.log('Datos que se enviarán al backend:', payload); // Verificar los datos

      try {
        // Llama a tu API para registrar la membresía en la base de datos usando fetch
        const response = await fetch('http://localhost:3001/membership', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Indica que el cuerpo es JSON
          },
          body: JSON.stringify(payload), // Convierte el objeto a JSON
        });

        if (!response.ok) {
          // Si la respuesta no es un código de éxito
          const errorData = await response.json(); // Obtener los datos de error
          throw new Error(errorData.message || 'Error al procesar el pago.');
        }

        // Si todo va bien
        const data = await response.json();
        console.log('Respuesta del servidor:', data); // Verificar la respuesta

        // Actualiza la membresía en el contexto después de un pago exitoso
        await updateMembership({
          id_usuario: user.id_usuario,
          name: membership.name,
          color: membership.color,
          purchaseDate,
          expiryDate,
          benefits: membership.benefits,
        });

        // Mensaje de éxito
        alert(language === 'en' 
          ? `Successful payment for ${membership.name} membership` 
          : `Pago exitoso por la membresía ${membership.name}`);

        navigate('/'); // Redirige a la página principal

      } catch (error) {
        console.error('Error en la compra de la membresía:', error);
        alert(language === 'en' 
          ? 'There was an error processing your payment.' 
          : 'Hubo un error al procesar el pago.');
      }
    }
  };

  
  
  
  const handleGoBack = () => {
    navigate(-1);
  };

  if (!membership) {
    return <p>{language === 'en' ? 'No membership selected.' : 'No hay ninguna membresía seleccionada.'}</p>;
  }

  return (
    <div className={`container mx-auto mt-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Rest of the payment form remains the same */}
      <div className="flex items-center mb-8">
        <button onClick={handleGoBack} className={`flex items-center font-bold transition duration-200 ${theme === 'dark' ? 'text-gray-100 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
          <ArrowLeft className="mr-2" />
          {language === 'en' ? 'Go Back' : 'Regresar'}
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-8">
        {language === 'en' ? `Pay for ${membership.name} Membership` : `Pagar Membresía ${membership.name}`}
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
        <button
          type="submit"
          className={`w-full font-bold py-2 px-4 rounded transition duration-200 ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          {language === 'en' ? `Pay $${membership.price}` : `Pagar $${membership.price}`}
        </button>
      </form>
    </div>
  );
};

export default Payment;