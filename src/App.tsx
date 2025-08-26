import { Routes, Route } from "react-router-dom";
import OtpPage from "./pages/OtpPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashb from "./pages/customerdashb";
import Booksys from "./pages/booksys";
import Admindashb from "./pages/admindashb";
import MGbook from "./pages/mgbook";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booksys" element={<Booksys />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/admindashb" element={<Admindashb />} />
      <Route path="/customerdashb" element={<CustomerDashb />} />
      <Route path="/mgbook" element={<MGbook />} />
    </Routes>
  );
}

export default App;
