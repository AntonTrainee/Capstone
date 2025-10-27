import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BeforeAfterAdd() {
  const [title, setTitle] = useState("");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // *** HANDLER FUNCTION IS UNCHANGED ***
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
      const res = await fetch(
        "https://capstone-ni5z.onrender.com/beforeafter",
        {
          method: "POST",
          body: formData,
        }
      );

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
    <div className="admin-page-container">
      <div className="form-card-container">
        {/* Blue Header Bar from Figma Design */}
        <div className="form-header-bar">Add New Before & After</div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="form-content"
        >
          {/* Title Input */}
          <div className="form-group title-group">
            <label htmlFor="title-input">Title:</label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Image Inputs Wrapper - Uses Flexbox for side-by-side layout */}
          <div className="image-inputs-flex-wrapper">
            {/* Before Image Input & Preview */}
            <div className="form-group image-group">
              <label htmlFor="before-file-input">Before Image:</label>
              <div className="file-input-wrapper">
                {/* Note: In modern HTML/CSS, the input[type="file"] style is hard to control. 
                    The CSS here provides basic styling for the labels/containers. */}
                <input
                  id="before-file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBeforeFile(e.target.files?.[0] || null)}
                  required
                />
              </div>

              {/* Image Preview - Kept original inline style for preview logic */}
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

            {/* After Image Input & Preview */}
            <div className="form-group image-group">
              <label htmlFor="after-file-input">After Image:</label>
              <div className="file-input-wrapper">
                <input
                  id="after-file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAfterFile(e.target.files?.[0] || null)}
                  required
                />
              </div>

              {/* Image Preview - Kept original inline style for preview logic */}
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
          </div>

          {/* Save Button - Positioned to the bottom right */}
          <div className="save-button-wrapper">
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BeforeAfterAdd;
