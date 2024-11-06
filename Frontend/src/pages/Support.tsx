import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For React Router v6+
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { MessageCircle, Phone, Mail, HelpCircle, FileText, ShieldCheck } from 'lucide-react';

const Support: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate(); // Navigate hook

  const content = {
    en: {
      title: 'Customer Support',
      subtitle: 'How can we help you today?',
      categories: {
        title: 'Help Categories',
        items: [
          { id: 'orders', name: 'Orders & Shipping', icon: FileText },
          { id: 'payments', name: 'Payments & Financing', icon: ShieldCheck },
          { id: 'technical', name: 'Technical Support', icon: HelpCircle },
          { id: 'warranty', name: 'Warranty Claims', icon: ShieldCheck },
        ],
      },
      contact: {
        title: 'Contact Us',
        chat: 'Live Chat',
        phone: 'Call Us',
        email: 'Email Support',
        hours: 'Available 24/7',
        phoneNumber: '1-800-LAPTOPS',
        emailAddress: 'support@tendai.com',
      },
    },
    es: {
      title: 'Soporte al Cliente',
      subtitle: '¿Cómo podemos ayudarte hoy?',
      search: 'Buscar ayuda...',
      categories: {
        title: 'Categorías de Ayuda',
        items: [
          { id: 'orders', name: 'Pedidos y Envíos', icon: FileText },
          { id: 'payments', name: 'Pagos y Financiamiento', icon: ShieldCheck },
          { id: 'technical', name: 'Soporte Técnico', icon: HelpCircle },
          { id: 'warranty', name: 'Reclamos de Garantía', icon: ShieldCheck },
        ],
      },
      contact: {
        title: 'Contáctanos',
        chat: 'Chat en Vivo',
        phone: 'Llámanos',
        email: 'Soporte por Email',
        hours: 'Disponible 24/7',
        phoneNumber: '1-800-LAPTOPS',
        emailAddress: 'soporte@tendai.com',
      },
    },
  };

  const currentLang = content[language];

  return (
    <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <h1 className="text-4xl font-bold text-center mb-4">{currentLang.title}</h1>
      <p className="text-center text-xl mb-8">{currentLang.subtitle}</p>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className="text-white bg-blue-500 px-4 py-2 rounded-lg mb-8"
      >
        Back
      </button>

      {/* Help Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{currentLang.categories.title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentLang.categories.items.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-lg flex flex-col items-center text-center transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                } ${selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''}`}
              >
                <Icon className="w-8 h-8 mb-3" />
                <span className="font-semibold">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact Options */}
      <div className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h2 className="text-2xl font-bold mb-6">{currentLang.contact.title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 mr-4" />
            <div>
              <h3 className="font-semibold">{currentLang.contact.chat}</h3>
              <p>{currentLang.contact.hours}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Phone className="w-8 h-8 mr-4" />
            <div>
              <h3 className="font-semibold">{currentLang.contact.phone}</h3>
              <p>{currentLang.contact.phoneNumber}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Mail className="w-8 h-8 mr-4" />
            <div>
              <h3 className="font-semibold">{currentLang.contact.email}</h3>
              <p>{currentLang.contact.emailAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
