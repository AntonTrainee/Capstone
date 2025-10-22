import { useReviews } from "../pages/ReviewsContext";

export default function HomeReviews() {
  const { reviews } = useReviews();

  if (reviews.length === 0) return null; // hide if no reviews

  return (
    <div className="reviews" style={{ marginTop: "110px" }}>
      <h2 className="text-center mb-4">Reviews and Testimonials</h2>

      <div
        id="reviewCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="4000"
        style={{ width: "100vw", marginTop: "10px", marginBottom: "50px" }}
      >
        <div className="carousel-inner text-center p-5 review-carousel rounded shadow">
          {reviews.map((rev, idx) => (
            <div
              key={rev.review_id}
              className={`carousel-item ${idx === 0 ? "active" : ""}`}
              data-bs-interval="4000"
            >
              <h5>{"⭐".repeat(rev.rating)}</h5>
              <p className="mb-1">
                <strong>{rev.comment}</strong>
              </p>
              <p className="text-muted">
                — {rev.name}, {rev.location}
              </p>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#reviewCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#reviewCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
        </button>
      </div>
    </div>
  );
}
