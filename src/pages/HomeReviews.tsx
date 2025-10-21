// src/components/HomeReviews.tsx
import { useReviews } from "../pages/ReviewsContext";

export default function HomeReviews() {
  const { reviews } = useReviews();

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Reviews & Testimonials</h2>
      <div style={{ display: "flex", gap: "1rem", overflowX: "auto" }}>
        {reviews.map((rev) => (
          <div key={rev.id} style={{ minWidth: "200px", border: "1px solid #ccc", padding: "1rem", borderRadius: "6px" }}>
            <h4>{rev.name}</h4>
            <p><em>{rev.location}</em></p>
            <p>{"⭐".repeat(rev.rating)}</p>
            <p>{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
