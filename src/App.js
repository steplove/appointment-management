import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Test from "./screens/Test";
import Customers from "./screens/Customers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/Customers" element={<Customers />} />
      </Routes>
    </Router>
  );
}

export default App;
