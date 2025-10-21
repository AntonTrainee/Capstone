// src/contexts/ReviewsContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";


export interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
}

interface ReviewsContextType {
  reviews: Review[];
  addReview: (r: Omit<Review, "id">) => void;
  updateReview: (id: number, r: Omit<Review, "id">) => void;
  deleteReview: (id: number) => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([
    // initial placeholder reviews
    { id: 1, name: "Maria L.", location: "Quezon City", rating: 5, comment: "Super professional." },
    { id: 2, name: "Kevin R.", location: "Taguig", rating: 5, comment: "Easy to book and reliable." },
  ]);

  const addReview = (r: Omit<Review, "id">) => {
    const newReview: Review = { id: Date.now(), ...r };
    setReviews([...reviews, newReview]);
  };

  const updateReview = (id: number, r: Omit<Review, "id">) => {
    setReviews(reviews.map((rev) => (rev.id === id ? { id, ...r } : rev)));
  };

  const deleteReview = (id: number) => {
    setReviews(reviews.filter((rev) => rev.id !== id));
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, updateReview, deleteReview }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error("useReviews must be used inside a ReviewsProvider");
  return context;
};
