import { Routes, Route } from "react-router-dom";
import { ReviewsProvider } from "./pages/ReviewsContext"; 

import OtpPage from "./pages/OtpPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashb from "./pages/customerdashb";
import Booksys from "./pages/booksys";
import Admindashb from "./pages/admindashb";

import About from "./pages/aboutus";
import Services from "./pages/services";
import Manageb from "./pages/manageb";
import Salesandreq from "./pages/salesandreq";
import Analytics from "./pages/analytics";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import BeforeAfter from "./pages/beforeandafter";
import BeforeAfterAdd from "./pages/beforeandafteradd";
import BeforeAndAfterShowcase from "./pages/beforeandaftershowcase";
import PrivacyNotice from "./pages/PrivacyNotice";
import Cookies from "./pages/cookies";
import CookieBanner from "./components/CookieBanner";


import AdminReviews from "./pages/AdminReviews";

function App() {
  return (
    <ReviewsProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aboutus" element={<About />} />
        <Route path="/beforeandaftershowcase" element={<BeforeAndAfterShowcase />} />
        <Route path="/privacy-notice" element={<PrivacyNotice />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/customerdashb" element={<CustomerDashb />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/booksys" element={<Booksys />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admindashb" element={<Admindashb />} />
          <Route path="/manageb" element={<Manageb />} />
          <Route path="/salesandreq" element={<Salesandreq />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/beforeafter" element={<BeforeAfter />} />
          <Route path="/beforeafter/add" element={<BeforeAfterAdd />} />
          <Route path="/admin-reviews" element={<AdminReviews />} />
        </Route>
      </Routes>

      <CookieBanner />
    </ReviewsProvider>
  );
}

export default App;
