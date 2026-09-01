import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const HomePage = () => {
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchVal)}`);
    } else {
      navigate("/listings");
    }
  };

  return (
    <div className="container py-3">
      {/* Hero Section */}
      <div
        className="hero-section position-relative overflow-hidden rounded-4 mb-5 shadow-lg mt-3"
        style={{
          minHeight: "70vh",
          background: "url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070') center/cover no-repeat",
        }}
      >
        {/* Overlay for text readability */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))" }}
        ></div>

        <div
          className="container h-100 d-flex flex-column justify-content-center align-items-center position-relative z-1 text-white text-center"
          style={{ minHeight: "80vh" }}
        >
          <h1
            className="display-4 display-md-3 fw-bold mb-3 slide-up-animation"
            style={{ textShadow: "0 4px 12px rgba(0,0,0,0.3)", fontFamily: "'Inter', sans-serif" }}
          >
            Find your next perfect stay
          </h1>
          <p
            className="fs-5 mb-4 slide-up-animation delay-1 px-2"
            style={{ maxWidth: "600px", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
          >
            Discover extraordinary homes, cabins, and castles for your next unforgettable adventure.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white p-2 rounded-pill shadow-lg d-flex align-items-center w-100 slide-up-animation delay-2"
            style={{ maxWidth: "600px" }}
          >
            <div className="flex-grow-1 px-2 px-md-3 d-flex align-items-center border-end overflow-hidden">
              <i className="fa-solid fa-location-dot text-danger me-2 flex-shrink-0"></i>
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="form-control border-0 shadow-none bg-transparent"
                placeholder="Where are you going?"
                style={{ fontWeight: 500, minWidth: 0 }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-danger rounded-pill px-3 px-md-4 py-2 ms-2 fw-bold d-flex align-items-center gap-2 flex-shrink-0"
              style={{ backgroundColor: "#fe424d", borderColor: "#fe424d", whiteSpace: "nowrap" }}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
              <span className="d-none d-sm-inline">Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mb-5 py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-5 mb-3" style={{ color: "#222" }}>Why choose StayNest?</h2>
          <p className="text-secondary fs-5">Experience hospitality redefined with our premium benefits.</p>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-md-4">
            <div className="feature-card p-4 rounded-4 bg-light h-100 text-center border-0 shadow-sm transition-all hover-scale">
              <div
                className="icon-wrapper bg-white rounded-circle d-inline-flex justify-content-center align-items-center shadow-sm mb-4"
                style={{ width: "80px", height: "80px" }}
              >
                <i className="fa-solid fa-shield-halved fs-1 text-danger"></i>
              </div>
              <h4 className="fw-bold mb-3">Secure Booking</h4>
              <p className="text-secondary">
                Your payments and personal data are protected with industry-leading encryption and security standards.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card p-4 rounded-4 bg-light h-100 text-center border-0 shadow-sm transition-all hover-scale">
              <div
                className="icon-wrapper bg-white rounded-circle d-inline-flex justify-content-center align-items-center shadow-sm mb-4"
                style={{ width: "80px", height: "80px" }}
              >
                <i className="fa-solid fa-headset fs-1 text-danger"></i>
              </div>
              <h4 className="fw-bold mb-3">24/7 Support</h4>
              <p className="text-secondary">
                Our dedicated team is available around the clock to assist you with any questions or concerns during your stay.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card p-4 rounded-4 bg-light h-100 text-center border-0 shadow-sm transition-all hover-scale">
              <div
                className="icon-wrapper bg-white rounded-circle d-inline-flex justify-content-center align-items-center shadow-sm mb-4"
                style={{ width: "80px", height: "80px" }}
              >
                <i className="fa-solid fa-map-location-dot fs-1 text-danger"></i>
              </div>
              <h4 className="fw-bold mb-3">Unique Locations</h4>
              <p className="text-secondary">
                From treehouses to castles, discover unique accommodations you won't find anywhere else.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-dark text-white rounded-4 p-4 p-md-5 mb-5 d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start shadow-lg position-relative overflow-hidden gap-4">
        <div className="position-absolute top-0 end-0 opacity-25" style={{ transform: "translate(20%, -20%)" }}>
          <i className="fa-solid fa-compass" style={{ fontSize: "20rem", color: "#fe424d" }}></i>
        </div>
        <div className="z-1 position-relative">
          <h2 className="fw-bold display-6 mb-2">Ready to host?</h2>
          <p className="fs-5 text-light opacity-75 mb-0">Turn your extra space into extra income with StayNest.</p>
        </div>
        <div className="z-1 position-relative">
          <Link to="/listings/new" className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold text-danger fs-5 shadow">
            Become a Host
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
