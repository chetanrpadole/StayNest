import { useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFlash } from "../context/FlashContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { showMessage } = useFlash();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // Read active query from URL and pre-fill the search input
  const searchParams = new URLSearchParams(location.search);
  const activeQuery = searchParams.get("search") || "";

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.value = activeQuery;
    }
  }, [activeQuery]);

  const handleLogout = () => {
    logout();
    showMessage("You are logged out!");
    navigate("/listings");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchRef.current?.value.trim() || "";
    if (query) {
      navigate(`/listings?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/listings");
    }
  };

  const handleClearSearch = () => {
    if (searchRef.current) searchRef.current.value = "";
    navigate("/listings");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top">
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
          <div className="navbar-nav ms-auto mx-lg-auto mt-3 mt-lg-0">
            <form className="d-flex align-items-center search-form" role="search" onSubmit={handleSearchSubmit}>
              {/* Input wrapper for positioning the clear (×) button inside */}
              <div className="position-relative me-2">
                <input
                  ref={searchRef}
                  name="search"
                  className="form-control rounded-pill shadow-sm border-1 px-4 search-inp"
                  type="search"
                  placeholder="Search by title or location…"
                  aria-label="Search listings"
                  defaultValue={activeQuery}
                  style={{ fontSize: "0.95rem", borderColor: "#e0e0e0", paddingRight: activeQuery ? "2.5rem" : undefined }}
                />
                {/* Clear button — only visible when there is an active query in the URL */}
                {activeQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    title="Clear search"
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#888",
                      fontSize: "0.85rem",
                      lineHeight: 1,
                      padding: "2px 4px",
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
              <button
                className="btn btn-danger rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                type="submit"
                aria-label="Submit search"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#fe424d",
                  borderColor: "#fe424d",
                }}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>

          <div className="navbar-nav ms-auto align-items-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <>
                <Link
                  className="nav-link btn btn-outline-danger px-4 rounded-pill border-2 fw-semibold"
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
                  className="nav-link btn btn-outline-danger px-4 rounded-pill border-2 fw-semibold"
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
