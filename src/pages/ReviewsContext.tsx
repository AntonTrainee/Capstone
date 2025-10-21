import { createContext, useContext, useState, useEffect} from "react";
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

  // 🔄 Fetch all reviews from Supabase
  const refreshReviews = async () => {
    try {
      const res = await fetch("https://capstone-ni5z.onrender.com/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    }
  };

  useEffect(() => {
    refreshReviews();
  }, []);

  // ➕ Add review safely
  const addReview = async (r: Omit<Review, "review_id" | "created_at" | "updated_at">) => {
    try {
      const res = await fetch("https://capstone-ni5z.onrender.com/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...r, rating: Number(r.rating) }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to add review:", err);
        alert("Error adding review: " + (err.error || "Unknown error"));
        return;
      }

      // Refresh from server to make sure it's consistent
      await refreshReviews();
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Error adding review, check console");
    }
  };

  // ✏️ Update review safely
  const updateReview = async (id: number, r: Omit<Review, "review_id" | "created_at" | "updated_at">) => {
    try {
      const res = await fetch(`https://capstone-ni5z.onrender.com/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...r, rating: Number(r.rating) }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to update review:", err);
        alert("Error updating review: " + (err.error || "Unknown error"));
        return;
      }

      await refreshReviews();
    } catch (err) {
      console.error("Error updating review:", err);
      alert("Error updating review, check console");
    }
  };

  // ❌ Delete review safely
  const deleteReview = async (id: number) => {
    try {
      const res = await fetch(`https://capstone-ni5z.onrender.com/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to delete review:", err);
        alert("Error deleting review: " + (err.error || "Unknown error"));
        return;
      }

      await refreshReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Error deleting review, check console");
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
