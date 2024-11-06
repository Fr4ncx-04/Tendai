import React from 'react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const CompanyDashboard: React.FC = () => {
  const { theme, language } = useThemeLanguage();

  return (
    <div className={`container mx-auto mt-10 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-3xl font-bold mb-8">
        {language === 'en' ? 'Company Dashboard' : 'Panel de Control de la Empresa'}
      </h1>
      <p>
        {language === 'en' 
          ? 'Welcome to the company dashboard. Here you can manage your products and orders.' 
          : 'Bienvenido al panel de control de la empresa. Aquí puedes gestionar tus productos y pedidos.'}
      </p>
    </div>
  );
};

export default CompanyDashboard;