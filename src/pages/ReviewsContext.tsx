import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface Review {
  review_id: number;
  name: string;
  location: string;
  rating: number;
  comment?: string;
  created_at?: string;
  updated_at?: string;
}

interface ReviewsContextType {
  reviews: Review[];
  addReview: (r: Omit<Review, "review_id" | "created_at" | "updated_at">) => Promise<void>;
  updateReview: (id: number, r: Omit<Review, "review_id" | "created_at" | "updated_at">) => Promise<void>;
  deleteReview: (id: number) => Promise<void>;
  refreshReviews: () => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const refreshReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshReviews();
  }, []);

  const addReview = async (r: Omit<Review, "review_id" | "created_at" | "updated_at">) => {
    try {
      const res = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(r),
      });
      const newReview = await res.json();
      setReviews(prev => [...prev, newReview]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateReview = async (id: number, r: Omit<Review, "review_id" | "created_at" | "updated_at">) => {
    try {
      const res = await fetch(`http://localhost:5000/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(r),
      });
      const updated = await res.json();
      setReviews(prev => prev.map(rev => rev.review_id === id ? updated : rev));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReview = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/reviews/${id}`, { method: "DELETE" });
      setReviews(prev => prev.filter(rev => rev.review_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, updateReview, deleteReview, refreshReviews }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error("useReviews must be inside ReviewsProvider");
  return context;
};
