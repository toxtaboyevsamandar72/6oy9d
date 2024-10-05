import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ErrorPage from './pages/ErrorPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken && location.pathname !== "/register") {
      navigate('/login'); 
    } else if (storedToken) {
      setToken(storedToken); 
    }
  }, [location.pathname, navigate]);

  function ProtectedRoute({ children }) {
    if (!token) {
      return navigate("/login"); 
    }

    return children; 
  }

  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
