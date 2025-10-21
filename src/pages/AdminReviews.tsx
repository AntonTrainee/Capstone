import { useState } from "react";
import { useReviews } from "../pages/ReviewsContext";

export default function AdminReviews() {
  const { reviews, addReview, updateReview, deleteReview } = useReviews();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", location: "", rating: 5, comment: "" });

  const startEdit = (rev: any) => {
    setEditingId(rev.id);
    setForm({ name: rev.name, location: rev.location, rating: rev.rating, comment: rev.comment });
  };

  const handleSubmit = () => {
    if (editingId) {
      updateReview(editingId, form);
      setEditingId(null);
    } else {
      addReview(form);
    }
    setForm({ name: "", location: "", rating: 5, comment: "" });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "1.5rem", color: "#007b9e" }}>Admin Reviews</h2>

      {/* Form */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
          backgroundColor: "#f4f7f9",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <input
          style={{ flex: "1 1 150px", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          style={{ flex: "1 1 150px", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          type="number"
          min={1}
          max={5}
          style={{ width: "80px", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        />
        <textarea
          style={{
            flex: "2 1 300px",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            minHeight: "60px",
          }}
          placeholder="Comment"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
        <button
          style={{
            backgroundColor: "#007b9e",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={handleSubmit}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <thead style={{ backgroundColor: "#007b9e", color: "#fff" }}>
          <tr>
            <th style={{ padding: "0.75rem" }}>Name</th>
            <th style={{ padding: "0.75rem" }}>Location</th>
            <th style={{ padding: "0.75rem" }}>Rating</th>
            <th style={{ padding: "0.75rem" }}>Comment</th>
            <th style={{ padding: "0.75rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((rev) => (
            <tr key={rev.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "0.75rem" }}>{rev.name}</td>
              <td style={{ padding: "0.75rem" }}>{rev.location}</td>
              <td style={{ padding: "0.75rem" }}>{rev.rating}</td>
              <td style={{ padding: "0.75rem" }}>{rev.comment}</td>
              <td style={{ padding: "0.75rem" }}>
                <button
                  onClick={() => startEdit(rev)}
                  style={{
                    backgroundColor: "#ffc107",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.25rem 0.5rem",
                    marginRight: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteReview(rev.id)}
                  style={{
                    backgroundColor: "#dc3545",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer",
                    color: "#fff",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
