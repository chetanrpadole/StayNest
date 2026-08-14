import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFlash } from "../context/FlashContext";
import API from "../api/axios";

const CreateListingPage = () => {
  const { showMessage } = useFlash();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      // Create FormData for multipart upload (since we support image uploading to Cloudinary)
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("location", formData.location);
      data.append("country", formData.country);
      if (imageFile) {
        data.append("image", imageFile);
      }

      const response = await API.post("/listings", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        showMessage("New listing created successfully!");
        navigate("/listings");
      } else {
        showMessage(response.data.message || "Failed to create listing", "error");
      }
    } catch (err) {
      showMessage(
        err.response?.data?.message || "An error occurred while creating listing. Make sure values are correct.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row mt-3">
      <div className="col-md-8 offset-md-2">
        <h3 className="fw-bold mb-4">Create a New Listing</h3>
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
              placeholder="Enter title"
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
              placeholder="Enter description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
            <div className="valid-feedback">Description looks good!</div>
            <div className="invalid-feedback">Please enter a description.</div>
          </div>

          {/* Image */}
          <div className="mb-3">
            <label htmlFor="image" className="form-label fw-semibold">Upload Image</label>
            <input
              type="file"
              id="image"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="form-text text-muted">Image is optional (defaults to placeholder).</div>
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
                placeholder="1200"
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
                placeholder="Enter location"
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
                placeholder="Enter country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
              <div className="valid-feedback">Country looks good!</div>
              <div className="invalid-feedback">Please enter a country.</div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-dark add-btn mt-3 px-4 py-2 rounded-pill fw-semibold"
            style={{ backgroundColor: "#222", border: "none" }}
            disabled={submitting}
          >
            {submitting ? "Adding Listing..." : "Add Listing"}
          </button>
        </form>
        <br />
        <br />
      </div>
    </div>
  );
};

export default CreateListingPage;
