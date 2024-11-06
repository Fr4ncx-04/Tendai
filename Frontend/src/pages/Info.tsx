import React from 'react';
import { useNavigate } from 'react-router-dom'; // For React Router v6+
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { Building2, Shield, Globe } from 'lucide-react';

const Info: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const navigate = useNavigate(); // Navigate hook

  const content = {
    en: {
      title: 'About Us',
      mission: {
        title: 'Our Mission',
        text: 'To provide high-quality laptops and exceptional customer service, making technology accessible to everyone through flexible payment options.',
      },
      vision: {
        title: 'Our Vision',
        text: 'To become the leading platform for laptop purchases in Latin America, known for our reliability, customer service, and innovative financing solutions.',
      },
      values: {
        title: 'Our Values',
        items: [
          'Integrity in all our operations',
          'Customer satisfaction as our priority',
          'Innovation in services and solutions',
          'Commitment to quality',
        ],
      },
      history: {
        title: 'Our History',
        text: 'Founded in 2024, we\'ve grown from a small startup to a trusted name in laptop sales, serving thousands of satisfied customers across the region.',
      },
    },
    es: {
      title: 'Acerca de Nosotros',
      mission: {
        title: 'Nuestra Misión',
        text: 'Proporcionar laptops de alta calidad y servicio al cliente excepcional, haciendo la tecnología accesible para todos a través de opciones de pago flexibles.',
      },
      vision: {
        title: 'Nuestra Visión',
        text: 'Convertirnos en la plataforma líder de compra de laptops en América Latina, reconocidos por nuestra confiabilidad, servicio al cliente y soluciones de financiamiento innovadoras.',
      },
      values: {
        title: 'Nuestros Valores',
        items: [
          'Integridad en todas nuestras operaciones',
          'Satisfacción del cliente como prioridad',
          'Innovación en servicios y soluciones',
          'Compromiso con la calidad',
        ],
      },
      history: {
        title: 'Nuestra Historia',
        text: 'Fundada en 2024, hemos crecido de una pequeña startup a un nombre confiable en la venta de laptops, sirviendo a miles de clientes satisfechos en toda la región.',
      },
    },
  };

  const currentLang = content[language];

  return (
    <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <h1 className="text-4xl font-bold text-center mb-12">{currentLang.title}</h1>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className="text-white bg-blue-500 px-4 py-2 rounded-lg mb-8"
      >
        Back
      </button>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="flex items-center mb-4">
            <Building2 className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">{currentLang.mission.title}</h2>
          </div>
          <p>{currentLang.mission.text}</p>
        </div>

        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="flex items-center mb-4">
            <Globe className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">{currentLang.vision.title}</h2>
          </div>
          <p>{currentLang.vision.text}</p>
        </div>
      </div>

      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h2 className="text-2xl font-bold mb-6">{currentLang.values.title}</h2>
        <ul className="list-disc pl-6 space-y-2">
          {currentLang.values.items.map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ul>
      </div>

      <div className={`p-6 rounded-lg mt-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="flex items-center mb-4">
          <Shield className="w-8 h-8 mr-3" />
          <h2 className="text-2xl font-bold">{currentLang.history.title}</h2>
        </div>
        <p>{currentLang.history.text}</p>
      </div>
    </div>
  );
};

export default Info;
