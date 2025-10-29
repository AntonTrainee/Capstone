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

  // *** FUNCTIONS REMAIN UNCHANGED ***
  const fetchPosts = () => {
    fetch("https://capstone-ni5z.onrender.com/beforeafter")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching before/after posts:", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(
        `https://capstone-ni5z.onrender.com/beforeafter/${id}`,
        {
          method: "DELETE",
        }
      );

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
  // *** END OF UNCHANGED FUNCTIONS ***

  return (
    <div className="app-main-content">
      <div className="admin-card-container">
        <div className="card-header-bar">
          <h2 className="card-title">Before & After Management</h2>

          {/* Add New Button - Styled as a primary button */}
          <Link to="/beforeafter/add" className="btn-primary">
            + Add New Post
          </Link>
        </div>

        {/* Table Container */}
        <div className="table-responsive-wrapper">
          <table className="data-management-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Before Image</th>
                <th>After Image</th>
                <th>Date Created</th>
                <th className="action-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    No before & after posts found.
                  </td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td className="post-title-cell">{p.title}</td>
                    <td className="image-cell">
                      {/* Using the image-thumbnail class for better sizing */}
                      <a
                        href={p.before_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={p.before_url}
                          alt="Before"
                          className="image-thumbnail"
                        />
                      </a>
                    </td>
                    <td className="image-cell">
                      {/* Using the image-thumbnail class for better sizing */}
                      <a
                        href={p.after_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={p.after_url}
                          alt="After"
                          className="image-thumbnail"
                        />
                      </a>
                    </td>
                    <td>
                      {p.created_at
                        ? new Date(p.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="action-col">
                      {/* Delete Button - Styled as a danger button */}
                      <button
                        className="btn-danger"
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
    </div>
  );
}

export default BeforeAfter;
