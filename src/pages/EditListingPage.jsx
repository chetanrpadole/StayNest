import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFlash } from "../context/FlashContext";
import API from "../api/axios";

const EditListingPage = () => {
  const { id } = useParams();
  const { showMessage } = useFlash();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
  });
  const [existingImage, setExistingImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/listings/${id}`);
        if (response.data.success) {
          const l = response.data.listing;
          setFormData({
            title: l.title || "",
            description: l.description || "",
            price: l.price || "",
            location: l.location || "",
            country: l.country || "",
          });
          setExistingImage(l.image?.url || "");
        } else {
          showMessage(response.data.message || "Listing not found", "error");
          navigate("/listings");
        }
      } catch (err) {
        showMessage(err.response?.data?.message || "Failed to fetch listing data.", "error");
        navigate("/listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("location", formData.location);
      data.append("country", formData.country);
      if (imageFile) {
        data.append("image", imageFile);
      }

      const response = await API.put(`/listings/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        showMessage("Listing updated successfully!");
        navigate(`/listings/${id}`);
      } else {
        showMessage(response.data.message || "Failed to update listing", "error");
      }
    } catch (err) {
      showMessage(err.response?.data?.message || "An error occurred while updating listing.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row mt-3">
      <div className="col-md-8 offset-md-2">
        <h3 className="fw-bold mb-4">Edit Listing</h3>
        <form
          onSubmit={handleSubmit}
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          noValidate
        >
          {/* Title */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label fw-semibold">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              className="form-control"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <div className="valid-feedback">Title looks good!</div>
            <div className="invalid-feedback">Title is required.</div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label fw-semibold">Description</label>
            <textarea
              name="description"
              id="description"
              className="form-control"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
            <div className="valid-feedback">Description looks good!</div>
            <div className="invalid-feedback">Please enter a description.</div>
          </div>

          {/* Current and New Image */}
          <div className="mb-3">
            {existingImage && (
              <div className="mb-2">
                <label className="form-label fw-semibold d-block">Current Image</label>
                <img
                  src={existingImage}
                  alt="Current listing stay"
                  className="img-fluid rounded border shadow-sm"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              </div>
            )}
            <label htmlFor="image" className="form-label fw-semibold">Upload New Image</label>
            <input
              type="file"
              id="image"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="form-text text-muted">Image is optional. Leave blank to keep current image.</div>
          </div>

          <div className="row">
            {/* Price */}
            <div className="mb-3 col-md-4">
              <label htmlFor="price" className="form-label fw-semibold">Price (₹)</label>
              <input
                type="number"
                name="price"
                id="price"
                className="form-control"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                required
              />
              <div className="valid-feedback">Price looks good!</div>
              <div className="invalid-feedback">Please enter a valid price.</div>
            </div>

            {/* Location */}
            <div className="mb-3 col-md-4">
              <label htmlFor="location" className="form-label fw-semibold">Location</label>
              <input
                type="text"
                name="location"
                id="location"
                className="form-control"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <div className="valid-feedback">Location looks good!</div>
              <div className="invalid-feedback">Please enter a location.</div>
            </div>

            {/* Country */}
            <div className="mb-3 col-md-4">
              <label htmlFor="country" className="form-label fw-semibold">Country</label>
              <input
                type="text"
                name="country"
                id="country"
                className="form-control"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
              <div className="valid-feedback">Country looks good!</div>
              <div className="invalid-feedback">Please enter a country.</div>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4">
            <button
              type="submit"
              className="btn btn-dark px-4 py-2 rounded-pill fw-semibold"
              style={{ backgroundColor: "#222", border: "none" }}
              disabled={submitting}
            >
              {submitting ? "Updating Listing..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-danger px-4 py-2 rounded-pill fw-semibold"
              style={{ backgroundColor: "#fe424d", border: "none" }}
            >
              Delete Listing
            </button>
          </div>
        </form>
        <br />
        <br />
      </div>
    </div>
  );
};

export default EditListingPage;
