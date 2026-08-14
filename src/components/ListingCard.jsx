import { Link } from "react-router-dom";

const ListingCard = ({ listing, showTax }) => {
  const price = listing.price || 0;
  const imageSrc = listing.image?.url || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600";

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.toggle("liked");
  };

  return (
    <div className="col">
      <Link to={`/listings/${listing._id}`} className="text-decoration-none">
        <div className="card h-100 border-0 listing-card">
          {/* Image Section with hover effect */}
          <div className="card-img-container position-relative overflow-hidden" style={{ borderRadius: "16px", aspectRatio: "4/3" }}>
            <img src={imageSrc} className="card-img-top listing-img" alt={listing.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            
            {/* Quick Badge Overlay */}
            <div className="position-absolute top-0 end-0 m-3">
              <button
                className="btn btn-light btn-sm rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center p-2 like-btn"
                style={{ width: "32px", height: "32px" }}
                onClick={handleLike}
              >
                <i className="fa-regular fa-heart text-danger heart-icon"></i>
              </button>
            </div>

            <div className="position-absolute bottom-0 start-0 m-3">
              <span className="badge bg-dark bg-opacity-75 text-white rounded-pill px-3 py-1.5 small fw-semibold">
                <i className="fa-solid fa-star text-warning me-1"></i> New
              </span>
            </div>
          </div>

          {/* Card Body / Info */}
          <div className="card-body px-1 py-3 text-dark">
            <h5 className="card-title fw-bold text-truncate mb-1" style={{ fontSize: "1.1rem" }}>{listing.title}</h5>
            <p className="text-secondary small mb-2 d-flex align-items-center gap-1">
              <i className="fa-solid fa-location-dot text-danger" style={{ fontSize: "0.85rem" }}></i>
              {listing.location}, {listing.country}
            </p>
            <p className="card-text fw-bold mb-0">
              <span className="fs-5 text-dark">₹{price.toLocaleString("en-IN")}</span>
              <span className="text-secondary fw-normal" style={{ fontSize: "0.9rem" }}> / night</span>
              {showTax && (
                <span className="tax-info text-muted small ms-1">
                  <i className="text-danger" style={{ fontStyle: "normal" }}> +18% GST</i>
                </span>
              )}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
