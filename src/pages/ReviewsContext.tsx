// src/contexts/ReviewsContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface Review {
  review_id: number; // match your DB primary key
  user_id?: number; // optional, if you have it
  name?: string; // optional
  location?: string; // optional
  service?: string;
  rating: number;
  comment?: string;
  created_at?: string;
  updated_at?: string;
}

interface ReviewsContextType {
  reviews: Review[];
  addReview: (r: Omit<Review, "review_id" | "created_at" | "updated_at">) => Promise<void>;
  updateReview: (
    id: number,
    r: Omit<Review, "review_id" | "created_at" | "updated_at">
  ) => Promise<void>;
  deleteReview: (id: number) => Promise<void>;
  refreshReviews: () => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Fetch all reviews from backend
  const refreshReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    refreshReviews();
  }, []);

  // Add a review
  const addReview = async (r: Omit<Review, "review_id" | "created_at" | "updated_at">) => {
    try {
      const res = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(r),
      });
      if (!res.ok) throw new Error("Failed to add review");
      const newReview = await res.json();
      setReviews((prev) => [...prev, newReview]);
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  // Update a review
  const updateReview = async (
    id: number,
    r: Omit<Review, "review_id" | "created_at" | "updated_at">
  ) => {
    try {
      const res = await fetch(`http://localhost:5000/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(r),
      });
      if (!res.ok) throw new Error("Failed to update review");
      const updatedReview = await res.json();
      setReviews((prev) => prev.map((rev) => (rev.review_id === id ? updatedReview : rev)));
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  // Delete a review
  const deleteReview = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      setReviews((prev) => prev.filter((rev) => rev.review_id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <ReviewsContext.Provider
      value={{ reviews, addReview, updateReview, deleteReview, refreshReviews }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error("useReviews must be used inside a ReviewsProvider");
  return context;
};
