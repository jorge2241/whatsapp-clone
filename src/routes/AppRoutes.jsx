import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

import Login from "../pages/Login";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {

  const { state, loading } = useContext(AppContext);

  if (loading) {
    return <div>Conectando...</div>;
  }

  return (
    <Routes>

      <Route
        path="/"
        element={
          state.user.uid
            ? <Navigate to="/chat" replace />
            : <Login />
        }
      />

      <Route
        path="/chat"
        element={
          state.user.uid
            ? <Home />
            : <Navigate to="/" replace />
        }
      />

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;