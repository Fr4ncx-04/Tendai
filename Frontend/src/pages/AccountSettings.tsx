import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // Importa useHistory

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Inicializa useHistory
  const [formData, setFormData] = useState({
    id_usuario: user?.id_usuario,
    Usuario: user?.name,
    Correo: user?.email,
    Telefono: '',
    direccion: '',
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
      
      // Si existen datos adicionales, llenamos el formulario y marcamos `hasData` como verdadero
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
      setError('Completa tu información');
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
      setError('Por favor, completa todos los campos antes de guardar.');
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
      
      if (method === 'POST') setHasData(true); // Si era POST, ahora ya tenemos datos.
    } catch (err) {
      setError(`No se pueden ${hasData ? 'actualizar' : 'enviar'} los datos adicionales del usuario`);
      setSuccess('');
    }
  };

  const toggleEditLock = () => {
    setIsLocked(!isLocked);
    setIsEditable(!isLocked); // Cambia el modo editable si está desbloqueado
  };

  const handleBack = () => {
    navigate(-1); // Navega a la página anterior
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8">Configuración de cuenta</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mb-4">
          <label htmlFor="Usuario" className="block mb-2">Usuario</label>
          <input type="text" id="Usuario" name="Usuario" value={formData.Usuario} className="w-full px-3 py-2 border rounded" readOnly />
        </div>
        <div className="mb-4">
          <label htmlFor="Correo" className="block mb-2">Correo</label>
          <input type="email" id="Correo" name="Correo" value={formData.Correo} className="w-full px-3 py-2 border rounded" readOnly />
        </div>

        <div className="mb-4">
          <label htmlFor="Telefono" className="block mb-2">Telefono</label>
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
          <label htmlFor="direccion" className="block mb-2">Dirección</label>
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
          <label htmlFor="codigo_postal" className="block mb-2">Código postal</label>
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
              Guardar cambios
            </button>
          ) : (
            <button
              type="button"
              onClick={() => !isLocked && setIsEditable(true)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              disabled={isLocked}
            >
              {hasData ? 'Editar' : 'Completar datos'}
            </button>
          )}
          <button onClick={toggleEditLock} type="button" className="ml-4 text-gray-600 hover:text-gray-800">
            {isLocked ? '🔒' : '🔓'}
          </button>
        </div>

        <button onClick={handleBack} type="button" className="mt-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
          Volver
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
};

export default AccountSettings;
