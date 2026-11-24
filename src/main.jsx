import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>
);