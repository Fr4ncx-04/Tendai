import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Star, LogOut, Search, ArrowRight, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import MembershipModal from './MembershipModal';
import { useCart } from '../contexts/CartContext';
import membershipTiers from '../pages/MembershipTiers';

const Header: React.FC = () => {
  const { isLoggedIn, user, logout, checkMembershipStatus } = useAuth();
  const { theme, language, toggleTheme, setLanguage } = useThemeLanguage();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const navigate = useNavigate();
  

  const getMembershipColor = () => {
    if (!user?.membership || !checkMembershipStatus()) {
      return 'text-gray-400';
    }
    const membershipName = typeof user.membership === 'string' ? user.membership : '';
    const membership = membershipTiers.find(tier => tier.name === membershipName);
  
    return membership ? membership.color : 'text-gray-400';
};
  

  const handleStarClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setShowMembershipModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      console.log('Search query is empty');
    }
  };

  const toggleSearch = () => {
    setIsSearchActive((prev) => !prev);
    if (isSearchActive) {
      setSearchQuery('');
    }
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/cart');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (isSearchActive) {
      toggleSearch();
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (isSearchActive && !target.closest('.search-container')) {
      setIsSearchActive(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchActive]);

  const handleLanguageChange = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  };

  return (
    <header className={`h-32 items-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'} p-4`}>
      <div className="container mx-auto flex justify-between items-center p-1">
        <Link to="/" className={`flex items-center ${theme === 'dark' ? 'text-white text-2xl' : 'text-black text-2xl'} uppercase font-bold tracking-[4px] p-4`}>
          <img src="/img/Logo.jpeg" alt="Logo" className="h-6 w-6 rounded-full mr-2" />
          <span className="hidden md:inline">{language === 'en' ? 'Tendai' : 'Tendai'}</span>
        </Link>

        <div className="relative flex items-center search-container">
          <button onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <span className="text-xl">X</span> : <Menu className="text-xl" />}
          </button>

          <div className={`flex items-center transition-all duration-300 ${isSearchActive ? 'w-auto' : 'w-0 overflow-hidden'}`}>
            {isSearchActive && (
              <form onSubmit={handleSearch} className={`relative flex items-center transition-all duration-300 ease-in-out`}>
                <input
                  type="text"
                  className={`ml-1 p-2 rounded-md ease-in-out w-64 outline-none ${theme === 'dark' ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}
                  placeholder={language === 'en' ? 'Search products...' : 'Buscar productos...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  className={`text-white p-2 ml-1 ${theme === 'dark' ? 'bg-green-400 rounded-md hover:bg-green-600' : 'bg-gray-400 rounded-md hover:bg-gray-500'}`}
                >
                  <ArrowRight />
                </button>
              </form>
            )}
          </div>

          {!isSearchActive && (
            <button
              className={`text-white p-2 ml-1 ${theme === 'dark' ? 'bg-green-400 rounded-md hover:bg-green-600' : 'bg-gray-400 rounded-md hover:bg-gray-500'}`}
              onClick={toggleSearch}
            >
              <Search />
            </button>
          )}
        </div>

        <nav className={`flex items-center space-x-4 ${isMenuOpen ? 'block md:hidden' : 'hidden md:flex'}`}>
          <button onClick={handleCartClick} className="hover:text-gray-300 relative">
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-white bg-red-500 rounded-full px-2 py-1 text-xs">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={toggleTheme} className="hover:text-gray-300">
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>

          <button
            onClick={handleLanguageChange}
            className={`p-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} hidden md:block`}
          >
            {language === 'en' ? 'ES' : 'EN'}
          </button>

          {isLoggedIn ? (
            <>
          <button className={`p-2`} onClick={handleStarClick}>
          <Star style={{stroke: getMembershipColor(),strokeWidth: 2}}className="custom-star"/>
          </button>
              <div className="mr-2">
                {language === 'en' ? 'Welcome' : 'Bienvenido'} {user?.name}
              </div>
              <Link to="/AccountSettings" className="hover:text-gray-300">
                <User />
              </Link>
              <button className="hover:text-gray-300" onClick={handleLogout}>
                <LogOut />
              </button>
            </>
          ) : (
            <div>
              <Link to="/login" className="hover:text-gray-300">
                {language === 'en' ? 'Login' : 'Iniciar sesión'}
              </Link>
            </div>
          )}
        </nav>
      </div>

      {isMenuOpen && (
        <div className="bg-gray-100 md:hidden p-4 absolute w-full z-50" style={{ top: '10rem' }}>
          <ul className="space-y-2">
            <li>
              <Link to="/cart" onClick={toggleMenu} className="block hover:text-gray-600">
                Carrito
              </Link>
            </li>
            <li>
              <Link to="/Memberships" onClick={toggleMenu} className="block hover:text-gray-600">
                Membresías
              </Link>
            </li>
            <li>
              <Link to="/AccountSettings" onClick={toggleMenu} className="block hover:text-gray-600">
                Cuenta
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={toggleMenu} className="block hover:text-gray-600">
                Iniciar sesión
              </Link>
            </li>
          </ul>
        </div>
      )}

{showMembershipModal && <MembershipModal onClose={() => setShowMembershipModal(false)} />}

      {/* Mostrar barra de búsqueda debajo del navbar solo en móviles */}
      {isSearchActive && window.innerWidth <= 768 && (
        <div className={`w-full bg-gray-100 p-4 fixed top-32 z-20 transition-all duration-300 ease-in-out`}>
          <form onSubmit={handleSearch} className={`flex items-center`}>
            <input
              type="text"
              className={`p-2 rounded-md ${theme === 'dark' ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}
              placeholder={language === 'en' ? 'Search products...' : 'Buscar productos...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
            />
            <button
              type="submit"
              className={`text-white p-2 ml-1 ${theme === 'dark' ? 'bg-green-400 rounded-md hover:bg-green-600' : 'bg-gray-400 rounded-md hover:bg-gray-500'}`}
            >
              <ArrowRight />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
