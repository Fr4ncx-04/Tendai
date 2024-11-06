// BenefitsSection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import membershipTiers from '../pages/MembershipTiers'; 
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const BenefitsSection: React.FC = () => {
  const navigate = useNavigate();
  const { theme, language } = useThemeLanguage();

  const handleViewMemberships = () => {
    navigate('/Memberships');
  };

  const text = {
    en: {
      benefitsTitle: "Membership Benefits",
      acquireMembership: "Acquire Membership",
    },
    es: {
      benefitsTitle: "Beneficios por ser miembro",
      acquireMembership: "Adquirir membresía",
    },
  };

  const { benefitsTitle, acquireMembership } = text[language] || text.en;

  return (
    <section className={`container mx-auto py-12 px-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <h2 className="text-4xl font-bold text-center mb-8">{benefitsTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {membershipTiers.map((tier) => (
          <div
            key={tier.name}
            className={`${tier.color} p-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} rounded-lg shadow-lg overflow-hidden`}
          >
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <Star className="mr-2" size={20} />
                {tier.name}
              </h3>
              <ul className="mb-4">
                {tier.benefits.map((benefit, index) => (
                  <li key={index} className="mb-1 flex items-start">
                    <Star className="mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={handleViewMemberships}
          className={`${
            theme === 'dark' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-bold py-3 px-6 rounded transition duration-200`}
        >
          {acquireMembership}
        </button>
      </div>
    </section>
  );
};

export default BenefitsSection;
