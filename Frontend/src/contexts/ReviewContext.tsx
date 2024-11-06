import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Review {
  id: number;
  userId: number;
  userName: string;
  numericId: number;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewContextType {
  reviews: Review[];
  reviewsByProduct: { [key: number]: Review[] }; 
  addReview: (numericId: number, review: Omit<Review, 'id' | 'date'>) => Promise<void>;
  getProductReviews: (numericId: number) => Promise<Review[]>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsByProduct, setReviewsByProduct] = useState<{ [key: number]: Review[] }>({});

  const addReview = async (numericId: number, review: Omit<Review, 'id' | 'date'>) => {
    try {
      const response = await fetch(`http://localhost:3001/send-reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...review, numericId }), 
      });
  
      if (response.ok) {
        const newReview = await response.json(); 
  
        // Crear la reseña en el formato correcto
        const createdReview: Review = {
          ...review,
          id: newReview.id, 
          numericId,
          date: newReview.date || new Date().toISOString(), // Tomamos la fecha del servidor, si está disponible
        };
  
        // Actualizar estado
        setReviews((prev) => [...prev, createdReview]);
        setReviewsByProduct((prev) => ({
          ...prev,
          [numericId]: [...(prev[numericId] || []), createdReview],
        }));
      } else {
        console.error('Error adding review:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };
  

  const getProductReviews = async (productId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/get-reviews/${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const formattedReviews: Review[] = data.map((review: any) => ({
        id: review.id,
        userId: review.userId,
        userName: review.user,
        productId: Number(review.productId),
        rating: review.rating,
        comment: review.comment,
        date: review.date,
      }));

      setReviewsByProduct((prev) => ({
        ...prev,
        [productId]: formattedReviews,
      }));

      return formattedReviews;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      return [];
    }
  };

  return (
    <ReviewContext.Provider value={{ reviews, reviewsByProduct, addReview, getProductReviews }}>
      {children}
    </ReviewContext.Provider>
  );
};
