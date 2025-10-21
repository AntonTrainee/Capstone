require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const { Pool } = require("pg");
const { createClient } = require("@supabase/supabase-js"); // ✅ Supabase added

// OTP Controller
const { sendOTP, verifyOTP } = require("./otpController.js");

const app = express();
const PORT = process.env.PORT || 3007;

// ================== Middleware ==================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// ================== PostgreSQL Connection ==================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database error:", err.message));

// ================== Auth Middleware ==================
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "yoursecret");
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ================== OTP Routes ==================
app.post("/send-otp", sendOTP);
app.post("/verify-otp", verifyOTP);

// ================== REGISTER ==================
app.post("/register", async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (first_name, last_name, phone_number, email, password)
       VALUES ($1, $2, $3, $4, $5)`,
      [firstName, lastName, phoneNumber, email, hashedPassword]
    );

    res.status(200).json({ success: true, message: "Registered successfully" });
  } catch (err) {
    console.error("❌ Error inserting user:", err);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
});

// ================== LOGIN ==================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: "customer" },
      process.env.JWT_SECRET || "yoursecret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== PASSWORD RESET ==================
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: "No account found with that email" });
    }

    const user = result.rows[0];
    const resetToken = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET || "yoursecret",
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:${PORT}/resetpassword?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p><a href="${resetLink}">Reset Password</a>`,
    });

    res.status(200).json({ success: true, message: "Password reset email sent!" });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "yoursecret");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [hashedPassword, decoded.user_id]);
    res.status(200).json({ success: true, message: "Password reset successful!" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ success: false, message: "Invalid or expired token" });
  }
});

// ======================= ADMIN LOGIN =======================
app.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM "Admins" WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET || "yoursecret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.user_name,
        createdAt: admin.created_at,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================= ADMIN REGISTER =======================
app.post("/admin-register", async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO "Admins" (user_name, email, password_hash) VALUES ($1, $2, $3)`;
    await pool.query(query, [userName, email, hashedPassword]);
    res.status(200).send("Admin registered successfully");
  } catch (err) {
    console.error("Error inserting admin:", err);
    res.status(500).send("Error registering admin");
  }
});

// ======================= MULTER CONFIG =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Make uploads publicly accessible
app.use("/uploads", express.static("uploads"));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post(
  "/beforeafter",
  upload.fields([{ name: "before" }, { name: "after" }]),
  async (req, res) => {
    try {
      const { title } = req.body;
      if (!req.files["before"] || !req.files["after"]) {
        return res.status(400).json({ error: "Both before and after images are required" });
      }

      const beforeFile = req.files["before"][0];
      const afterFile = req.files["after"][0];

      const beforeFileName = `before-${Date.now()}${path.extname(beforeFile.originalname)}`;
      const afterFileName = `after-${Date.now()}${path.extname(afterFile.originalname)}`;

      // Upload to Supabase
      const { error: beforeError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(beforeFileName, fs.readFileSync(beforeFile.path), {
          contentType: beforeFile.mimetype,
          upsert: false,
        });

      const { error: afterError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(afterFileName, fs.readFileSync(afterFile.path), {
          contentType: afterFile.mimetype,
          upsert: false,
        });

      if (beforeError || afterError) {
        console.error("Supabase upload error:", beforeError || afterError);
        return res.status(500).json({ error: "Upload to Supabase failed" });
      }

      const { data: beforePublic } = supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .getPublicUrl(beforeFileName);
      const { data: afterPublic } = supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .getPublicUrl(afterFileName);

      const result = await pool.query(
        "INSERT INTO before_after (title, before_url, after_url) VALUES ($1, $2, $3) RETURNING *",
        [title, beforePublic.publicUrl, afterPublic.publicUrl]
      );

      fs.unlinkSync(beforeFile.path);
      fs.unlinkSync(afterFile.path);

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("❌ Error inserting post:", err);
      res.status(500).json({ error: "Failed to insert post" });
    }
  }
);

// ======================= FETCH BEFORE & AFTER (SUPABASE VERSION) =======================
app.get("/beforeafter", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM before_after ORDER BY id DESC");
    const posts = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      before_url: row.before_url,
      after_url: row.after_url,
      created_at: row.created_at,
    }));

    res.status(200).json(posts);
  } catch (err) {
    console.error("❌ Error fetching before/after posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// ======================= DELETE PICS =======================
app.delete("/beforeafter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM before_after WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});


// ======================= UPDATE PROFILE =======================
app.put("/update-profile", requireAuth, async (req, res) => {
  const { firstName, lastName, phoneNumber, password } = req.body;
  const userId = req.user.user_id;

  try {
    let query, params;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `
        UPDATE users 
        SET first_name=$1, last_name=$2, phone_number=$3, password=$4 
        WHERE user_id=$5 
        RETURNING user_id, first_name, last_name, email, phone_number
      `;
      params = [firstName, lastName, phoneNumber, hashedPassword, userId];
    } else {
      query = `
        UPDATE users 
        SET first_name=$1, last_name=$2, phone_number=$3
        WHERE user_id=$4 
        RETURNING user_id, first_name, last_name, email, phone_number
      `;
      params = [firstName, lastName, phoneNumber, userId];
    }

    const result = await pool.query(query, params);
    const updatedUser = {
      id: result.rows[0].user_id,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      email: result.rows[0].email,
      phoneNumber: result.rows[0].phone_number,
    };

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("❌ Update profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ======================= BOOKING ROUTES ======================= */

// ✅ Create Booking
// ✅ Create Booking (FIXED)
// … other imports remain …

app.post("/booking", async (req, res) => {
  try {
    const { user_id, service, booking_date, booking_time, address, notes, forAssessment } = req.body;

    // Validate required fields
    if (!user_id || !service || !booking_date || !address) {
      return res.status(400).json({ success: false, message: "Missing required booking fields." });
    }

    // Combine date + time into a single timestamp
    let bookingDateTime = booking_date;
    if (booking_time) {
      // Combine into ISO string
      bookingDateTime = new Date(`${booking_date}T${booking_time}`);
    } else {
      bookingDateTime = new Date(booking_date);
    }

    const insertQuery = `
      INSERT INTO bookings
        (user_id, service, booking_date, address, notes, for_assessment, payment, status, name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      user_id,
      service,
      bookingDateTime,
      address,
      notes || "",
      forAssessment || false,
      0,             // default payment
      "pending",     // default status
      null           // name will be set by trigger if needed
    ];

    const result = await pool.query(insertQuery, values);
    res.status(201).json({ success: true, booking: result.rows[0] });

  } catch (err) {
    console.error("❌ Error booking service:", err);
    res.status(500).json({ success: false, message: "Error booking service." });
  }
});



// ✅ Update Booking
app.put("/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const { name, address, notes, for_assessment, payment, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE bookings SET name=$1, address=$2, notes=$3, for_assessment=$4, payment=$5, status=$6
       WHERE booking_id=$7 RETURNING *`,
      [name, address, notes, for_assessment, payment, status, id]
    );
    if (result.rows.length === 0) return res.status(404).send("Booking not found");
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).send("Error updating booking");
  }
});


// ✅ Fetch All Bookings
app.get("/bookings", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM bookings ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching bookings:", err.message);
    res.status(500).send("Error fetching bookings");
  }
});

// ✅ Fetch Bookings for Specific User
app.get("/bookings/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user bookings:", err.message);
    res.status(500).send("Error fetching user bookings");
  }
});

// ======================= CONTACT FORM =======================


app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    });

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("❌ Contact email error:", err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
});

// ================== BEFORE & AFTER UPLOADS ==================
app.use("/uploads", express.static("uploads"));

app.post("/beforeafter-local", upload.fields([{ name: "before" }, { name: "after" }]), async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.files["before"] || !req.files["after"]) {
      return res.status(400).json({ error: "Both before and after images are required" });
    }

    const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    const beforeUrl = `${baseUrl}/uploads/${req.files["before"][0].filename}`;
    const afterUrl = `${baseUrl}/uploads/${req.files["after"][0].filename}`;


    const result = await pool.query(
      "INSERT INTO before_after (title, before_url, after_url) VALUES ($1, $2, $3) RETURNING *",
      [title, beforeUrl, afterUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error inserting post:", err);
    res.status(500).json({ error: "Failed to insert post" });
  }
});

// ================== Serve Frontend ==================

/** ANALYTICS SUMMARY (READ - FILTER BY MONTH) */
app.get("/analytics_summary", async (req, res) => {
  try {
    // Extract month filter from query string (?month=10)
    const month = parseInt(req.query.month);

    // ✅ Validate month (1–12)
    if (isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: "Invalid month value" });
    }

    // ✅ Fetch only completed sales within the selected month
    const { rows } = await pool.query(
      `
      SELECT 
        service,
        COUNT(*) AS total_bookings,
        SUM(payment) AS total_amount,
        MAX(completed_at) AS completed_at
      FROM sales
      WHERE status = 'completed'
        AND EXTRACT(MONTH FROM completed_at) = $1
      GROUP BY service
      ORDER BY total_amount DESC;
      `,
      [month]
    );

    console.log("Fetched Analytics Summary:", rows);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching analytics summary:", err);
    res.status(500).json({ error: err.message });
  }
});



/** SALES (READ - GET ALL) */
app.get("/sales", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sales ORDER BY created_at DESC");
    console.log("Fetched Sales:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).send("Error fetching sales");
  }
});

/** REQUEST (READ - GET ALL) */
app.get("/requests", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM bookings WHERE status != 'completed' ORDER BY created_at DESC"
  );
  res.json(result.rows);
});



/** SALES (READ - GET ALL) */
app.get("/sales", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sales ORDER BY created_at DESC");
    console.log("Fetched Sales:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).send("Error fetching sales");
  }
});

/** REQUEST (READ - GET ALL) */
app.get("/requests", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM bookings WHERE status != 'completed' ORDER BY created_at DESC"
  );
  res.json(result.rows);
});






/* ======================= INCOMING REQUEST ROUTES ======================= */

// ✅ Create new incoming request (from user)
app.post("/incoming-requests", async (req, res) => {
  try {
    const { user_id, name, service, booking_date, address, notes, for_assessment } = req.body;

    if (!user_id || !service || !booking_date || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const insertQuery = `
      INSERT INTO incoming_requests (user_id, name, service, booking_date, address, notes, for_assessment)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [
      user_id,
      name || null,
      service,
      booking_date,
      address,
      notes || "",
      for_assessment || false,
    ]);

    res.status(201).json({ success: true, request: result.rows[0] });
  } catch (err) {
    console.error("❌ Error creating incoming request:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});


// ✅ Get all incoming requests (for admin approval)
app.get("/incoming-requests", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM incoming_requests ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching incoming requests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// ===================== INCOMING REQUESTS ROUTES =====================

// ✅ Fetch all incoming requests
app.get("/incoming-requests", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM incoming_requests 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching incoming requests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});


// ✅ Approve Request → Move to bookings + Notify user
app.post("/incoming-requests/approve/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch request details
    const reqResult = await pool.query(
      `SELECT * FROM incoming_requests WHERE request_id = $1`,
      [id]
    );

    if (reqResult.rows.length === 0)
      return res.status(404).json({ error: "Request not found" });

    const request = reqResult.rows[0];

    // Move to bookings table
    const insertBooking = await pool.query(
      `INSERT INTO bookings (
        user_id, service, booking_date, address, notes, for_assessment, status, name
      ) VALUES (
        $1, $2, $3, $4, $5, $6, 'pending', $7
      ) RETURNING *`,
      [
        request.user_id,
        request.service,
        request.booking_date,
        request.address,
        request.notes,
        request.for_assessment,
        request.name || "Customer"
      ]
    );

    // Delete the request after approval
    await pool.query(`DELETE FROM incoming_requests WHERE request_id = $1`, [id]);

    // Add a notification for the user
    await pool.query(
      `INSERT INTO notifications (user_id, message, created_at)
   VALUES ($1, $2, NOW())`,
      [request.user_id, `Your booking request for ${request.service} on ${new Date(request.booking_date).toLocaleString()} has been approved!`]
    );



    res.status(200).json({
      success: true,
      message: "Request approved, moved to bookings, and user notified.",
      booking: insertBooking.rows[0]
    });
  } catch (err) {
    console.error("Error approving request:", err);
    res.status(500).json({ error: "Failed to approve request." });
  }
});


// 🚫 Reject Request → Delete + Notify user
app.delete("/incoming-requests/:id", async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body || {};

  try {
    // Fetch request details
    const reqResult = await pool.query(
      `SELECT * FROM incoming_requests WHERE request_id = $1`,
      [id]
    );

    if (reqResult.rows.length === 0)
      return res.status(404).json({ error: "Request not found" });

    const request = reqResult.rows[0];

    // Delete the request
    await pool.query(`DELETE FROM incoming_requests WHERE request_id = $1`, [id]);

    // Insert rejection notification
    await pool.query(
      `INSERT INTO notifications (user_id, message, created_at)
   VALUES ($1, $2, NOW())`,
      [request.user_id, `Your booking request for ${request.service} has been rejected. Reason: ${reason || "Not specified"}`]
    );



    res.status(200).json({
      success: true,
      message: "Request rejected, deleted, and user notified."
    });
  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ error: "Failed to reject request." });
  }
});


/* ======================= NOTIFICATION ROUTES ======================= */

// ✅ CREATE a new notification
app.post("/notifications", async (req, res) => {
  try {
    const { user_id, request_id, message } = req.body;

    if (!user_id || !message) {
      return res.status(400).json({ error: "Missing required fields (user_id, message)" });
    }

    const result = await pool.query(
      `INSERT INTO notifications (user_id, request_id, message, is_read, created_at)
       VALUES ($1, $2, $3, false, NOW())
       RETURNING *`,
      [user_id, request_id, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET notifications for a specific user
app.get("/notifications/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ MARK notification as read
app.put("/notifications/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE notifications SET is_read = true WHERE notification_id = $1`, [id]);
    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error updating notification:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* ======================= REVIEWS ROUTES ======================= */

// ✅ Get all reviews
app.get("/reviews", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reviews ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// ✅ Add a review
app.post("/reviews", async (req, res) => {
  try {
    const { name, location, rating, comment } = req.body;
    if (!name || !location || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO reviews (name, location, rating, comment)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, location, rating, comment || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: "Failed to add review" });
  }
});

// ✅ Update a review
app.put("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, rating, comment } = req.body;

    const result = await pool.query(
      `UPDATE reviews 
       SET name=$1, location=$2, rating=$3, comment=$4, updated_at=NOW() 
       WHERE review_id=$5 
       RETURNING *`,
      [name, location, rating, comment, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Review not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ error: "Failed to update review" });
  }
});

// ✅ Delete a review
app.delete("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM reviews WHERE review_id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Review not found" });
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Failed to delete review" });
  }
});







// ================== Start Server ==================
app.listen(PORT, () => {
  console.log("Loaded email:", process.env.EMAIL);
  console.log("Loaded email pass:", process.env.EMAIL_PASS ? "✅ exists" : "❌ missing");
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

