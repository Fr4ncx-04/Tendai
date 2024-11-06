// BenefitsSection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import membershipTiers  from '../pages/MembershipTiers'; // Ensure it's imported correctly

const BenefitsSection: React.FC = () => {
  const navigate = useNavigate();

  const handleViewMemberships = () => {
    navigate('/Memberships');
  };

  return (
    <section className="container mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold text-center mb-8">Beneficios por ser miembro</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {membershipTiers.map((tier) => (
          <div
            key={tier.name}
            className={`${tier.color} p-1 text-white rounded-lg shadow-lg overflow-hidden`}
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
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded transition duration-200"
        >
          Adquirir membresia
        </button>
      </div>
    </section>
  );
};

export default BenefitsSection;
