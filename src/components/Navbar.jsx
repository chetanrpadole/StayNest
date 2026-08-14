import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFlash } from "../context/FlashContext";

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { showMessage } = useFlash();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showMessage("You are logged out!");
    navigate("/listings");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    if (onSearch) {
      onSearch(query);
    }
    navigate("/listings");
  };

  return (
    <nav className="navbar navbar-expand-md bg-body-tertiary border-bottom sticky-top">
      <div className="container-fluid px-md-5">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/listings">
          <i className="fa-regular fa-compass" style={{ color: "#fe424d", fontSize: "1.5rem" }}></i>
          <span className="fw-bold text-dark" style={{ letterSpacing: "-0.5px" }}>StayNest</span>
        </Link>
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav">
            <Link className="nav-link px-3" to="/">Home</Link>
            <Link className="nav-link px-3" to="/listings">All Listings</Link>
            <Link className="nav-link px-3" to="/listings/new">Add New Listing</Link>
          </div>

          {/* Search Form */}
          <div className="navbar-nav ms-auto mx-md-auto mt-3 mt-md-0">
            <form className="d-flex search-form" onSubmit={handleSearchSubmit}>
              <input
                name="search"
                className="form-control me-2 rounded-pill shadow-sm border-1 px-4 search-inp"
                type="search"
                placeholder="Search destinations"
                aria-label="Search"
                style={{ width: "300px", fontSize: "0.95rem", borderColor: "#e0e0e0" }}
              />
              <button
                className="btn btn-danger rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                type="submit"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#fe424d",
                  borderColor: "#fe424d",
                  flexShrink: 0,
                }}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>

          <div className="navbar-nav ms-auto align-items-center gap-2 mt-3 mt-md-0">
            {user ? (
              <>
                <Link
                  className="nav-link btn btn-outline-danger px-4 rounded-pill border-2 fw-semibold mt-2 mt-md-0"
                  to="/listings/new"
                  style={{ borderColor: "#fe424d", color: "#fe424d" }}
                >
                  <i className="fa-solid fa-plus me-1"></i> StayNest your home
                </Link>
                <span className="nav-link text-dark fw-semibold px-2">Hi, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="nav-link px-3 fw-semibold btn btn-link border-0 text-decoration-none"
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="nav-link px-3 fw-semibold" to="/signup">Sign Up</Link>
                <Link
                  className="nav-link btn btn-outline-danger px-4 rounded-pill border-2 fw-semibold mt-2 mt-md-0"
                  to="/login"
                  style={{ borderColor: "#fe424d", color: "#fe424d" }}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
