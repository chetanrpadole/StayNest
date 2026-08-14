import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FlashMessage from "./components/FlashMessage";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import CreateListingPage from "./pages/CreateListingPage";
import EditListingPage from "./pages/EditListingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Global CSS styles are imported at main.jsx or here
import "./App.css";

function App() {
  return (
    <div className="d-flex flex-column vh-100 bg-light">
      <Navbar />
      <div className="container flex-grow-1 mt-4">
        <FlashMessage />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route
            path="/listings/new"
            element={
              <ProtectedRoute>
                <CreateListingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route
            path="/listings/:id/edit"
            element={
              <ProtectedRoute>
                <EditListingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/listings" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
