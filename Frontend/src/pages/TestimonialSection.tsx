import React from 'react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { User } from 'lucide-react'; // Importa el ícono

interface Testimonial {
  name: string;
  platform: string;
  text: { es: string; en: string };
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    name: ' Ernesto',
    platform: 'Tendai',
    text: { es: 'Excelente servicio, atención y producto!!!!', en: 'Excellent service, attention, and product!!!!' },
  },
  {
    name: 'Franco',
    platform: 'Tendai',
    text: { es: 'Excelente servicio al cliente.', en: 'Excellent customer service.' },
  },
  {
    name: 'Jonathan',
    platform: 'Tendai',
    text: { es: 'Muy amable y atento con el envío', en: 'Very kind and attentive with the shipping' },
  },
  {
    name: 'Cesar',
    platform: 'Tendai',
    text: { es: 'Muy buen servicio, cumplieron con la garantía del dron.', en: 'Great service, fulfilled the drone’s warranty.' },
  }
];

const TestimonialsSection: React.FC = () => {
  const { theme, language } = useThemeLanguage();

  return (
    <section className={`py-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
      <h2 className={`text-2xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        {language === 'es' ? 'Lo que dicen nuestros clientes' : 'What Our Customers Say'}
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {testimonials.map((testimonial, index) => (
          <div key={index} className={`bg-white rounded-lg p-4 w-full md:w-1/2 lg:w-1/3 shadow-md transition-opacity duration-700 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
            <div className="flex items-center">
              {testimonial.image ? (
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                  <User className="text-gray-500" /> {/* Ícono de usuario */}
                </div>
              )}
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">★★★★★</span>
                  <span>{testimonial.platform}</span>
                </div>
                <span className="font-semibold">{testimonial.name}</span>
              </div>
            </div>
            <p className="mt-4">{testimonial.text[language]}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <a
          href="#"
          className={`text-green-500 ${theme === 'dark' ? 'text-green-300' : 'text-green-500'}`}
        >
          {language === 'es' ? 'Comparte tu experiencia' : 'Share Your Experience'}
        </a>
      </div>
    </section>
  );
};

export default TestimonialsSection;
