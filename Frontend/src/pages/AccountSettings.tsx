import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, language } = useThemeLanguage();

  const [formData, setFormData] = useState({
    id_usuario: user?.id_usuario,
    Usuario: user?.name,
    Correo: user?.email,
    Telefono: '',
    direccion: user?.address,
    codigo_postal: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [hasData, setHasData] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/datos_usuario/${formData.id_usuario}`);
      if (!response.ok) throw new Error('Error al obtener los datos del usuario');
      
      const data = await response.json();
      
      if (data.Telefono || data.direccion || data.codigo_postal) {
        setFormData({
          ...formData,
          Telefono: data.Telefono,
          direccion: data.Direccion,
          codigo_postal: data.Codigo_postal
        });
        setHasData(true);
      } else {
        setHasData(false);
      }
    } catch (err) {
      setError(language === 'es' ? 'Completa tu información' : 'Complete your information');
    }
  };

  useEffect(() => {
    if (formData.id_usuario) fetchUserData();
  }, [formData.id_usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { id_usuario, Telefono, direccion, codigo_postal } = formData;
    if (!Telefono || !direccion || !codigo_postal) {
      setError(language === 'es' ? 'Por favor, completa todos los campos antes de guardar.' : 'Please complete all fields before saving.');
      return;
    }

    try {
      const method = hasData ? 'PATCH' : 'POST';
      const url = hasData 
        ? `http://localhost:3001/api/datos_usuario/${formData.id_usuario}`
        : 'http://localhost:3001/datos_usuario';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, Telefono, direccion, codigo_postal })
      });

      if (!response.ok) throw new Error('Error al guardar los datos');
      
      const data = await response.json();
      setSuccess(data.message);
      setError('');
      setIsEditable(false);
      
      if (method === 'POST') setHasData(true); 
    } catch (err) {
      setError(
        language === 'es' 
          ? `No se pueden ${hasData ? 'actualizar' : 'enviar'} los datos adicionales del usuario` 
          : `Cannot ${hasData ? 'update' : 'send'} additional user data`
      );
      setSuccess('');
    }
  };

  const toggleEditLock = () => {
    setIsLocked(!isLocked);
    setIsEditable(!isLocked);
  };

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <div className={`container mx-auto mt-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-3xl font-bold mb-8">{language === 'es' ? 'Configuración de cuenta' : 'Account Settings'}</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mb-4">
          <label htmlFor="Usuario" className="block mb-2">{language === 'es' ? 'Usuario' : 'Username'}</label>
          <input type="text" id="Usuario" name="Usuario" value={formData.Usuario} className="w-full px-3 py-2 border rounded" readOnly />
        </div>
        <div className="mb-4">
          <label htmlFor="Correo" className="block mb-2">{language === 'es' ? 'Correo' : 'Email'}</label>
          <input type="email" id="Correo" name="Correo" value={formData.Correo} className="w-full px-3 py-2 border rounded" readOnly />
        </div>

        <div className="mb-4">
          <label htmlFor="Telefono" className="block mb-2">{language === 'es' ? 'Teléfono' : 'Phone'}</label>
          <input
            type="tel"
            id="Telefono"
            name="Telefono"
            value={formData.Telefono}
            onChange={isEditable ? handleChange : undefined}
            className="w-full px-3 py-2 border rounded"
            readOnly={!isEditable}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="direccion" className="block mb-2">{language === 'es' ? 'Dirección' : 'Address'}</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={isEditable ? handleChange : undefined}
            className="w-full px-3 py-2 border rounded"
            readOnly={!isEditable}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="codigo_postal" className="block mb-2">{language === 'es' ? 'Código postal' : 'Postal Code'}</label>
          <input
            type="text"
            id="codigo_postal"
            name="codigo_postal"
            value={formData.codigo_postal}
            onChange={isEditable ? handleChange : undefined}
            className="w-full px-3 py-2 border rounded"
            readOnly={!isEditable}
          />
        </div>

        <div className="flex items-center mb-4">
          {isEditable ? (
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              {language === 'es' ? 'Guardar cambios' : 'Save Changes'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => !isLocked && setIsEditable(true)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              disabled={isLocked}
            >
              {hasData ? (language === 'es' ? 'Editar' : 'Edit') : (language === 'es' ? 'Completar datos' : 'Complete Data')}
            </button>
          )}
          <button onClick={toggleEditLock} type="button" className="ml-4 text-gray-600 hover:text-gray-800">
            {isLocked ? '🔒' : '🔓'}
          </button>
        </div>

        <button onClick={handleBack} type="button" className="mt-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
          {language === 'es' ? 'Volver' : 'Back'}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
};

export default AccountSettings;
