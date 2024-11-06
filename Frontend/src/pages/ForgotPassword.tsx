import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { FaCopy } from 'react-icons/fa'; 

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword] = useState(false);
  const { theme, language } = useThemeLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert('Por favor, ingresa tu dirección de correo electrónico.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }

      const data = await response.json();
      setPassword(data.password); 
      alert('Contraseña recuperada. Puedes copiarla ahora.'); 
    } catch (error) {
      console.error('Error al intentar recuperar la contraseña:', error);
      alert('Hubo un error al intentar recuperar la contraseña. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    alert('Contraseña copiada al portapapeles');
  };

  return (
    <div className={`container mx-auto p-2 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className={`max-w-md mx-auto mt-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'text-gray-800'}`}>
        <h2 className="text-2xl font-bold mb-5">{language === 'en' ? 'Forgot Password' : 'Recuperar Contraseña'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">{language === 'en' ? 'Email' : 'Correo electrónico'}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {language === 'en' ? 'Send Reset Link' : 'Enviar enlace de recuperación'}
          </button>
        </form>

        {password && (
          <div className="mt-4">
            <p className="text-sm">{language === 'en' ? 'Your password is:' : 'Tu contraseña es:'}</p>
            <div className="flex items-center justify-between">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                readOnly
                className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
              />
              <button onClick={handleCopyPassword} className="ml-2">
                <FaCopy />
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-500 hover:underline">
            {language === 'en' ? 'Back to Login' : 'Volver a Iniciar sesión'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
