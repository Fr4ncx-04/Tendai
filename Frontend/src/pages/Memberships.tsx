import React from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { useAuth } from '../contexts/AuthContext';
import membershipTiers from '../pages/MembershipTiers'; // Cambia esto a la ruta correcta

interface MembershipTier {
  name: string;
  price: number;
  color: string;
  benefits: string[];
}

const Memberships: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const { isLoggedIn, user } = useAuth(); // Suponemos que user contiene la membresía actual
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleNavigateToPayment = (tier: MembershipTier) => {
    navigate('/payment', { state: { membership: tier } });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!isLoggedIn) {
    return null; // o un spinner de carga
  }

  return (
    <div className={`container mx-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex items-center mb-8">
        <button onClick={handleGoBack} className={`transition duration-200 flex items-center font-bold ${theme === 'dark' ? 'text-gray-100 hover:text-white' : 'text-gray-800 hover:text-gray-900'}`}>
          <ArrowLeft className="mr-2" />
          {language === 'en' ? 'Go Back' : 'Regresar'}
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-8">{language === 'en' ? 'Get a Membership' : 'Obten una membresia'}</h1>

      {/* Mostrar membresía activa */}
      {user?.membership && (
        <div className="bg-blue-500 p-4 text-white rounded-lg mb-4">
          <h2 className="text-2xl font-bold">{language === 'en' ? 'Active Membership' : 'Membresía Activa'}</h2>
          <p>{`${language === 'en' ? 'Current Tier: ' : 'Nivel Actual: '} ${user.membership.name}`}</p>
          <p>{`${language === 'en' ? 'Expires on: ' : 'Expira el: '} ${new Date(user.membership.expiryDate).toLocaleDateString()}`}</p>
          <div className="mt-4">
            <button className="mr-2 bg-red-500 hover:bg-red-600 p-2 rounded" onClick={() => {/* Lógica para cancelar membresía */}}>
              {language === 'en' ? 'Cancel Membership' : 'Cancelar Membresía'}
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded" onClick={() => {/* Lógica para actualizar membresía */}}>
              {language === 'en' ? 'Upgrade Membership' : 'Actualizar Membresía'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {membershipTiers.map((tier) => (
          <div key={tier.name} className={`${tier.color} p-1 text-white rounded-lg shadow-lg overflow-hidden`}>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Star className={`mr-2  ${tier.color}`} style={{ borderColor: tier.color }} />
                {tier.name}
              </h2>
              <p className="text-4xl font-bold mb-6">${tier.price} <span className="text-sm font-normal">/ {language === 'en' ? 'month' : 'mes'}</span></p>
              <ul className="mb-6">
                {tier.benefits.map((benefit, index) => (
                  <li key={index} className="mb-2 flex items-start">
                    <Star className={`mr-2 mt-1 flex-shrink-0 border-2 ${tier.color}`} style={{ borderColor: tier.color }} size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleNavigateToPayment(tier)}
                className="w-full bg-white text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-200 transition duration-200"
              >
                {language === 'en' ? `Get ${tier.name}` : `Adquirir ${tier.name}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Memberships;
