import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'user' | 'company' | 'admin'>('user');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, language } = useThemeLanguage();  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validar campos antes de enviar
    if (!usuario || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    console.log({ usuario, password, accountType });
  
    try {
      // Llamada a la API de inicio de sesión
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, password, accountType }),
      });
  
      // Verifica si la respuesta es válida
      if (!response.ok) {
        const errorData = await response.json(); // Manejo de errores
        alert(errorData.message);
        return;
      }
  
      const data = await response.json(); // Solo se llamará si la respuesta es OK
  
      console.log('Respuesta de la API:', data);
  
      // Login exitoso
      alert(data.message);
      login({ id_usuario: data.id_usuario, name: usuario, email: `${usuario}@example.com`, type: accountType });
  
      // Redirigir según el tipo de usuario
      switch (accountType) {
        case 'company':
          navigate('/company-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      alert('Hubo un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
    }
  };
  

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={`container mx-auto p-2 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className={`max-w-md mx-auto mt-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'text-gray-800'}`}>
        <h2 className="text-2xl font-bold mb-5">{language === 'en' ? 'Login' : 'Iniciar sesión'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="usuario" className="block mb-1">{language === 'en' ? 'Username' : 'Nombre de usuario'}</label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className={`w-full px-3 py-2 p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block mb-1">{language === 'en' ? 'Password' : 'Contraseña'}</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-8"
            >
              {passwordVisible ? '👁️' : '🙈'}
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="accountType" className="block mb-1">{language === 'en' ? 'Login as' : 'Iniciar sesión como'}</label>
            <select
              id="accountType"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as 'user' | 'company' | 'admin')}
              className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
            >
              <option value="user">{language === 'en' ? 'User' : 'Usuario'}</option>
              <option value="company">{language === 'en' ? 'Company' : 'Empresa'}</option>
              <option value="admin">{language === 'en' ? 'Admin' : 'Administrador'}</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {language === 'en' ? 'Login' : 'Iniciar sesión'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/forgotpassword" className="text-blue-500 hover:underline">
            {language === 'en' ? 'Forgot password?' : '¿Olvidaste tu contraseña?'}
          </Link>
        </div>
        <div className="mt-4 text-center">
          {language === 'en' ? "Don't have an account? " : '¿No tienes una cuenta? '}
          <Link to="/register" className="text-blue-500 hover:underline">
            {language === 'en' ? 'Register here' : 'Regístrate aquí'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
