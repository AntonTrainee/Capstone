// src/pages/AdminReviews.tsx
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
    <div style={{ padding: "2rem" }}>
      <h2>Admin Reviews</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
        <input placeholder="Comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
        <button onClick={handleSubmit}>{editingId ? "Update" : "Add"}</button>
      </div>

      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((rev) => (
            <tr key={rev.id}>
              <td>{rev.name}</td>
              <td>{rev.location}</td>
              <td>{rev.rating}</td>
              <td>{rev.comment}</td>
              <td>
                <button onClick={() => startEdit(rev)}>Edit</button>
                <button onClick={() => deleteReview(rev.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
