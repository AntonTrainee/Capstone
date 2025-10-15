import { useEffect, useState } from "react";
import Navbar from "../components/navbar";

interface BeforeAfter {
  id: number;
  title: string;
  before_url: string;
  after_url: string;
  created_at: string;
}

function BeforeAndAfterShowcase() {
  const [posts, setPosts] = useState<BeforeAfter[]>([]);

  useEffect(() => {
    fetch("https://capstone-ni5z.onrender.com/beforeafter")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) =>
        console.error("Error fetching before/after showcase:", err)
      );
  }, []);

  return (
  <>
  <Navbar />

  <div className="container my-5">
      <h2 className="text-center mb-4">Before & After Showcase</h2>

      {posts.length === 0 ? (
        <p className="text-center">No showcase items yet.</p>
      ) : (
        <div className="row g-4">
          {posts.map((p) => (
            <div key={p.id} className="col-12">
              <div className="card shadow-sm border-0 p-3">
                <h5 className="text-center mb-3">{p.title}</h5>
                <div className="row">
                  {/* Before Image */}
                  <div className="col-md-6 text-center">
                    <img
                      src={p.before_url}
                      alt="Before"
                      className="img-fluid rounded"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                      onClick={() => window.open(p.before_url, "_blank")}
                    />
                    <p className="mt-2 fw-semibold text-muted">Before</p>
                  </div>

                  {/* After Image */}
                  <div className="col-md-6 text-center">
                    <img
                      src={p.after_url}
                      alt="After"
                      className="img-fluid rounded"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                      onClick={() => window.open(p.after_url, "_blank")}
                      
                    />
                    <p className="mt-2 fw-semibold text-success">After</p>
                  </div>
                </div>

                {/* Optional date shown in small text */}
                <p className="text-center text-muted mt-2" style={{ fontSize: "0.85rem" }}>
                  Posted on:{" "}
                  {p.created_at
                    ? new Date(p.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
  </div>
   <section className="contact-section" style={{marginTop:"220px"}}>
        <div className="contactcontainer">
          <h2 className="contact-title">Contact Us</h2>

          <div className="contact-grid">
            <div>
              <p>
                <span className="bold">Email:</span> inquiries@genclean.com.ph
              </p>
              <p className="bold">Phone Numbers:</p>
              <div className="phone-grid">
                <ul>
                  <li>82546323</li>
                  <li>277385555</li>
                </ul>
                <ul>
                  <li>09260193470</li>
                  <li>09543174179</li>
                </ul>
              </div>
            </div>
            <div>
              <p className="bold">Address:</p>
              <p>
                Unit 114, 2nd Floor, Corinthian Executive Regency,
                <br />
                Ortigas Ave., San Antonio, Pasig City
              </p>
            </div>
          </div>
        </div>
      </section>
  
  </>
  );
}

export default BeforeAndAfterShowcase;

