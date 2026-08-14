import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FlashProvider } from "./context/FlashContext";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <FlashProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </FlashProvider>
    </BrowserRouter>
  </StrictMode>
);
