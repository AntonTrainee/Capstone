import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface BeforeAfter {
  id: number;
  title: string;
  before_url: string;
  after_url: string;
  created_at: string;
}

function BeforeAfter() {
  const [posts, setPosts] = useState<BeforeAfter[]>([]);

  // Fetch posts from backend
  const fetchPosts = () => {
    fetch("http://localhost:3007/beforeafter")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching before/after posts:", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Delete a post
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:3007/beforeafter/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Post deleted!");
        fetchPosts(); // refresh table
      } else {
        alert("Failed to delete post.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <div className="section-container">
      <h2>Before & After</h2>

      {/* Add New Button */}
      <div className="view-more" style={{ marginBottom: "1rem" }}>
        <Link to="/beforeafter/add">+ Add New</Link>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Before Image</th>
              <th>After Image</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No posts yet
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>
                    <a href={p.before_url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={p.before_url}
                        alt="Before"
                        style={{ width: "80px", borderRadius: "6px", cursor: "pointer" }}
                      />
                    </a>
                  </td>
                  <td>
                    <a href={p.after_url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={p.after_url}
                        alt="After"
                        style={{ width: "80px", borderRadius: "6px", cursor: "pointer" }}
                      />
                    </a>
                  </td>
                  <td>
                    {p.created_at
                      ? new Date(p.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      style={{
                        padding: "4px 8px",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BeforeAfter;
