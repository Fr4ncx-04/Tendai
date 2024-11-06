import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

interface MembershipModalProps {
  onClose: () => void;
}

const MembershipModal: React.FC<MembershipModalProps> = ({ onClose }) => {
  const { user, checkMembershipStatus } = useAuth();
  const { theme, language } = useThemeLanguage();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/memberships');
  };

  const isActive = checkMembershipStatus();
  const membership = user?.membership;
  const expiryDate = membership ? new Date(membership.expiryDate) : null;
  const daysLeft = expiryDate ? Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg p-6 max-w-md w-full mx-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {language === 'en' ? 'Membership Status' : 'Estado de Membresía'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {membership && isActive ? (
          <>
            <div className={`p-4 rounded-lg mb-4 ${membership.color}`}>
              <h3 className="text-xl font-bold text-white mb-2">{membership.name}</h3>
              <p className="text-white mb-4">
                {language === 'en' 
                  ? `${daysLeft} days remaining`
                  : `${daysLeft} días restantes`}
              </p>
              <h4 className="font-bold text-white mb-2">
                {language === 'en' ? 'Benefits:' : 'Beneficios:'}
              </h4>
              <ul className="list-disc list-inside text-white">
                {membership.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            {daysLeft <= 5 && (
              <div className="mb-4 text-yellow-500">
                {language === 'en' 
                  ? 'Your membership is about to expire! Renew now to keep your benefits.'
                  : '¡Tu membresía está por expirar! Renueva ahora para mantener tus beneficios.'}
              </div>
            )}
          </>
        ) : (
          <div className="mb-4">
            {language === 'en'
              ? 'You don\'t have an active membership.'
              : 'No tienes una membresía activa.'}
          </div>
        )}

        <button
          onClick={handleUpgrade}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          {membership && isActive
            ? (language === 'en' ? 'Upgrade Membership' : 'Mejorar Membresía')
            : (language === 'en' ? 'Get Membership' : 'Obtener Membresía')}
        </button>
      </div>
    </div>
  );
};

export default MembershipModal;