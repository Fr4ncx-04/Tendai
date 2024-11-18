import React from 'react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Carousel: React.FC = () => {
  const { theme } = useThemeLanguage();
  
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf',
      alt: 'Gaming Laptop',
      title: 'Gaming Laptops',
      description: 'Ultimate performance for gaming enthusiasts'
    },
    {
      src: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
      alt: 'Professional Laptop',
      title: 'Professional Series',
      description: 'Powerful tools for professionals'
    },
    {
      src: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
      alt: 'Business Laptop',
      title: 'Business Solutions',
      description: 'Reliable performance for your business'
    }
  ];

  return (
    <div className={`carousel-container ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="h-[500px]"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
                <h2 className="text-4xl font-bold mb-4">{image.title}</h2>
                <p className="text-xl">{image.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;