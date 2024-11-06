import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const Register: React.FC = () => {
    const { theme, language } = useThemeLanguage();
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

        if (formData.password !== formData.confirmPassword) {
            alert(language === 'en' ? "Passwords do not match." : "Las contraseñas no coinciden.");
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
                }),
            });

            const data = await response.json();
            console.log(data);
            alert(data.message);
        } catch (error) {
            console.error('Error:', error);
            alert(language === 'en' ? "An error occurred during registration." : "Ocurrió un error durante el registro.");
        }
    };

    const text = {
        en: {
            register: "Register",
            username: "Username",
            email: "Email",
            password: "Password",
            confirmPassword: "Confirm Password",
            accountType: "Account Type",
            user: "User",
            submit: "Register",
            alreadyHaveAccount: "Already have an account?",
            loginHere: "Log in here",
        },
        es: {
            register: "Registro",
            username: "Nombre de usuario",
            email: "Correo",
            password: "Contraseña",
            confirmPassword: "Confirma tu contraseña",
            accountType: "Tipo de cuenta",
            user: "Usuario",
            submit: "Registrar",
            alreadyHaveAccount: "¿Ya tienes una cuenta?",
            loginHere: "Inicia sesión aquí",
        }
    };

    const t = text[language] || text.es;

    return (
        <div className={`container mx-auto p-2 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <div className={`max-w-md mx-auto mt-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <h2 className="text-2xl font-bold mb-5">{t.register}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block mb-1">{t.username}</label>
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
                        <label htmlFor="email" className="block mb-1">{t.email}</label>
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
                        <label htmlFor="password" className="block mb-1">{t.password}</label>
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
                        <label htmlFor="confirmPassword" className="block mb-1">{t.confirmPassword}</label>
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
                        <label htmlFor="accountType" className="block mb-1">{t.accountType}</label>
                        <select
                            id="accountType"
                            name="accountType"
                            value={formData.accountType}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                        >
                            <option value="user">{t.user}</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        {t.submit}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    {t.alreadyHaveAccount} <Link to="/login" className="text-blue-500 hover:underline">{t.loginHere}</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
