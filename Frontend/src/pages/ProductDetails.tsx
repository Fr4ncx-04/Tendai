import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { useReviews } from '../contexts/ReviewContext';
import { useCart } from '../contexts/CartContext';

const ProductDetails: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const [product, setProduct] = useState<any | null>(null);
  const [selectedMonths, setSelectedMonths] = useState(6);
  const [paymentPlan, setPaymentPlan] = useState<'contado' | 'credito'>('contado');
  const [showMonths, setShowMonths] = useState(false);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [showSpecs, setShowSpecs] = useState(false);
  const { reviewsByProduct, addReview, getProductReviews } = useReviews();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (id) {
        try {
          const response = await fetch(`http://localhost:3001/detalle-producto/${id}`);
          if (!response.ok) throw new Error('Producto no encontrado');

          const data = await response.json();
          setProduct({
            id: data.id,
            nombre: data.name,
            precio: data.price,
            descripcion: data.description,
            imagen: data.image,
            marca: data.brand,
            categoria: data.category,
            especificaciones: data.specs ? Object.entries(data.specs).map(([key, value]) => `${key}: ${value}`) : [],
            Calificacion: data.averageRating
          });
        } catch (error) {
          console.error("Error al obtener los detalles del producto:", error);
        }
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const fetchProductReviews = async () => {
      if (numericId) {
        await getProductReviews(numericId);
      }
    };

    fetchProductReviews();
  }, [numericId, getProductReviews]);

  const renderReviews = () => {
    const productReviews = reviewsByProduct[numericId] || [];
    if (productReviews.length === 0) return <p>No hay reseñas para este producto.</p>;

    return (
      <div>
        {productReviews.map((review) => (
          <div key={review.id} className="border p-4 mb-4 rounded">
            <div className="flex items-center">
              <Star className="text-yellow-500" />
              <span className="ml-2">{review.rating} estrellas</span>
            </div>
            <p className="mt-2">{review.comment}</p>
            <p className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString()}</p>
            <p className="text-gray-500 text-sm">Por: {review.userName}</p>
          </div>
        ))}
      </div>
    );
  };

  const handleBack = () => {
    navigate(-1); // Navega a la página anterior
  };

  const handlePaymentPlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plan = e.target.value as 'contado' | 'credito';
    setPaymentPlan(plan);
    setShowMonths(plan === 'credito');
  };

  const handleSubmitReview = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (userRating === 0) {
      alert(language === 'en' ? 'Please select a rating' : 'Por favor seleccione una calificación');
      return;
    }

    if (!userReview.trim()) {
      alert(language === 'en' ? 'Please write a review' : 'Por favor escriba una reseña');
      return;
    }

    try {
      await addReview(numericId, {
        userId: user.id_usuario,
        userName: user.name,
        numericId: product.id,
        rating: userRating,
        comment: userReview,
      });
      console.log('Datos a enviar:', {
        userId: user.id_usuario,
        numericId: product.id,
        rating: userRating,
        comment: userReview,
      });

      setUserReview('');
      setUserRating(0);
      alert(language === 'en' ? 'Review submitted successfully!' : '¡Reseña enviada con éxito!');
    } catch (error) {
      console.error('Error al enviar la reseña:', error);
      alert(language === 'en' ? 'Error submitting review' : 'Error al enviar la reseña');
    }
  };

  const handleAddToCart = async () => {
    if (!product || !user) {
      alert(language === 'en' ? 'Log in before adding products.' : 'Inicia sesion antes de agregar productos');
      return;
    }

    const cartItem = {
      id_usuario: user.id_usuario,
      id_producto: product.id,
      cantidad: cantidad,
      tipo_pago: paymentPlan,
      meses: paymentPlan === 'credito' ? selectedMonths : null,
    };

    // Agregar el producto al contexto del carrito
    addToCart(cartItem); // Esto actualizará cartItems en el contexto

    try {
      const response = await fetch('http://localhost:3001/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) throw new Error('Error al agregar el producto al carrito');

      alert(language === 'en' ? 'Product added to cart' : 'Producto agregado al carrito');
    } catch (error) {
      alert(language === 'en' ? 'Failed to add product to cart' : 'Error al agregar el producto al carrito');
      console.error(error);
    }
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <button onClick={handleBack} type="button" className="mt-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
          Volver
        </button>
      {product ? (
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <img src={product.imagen} alt={product.nombre} className="w-full rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.nombre}</h1>
            <p className="text-2xl font-bold mb-4">${product.precio}</p>
            <div className="flex items-center">
                <Star className="text-yellow-500  " size={20} />
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={`text-yellow-500 ${index < Math.round(product.Calificacion || 0) ? '★' : '☆'}`} />
                ))}
                <span className="ml-2 text-gray-500">({(product.Calificacion || 0).toFixed(1)})</span>
              </div>
            <p className="mb-6">{product.descripcion}</p>
            <div className="mb-6">
              <label className="block mb-2 font-semibold">
                {language === 'en' ? 'Payment Method' : 'Método de Pago'}
              </label>
              <select
                value={paymentPlan}
                onChange={handlePaymentPlanChange}
                className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <option value="contado">{language === 'en' ? 'Full Payment' : 'Pago Completo'}</option>
                <option value="credito">{language === 'en' ? 'Credit' : 'Crédito'}</option>
              </select>
            </div>
            {showMonths && (
              <div className="mb-6">
                <label className="block mb-2 font-semibold">
                  {language === 'en' ? 'Select Months' : 'Seleccionar Meses'}
                </label>
                <select
                  value={selectedMonths}
                  onChange={(e) => setSelectedMonths(Number(e.target.value))}
                  className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  {[3, 6, 12, 18, 24].map((month) => (
                    <option key={month} value={month}>
                      {month} {language === 'en' ? 'months' : 'meses'}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="mb-6 flex items-center justify-between">
              <div className={`flex items-center border rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setCantidad(cantidad > 1 ? cantidad - 1 : 1)} // Desactiva si cantidad es 1
                  className={`p-2 ${cantidad === 1 ? 'text-gray-400 cursor-not-allowed' : ''}`}
                  disabled={cantidad === 1}
                >
                  -
                </button>
                <span className="px-4">{cantidad}</span>
                <button
                  onClick={() => setCantidad(cantidad + 1)} // Siempre activo
                  className="p-2"
                >
                  +
                </button>
              </div>
            </div>
            <button onClick={handleAddToCart} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition mb-6">
              {language === 'en' ? 'Add to Cart' : 'Agregar al Carrito'}
            </button>
          </div>
          <div className='content mt-10'>
            <div className='relative'>
              <button
                onClick={() => setShowSpecs(!showSpecs)}
                className="flex items-center gap-2 text-blue-500 mb-2">
                {language === 'en' ? 'Specifications' : 'Especificaciones'}
                {showSpecs ? <ChevronUp /> : <ChevronDown />}
              </button>

              {showSpecs && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <table className="w-full border-collapse">
                    <tbody>
                      {product.especificaciones.map((spec: string, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                          <td className="p-2">{spec}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className='mt-10'>
              <h2 className='text-xl font-semibold mb-4'>{language === 'en' ? 'Reviews' : 'Reseñas'}</h2>
              <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder={language === 'en' ? 'Write your review...' : 'Escribe tu reseña...'}
                  className={`w-full p-2 border rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
                />
                <div className="flex items-center mb-2">
                  <label className="mr-2 font-semibold">
                    {language === 'en' ? 'Rating:' : 'Calificación:'}
                  </label>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`cursor-pointer ${userRating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
                      onClick={() => setUserRating(star)}
                    />
                  ))}
                </div>
                <button onClick={handleSubmitReview} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  {language === 'en' ? 'Submit Review' : 'Enviar Reseña'}
                </button>
              </div>
              {renderReviews()}
            </div>
          </div>
        </div>
      ) : (
        <p>{language === 'en' ? 'Loading product...' : 'Cargando producto...'}</p>
      )}
    </div>
  );
};

export default ProductDetails;
