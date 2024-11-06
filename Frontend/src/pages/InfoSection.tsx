// InfoSection.tsx
import React from 'react';
import { CreditCard, Truck, Shield } from 'lucide-react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const InfoSection: React.FC = () => {
    const {theme, language} = useThemeLanguage();
    const iconColor = theme === 'dark' ? 'text-green-300' : 'text-green-600';

    return (
        <section className={`info-section flex justify-around items-center my-8 w-full h-100${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
            <div className={`info-section flex justify-around items-center my-8 w-full h-100${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
            <div className="flex items-center">
            <CreditCard className={`mr-2 ${iconColor}`} size={24} />
                <div>
                <p className="font-bold">Hasta 12 cuotas</p>
                <p className="text-gray-500 text-sm">abonando con tarjetas de crédito</p>
                </div><hr />
            </div>
            <div className="flex items-center">
                <Truck className={`mr-2 ${iconColor}`} size={24}/>
                <div>
                <p className="font-bold">Envíos a todo el país</p>
                <p className="text-gray-500 text-sm">a través de OCA</p>
                </div><hr />
            </div>
            <div className="flex items-center">
                <Shield className={`mr-2 ${iconColor}`} size={24}/>
                <div>
                <p className="font-bold">Garantía oficial</p>
                <p className="text-gray-500 text-sm">de hasta 24 meses en todos los productos</p>
                </div><hr />
            </div>
            </div>
        </section>
    );
};

export default InfoSection;
