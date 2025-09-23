import { Routes, Route } from "react-router-dom";
import OtpPage from "./pages/OtpPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashb from "./pages/customerdashb";
import Booksys from "./pages/booksys";
import Admindashb from "./pages/admindashb";
import MGbook from "./pages/mgbook";
import Manageb from "./pages/manageb";
import Salesandreq from "./pages/salesandreq";
import Analytics from "./pages/analytics";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Admindashb />} />
      <Route path="/booksys" element={<Booksys />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/admindashb" element={<Admindashb />} />
      <Route path="/customerdashb" element={<CustomerDashb />} />
      <Route path="/mgbook" element={<MGbook />} />
      <Route path="/manageb" element={<Manageb />} />
      <Route path="/salesandreq" element={<Salesandreq />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}

export default App;
