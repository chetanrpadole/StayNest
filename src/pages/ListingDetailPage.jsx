import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFlash } from "../context/FlashContext";
import API from "../api/axios";
import StarRating from "../components/StarRating";
import { FALLBACK_LISTINGS } from "../data/mockListings";

const ListingDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showMessage } = useFlash();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchListingDetail = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/listings/${id}`);
        if (response.data?.success && response.data?.listing) {
          setListing(response.data.listing);
        } else {
          const fallback = FALLBACK_LISTINGS.find((l) => l._id === id) || FALLBACK_LISTINGS[0];
          setListing(fallback);
        }
      } catch (err) {
        console.warn("Backend API not reachable, loading fallback listing:", err.message);
        const fallback = FALLBACK_LISTINGS.find((l) => l._id === id) || FALLBACK_LISTINGS[0];
        setListing(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetail();
  }, [id]);

  const handleDeleteListing = async () => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      const response = await API.delete(`/listings/${id}`);
      if (response.data.success) {
        showMessage("Listing deleted successfully!");
        navigate("/listings");
      } else {
        showMessage(response.data.message || "Failed to delete listing", "error");
      }
    } catch (err) {
      showMessage(err.response?.data?.message || "An error occurred while deleting listing.", "error");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    try {
      setReviewSubmitting(true);
      const response = await API.post(`/listings/${id}/reviews`, {
        review: {
          rating: reviewRating,
          comment: reviewComment,
        },
      });

      if (response.data.success) {
        showMessage("New review posted successfully!");
        // Refresh listing reviews list
        setListing((prev) => ({
          ...prev,
          reviews: [...prev.reviews, response.data.review],
        }));
        setReviewComment("");
        setReviewRating(5);
      } else {
        showMessage(response.data.message || "Failed to post review", "error");
      }
    } catch (err) {
      showMessage(err.response?.data?.message || "An error occurred while posting review.", "error");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await API.delete(`/listings/${id}/reviews/${reviewId}`);
      if (response.data.success) {
        showMessage("Review deleted successfully!");
        setListing((prev) => ({
          ...prev,
          reviews: prev.reviews.filter((r) => r._id !== reviewId),
        }));
      } else {
        showMessage(response.data.message || "Failed to delete review", "error");
      }
    } catch (err) {
      showMessage(err.response?.data?.message || "An error occurred while deleting review.", "error");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">{error || "Listing not found"}</div>
        <Link to="/listings" className="btn btn-secondary mt-3">Back to Listings</Link>
      </div>
    );
  }

  const isOwner = user && listing.owner && user.id === listing.owner._id;
  const imageSrc = listing.image?.url || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600";

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Left Column: Listing Details */}
        <div className="col-lg-7">
          <div className="show-listing-card">
            <div className="show-img-wrapper" style={{ aspectRatio: "16 / 10", overflow: "hidden" }}>
              <img
                src={imageSrc}
                alt={listing.title}
                className="show-listing-img"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="show-listing-body">
              <h2 className="show-listing-title">{listing.title}</h2>
              <p className="show-listing-owner text-muted mb-3">
                <i className="fa-solid fa-user-tie me-1"></i> Owned by <i>{listing.owner ? listing.owner.username : "Anonymous"}</i>
              </p>
              <div className="show-listing-meta">
                <span className="show-meta-badge">
                  <i className="fa-solid fa-location-dot"></i>
                  {listing.location}, {listing.country}
                </span>
                <span className="show-meta-badge show-price-badge">
                  ₹{listing.price?.toLocaleString("en-IN")} / night
                </span>
              </div>
              <p className="show-listing-desc">{listing.description}</p>

              <div className="show-action-btns">
                {isOwner && (
                  <>
                    <Link to={`/listings/${listing._id}/edit`} className="btn-show-action btn-show-edit">
                      <i className="fa-solid fa-pen-to-square"></i> Edit
                    </Link>
                    <button onClick={handleDeleteListing} className="btn-show-action btn-show-delete">
                      <i className="fa-solid fa-trash-can"></i> Delete
                    </button>
                  </>
                )}
                <Link to="/listings" className="btn-show-action btn-show-back">
                  <i className="fa-solid fa-arrow-left"></i> All Listings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reviews */}
        <div className="col-lg-5">
          {/* Leave a Review Form */}
          {user ? (
            <div className="review-form-card">
              <h4 className="review-form-title">
                <i className="fa-solid fa-feather-pointed"></i> Leave a Review
              </h4>
              <form onSubmit={handleReviewSubmit}>
                {/* Star Rating */}
                <div className="mb-3">
                  <label className="form-label review-label d-block">Rating</label>
                  <StarRating rating={reviewRating} onChange={setReviewRating} interactive={true} />
                </div>
                {/* Comment */}
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label review-label">Comment</label>
                  <textarea
                    className="form-control review-textarea"
                    id="comment"
                    rows="3"
                    placeholder="Share your experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn-submit-review" disabled={reviewSubmitting}>
                  <i className="fa-solid fa-paper-plane"></i> {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          ) : (
            <div className="review-form-card p-4 text-center">
              <i className="fa-solid fa-user-lock mb-2 fs-3 text-muted"></i>
              <h5 className="fw-bold mb-1">Join the Discussion</h5>
              <p className="text-muted small mb-3">You must be logged in to post a review.</p>
              <Link to="/login" className="btn-show-action btn-show-edit d-inline-block px-4 py-2 w-auto" style={{ borderRadius: "20px" }}>
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Login
              </Link>
            </div>
          )}

          {/* Reviews List */}
          <div className="reviews-section">
            <h4 className="reviews-section-title">
              <i className="fa-solid fa-comments"></i> Reviews
              <span className="reviews-count-badge ms-2">{listing.reviews?.length || 0}</span>
            </h4>

            {listing.reviews && listing.reviews.length > 0 ? (
              listing.reviews.map((review) => {
                const isReviewAuthor = user && review.author && user.id === review.author._id;
                const reviewDate = new Date(review.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div className="review-card" key={review._id}>
                    <div className="review-card-header">
                      <StarRating rating={review.rating} interactive={false} />
                      {isReviewAuthor && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="btn-delete-review"
                          title="Delete review"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      )}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <div className="review-card-footer">
                      <span className="review-author me-3 text-secondary small">
                        <i className="fa-solid fa-circle-user me-1"></i>
                        @{review.author ? review.author.username : "anonymous"}
                      </span>
                      <span className="review-date small text-muted">
                        <i className="fa-regular fa-clock me-1"></i>
                        {reviewDate}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-reviews-card">
                <i className="fa-regular fa-comment-dots no-reviews-icon"></i>
                <p className="no-reviews-text">No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
