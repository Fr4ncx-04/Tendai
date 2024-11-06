import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {useThemeLanguage} from '../contexts/ThemeLanguageContext';

const Register: React.FC = () => {
    const { theme, language } = useThemeLanguage();  // Obtenemos el tema y lenguaje 
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountType: 'user' as 'user'
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Verificar que las contraseñas coincidan
        if (formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    // No enviar accountType
                }),
            });
    
            const data = await response.json();
            console.log(data);  // Esto te ayudará a verificar lo que realmente devuelve el backend
            if (response.status === 201) {
                alert(data.message);
                // Redirigir a la página de inicio de sesión si es necesario
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error durante el registro.');
        }
    };
    

    return (
    <div className={`container mx-auto p-2 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <div className={`max-w-md mx-auto mt-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <h2 className="text-2xl font-bold mb-5">Registro</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block mb-1">Nombre de usuario</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block mb-1">Correo</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                        required
                    />
                </div>
                <div className="relative">
                    <label htmlFor="password" className="block mb-1">Contraseña</label>
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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
                <div className="relative">
                    <label htmlFor="confirmPassword" className="block mb-1">Confirma tu contraseña</label>
                    <input
                        type={confirmPasswordVisible ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                        required
                    />
                    <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-8"
                    >
                        {confirmPasswordVisible ? '👁️' : '🙈'}
                    </button>
                </div>
                <div>
                    <label htmlFor="accountType" className="block mb-1">Tipo de cuenta</label>
                    <select
                        id="accountType"
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                    >
                        <option value="user">Usuario</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Registrar
                </button>
            </form>
            <div className="mt-4 text-center">
                Ya tienes una cuenta <Link to="/login" className="text-blue-500 hover:underline">Inicia sesión aquí</Link>
            </div>
        </div>
    </div>
    );
};

export default Register;
