import React from 'react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const AdminDashboard: React.FC = () => {
  const { theme, language } = useThemeLanguage();

  return (
    <div className={`container mx-auto mt-10 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-3xl font-bold mb-8">
        {language === 'en' ? 'Admin Dashboard' : 'Panel de Control del Administrador'}
      </h1>
      <p>
        {language === 'en' 
          ? 'Welcome to the admin dashboard. Here you can manage users, companies, and site settings.' 
          : 'Bienvenido al panel de control del administrador. Aquí puedes gestionar usuarios, empresas y configuraciones del sitio.'}
      </p>
    </div>
  );
};

export default AdminDashboard;