import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BeforeAfterAdd() {
  const [title, setTitle] = useState("");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!beforeFile || !afterFile) {
      alert("Both images are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("before", beforeFile);
    formData.append("after", afterFile);

    try {
      const res = await fetch("https://capstone-ni5z.onrender.com/beforeafter", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Post added successfully!");
        navigate("/beforeafter");
      } else {
        alert("Failed to add post.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error adding post.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add New Before & After</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Title:</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Before Image:</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBeforeFile(e.target.files?.[0] || null)}
            required
          />
          {beforeFile && (
            <div style={{ marginTop: "0.5rem" }}>
              <img
                src={URL.createObjectURL(beforeFile)}
                alt="Before preview"
                style={{ width: "120px", borderRadius: "6px" }}
              />
            </div>
          )}
        </div>

        <div>
          <label>After Image:</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAfterFile(e.target.files?.[0] || null)}
            required
          />
          {afterFile && (
            <div style={{ marginTop: "0.5rem" }}>
              <img
                src={URL.createObjectURL(afterFile)}
                alt="After preview"
                style={{ width: "120px", borderRadius: "6px" }}
              />
            </div>
          )}
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Save
        </button>
      </form>
    </div>
  );
}

export default BeforeAfterAdd;
