import React from 'react';
import { CreditCard, Truck, Shield } from 'lucide-react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const InfoSection: React.FC = () => {
    const { theme, language } = useThemeLanguage();
    const iconColor = theme === 'dark' ? 'text-green-300' : 'text-green-600';

    const textContent = {
        en: {
            installmentTitle: "Up to 12 installments",
            installmentDesc: "with credit cards",
            shippingTitle: "Shipping nationwide",
            shippingDesc: "via OCA",
            warrantyTitle: "Official warranty",
            warrantyDesc: "up to 24 months on all products"
        },
        es: {
            installmentTitle: "Hasta 12 cuotas",
            installmentDesc: "abonando con tarjetas de crédito",
            shippingTitle: "Envíos a todo el país",
            shippingDesc: "a través de OCA",
            warrantyTitle: "Garantía oficial",
            warrantyDesc: "de hasta 24 meses en todos los productos"
        }
    };

    const content = textContent[language];

    return (
        <section className={`info-section flex justify-around items-center my-8 w-full h-100 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
            <div className="flex items-center">
                <CreditCard className={`mr-2 ${iconColor}`} size={24} />
                <div>
                    <p className="font-bold">{content.installmentTitle}</p>
                    <p className="text-gray-500 text-sm">{content.installmentDesc}</p>
                </div>
                <hr />
            </div>
            <div className="flex items-center">
                <Truck className={`mr-2 ${iconColor}`} size={24} />
                <div>
                    <p className="font-bold">{content.shippingTitle}</p>
                    <p className="text-gray-500 text-sm">{content.shippingDesc}</p>
                </div>
                <hr />
            </div>
            <div className="flex items-center">
                <Shield className={`mr-2 ${iconColor}`} size={24} />
                <div>
                    <p className="font-bold">{content.warrantyTitle}</p>
                    <p className="text-gray-500 text-sm">{content.warrantyDesc}</p>
                </div>
                <hr />
            </div>
        </section>
    );
};

export default InfoSection;
