import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Customers from "./screens/Customers";
import Departments from "./screens/Departments";
import Doctors from "./screens/Doctors";
import Employees from "./screens/Employees";
import Packages from "./screens/Packages";
import Blogs from "./screens/Blogs";
import Banners from "./screens/Banners";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Departments" element={<Departments />} />
        <Route path="/Doctors" element={<Doctors />} />
        <Route path="/Employees" element={<Employees />} />
        <Route path="/Customers" element={<Customers />} />
        <Route path="/Packages" element={<Packages />} />
        <Route path="/Blogs" element={<Blogs />} />
        <Route path="/Banners" element={<Banners />} />
      </Routes>
    </Router>
  );
}

export default App;
