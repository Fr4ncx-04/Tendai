import React from 'react';
import { CreditCard, Truck, Shield } from 'lucide-react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const InfoSection: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const iconColor = theme === 'dark' ? 'text-green-300' : 'text-green-600';

  const textContent = {
    en: {
      installmentTitle: 'Up to 12 installments',
      installmentDesc: 'with credit cards',
      shippingTitle: 'Shipping nationwide',
      shippingDesc: 'via OCA',
      warrantyTitle: 'Official warranty',
      warrantyDesc: 'up to 24 months on all products',
    },
    es: {
      installmentTitle: 'Hasta 12 cuotas',
      installmentDesc: 'abonando con tarjetas de crédito',
      shippingTitle: 'Envíos a todo el país',
      shippingDesc: 'a través de OCA',
      warrantyTitle: 'Garantía oficial',
      warrantyDesc: 'de hasta 24 meses en todos los productos',
    },
  };

  const content = textContent[language];

  return (
    <section
      className={`container mx-auto py-16 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <div className={`flex items-center p-6 rounded-lg transition-transform duration-300 hover:transform hover:scale-105 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-white'
        } shadow-lg`}>
          <CreditCard className={`${iconColor} w-12 h-12 mr-4 flex-shrink-0`} />
          <div>
            <p className="font-bold text-lg mb-1">{content.installmentTitle}</p>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              {content.installmentDesc}
            </p>
          </div>
        </div>

        <div className={`flex items-center p-6 rounded-lg transition-transform duration-300 hover:transform hover:scale-105 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-white'
        } shadow-lg`}>
          <Truck className={`${iconColor} w-12 h-12 mr-4 flex-shrink-0`} />
          <div>
            <p className="font-bold text-lg mb-1">{content.shippingTitle}</p>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              {content.shippingDesc}
            </p>
          </div>
        </div>

        <div className={`flex items-center p-6 rounded-lg transition-transform duration-300 hover:transform hover:scale-105 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-white'
        } shadow-lg`}>
          <Shield className={`${iconColor} w-12 h-12 mr-4 flex-shrink-0`} />
          <div>
            <p className="font-bold text-lg mb-1">{content.warrantyTitle}</p>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              {content.warrantyDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;