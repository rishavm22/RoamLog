import React, { useState } from "react";
import { baseUrl } from "../../url";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function AddExperience() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const [formdata, setFormdata] = useState({
    tripName: "",
    startDateOfJourney: "",
    endDateOfJourney: "",
    nameOfHotels: "",
    placesVisited: "",
    totalCost: "",
    experience: "",
    image: "",
    tripType: "leisure",
    featured: false,
    shortDescription: ""
  });

  const validate = () => {
    const newErrors = {};

    // Trip Name
    if (!formdata.tripName || !formdata.tripName.trim()) {
      newErrors.tripName = "Trip name is required.";
    } else if (formdata.tripName.trim().length > 50) {
      newErrors.tripName = "Trip name cannot exceed 50 characters.";
    }

    // Start Date
    if (!formdata.startDateOfJourney) {
      newErrors.startDateOfJourney = "Start date of journey is required.";
    }

    // End Date
    if (!formdata.endDateOfJourney) {
      newErrors.endDateOfJourney = "End date of journey is required.";
    } else if (
      formdata.startDateOfJourney &&
      new Date(formdata.endDateOfJourney) < new Date(formdata.startDateOfJourney)
    ) {
      newErrors.endDateOfJourney = "End date cannot be earlier than start date.";
    }

    // Trip Type
    const validTripTypes = ["backpacking", "leisure", "business"];
    if (!formdata.tripType || !validTripTypes.includes(formdata.tripType)) {
      newErrors.tripType = "Please select a valid trip type (Backpacking, Leisure, or Business).";
    }

    // Short Description
    if (!formdata.shortDescription || !formdata.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required.";
    } else if (formdata.shortDescription.trim().length < 5) {
      newErrors.shortDescription = "Short description must be at least 5 characters.";
    }

    // Total Cost
    if (formdata.totalCost !== "" && Number(formdata.totalCost) < 0) {
      newErrors.totalCost = "Total cost cannot be negative.";
    }

    // Image URL
    if (formdata.image && formdata.image.trim()) {
      const urlPattern = /^https?:\/\/.+/i;
      if (!urlPattern.test(formdata.image.trim())) {
        newErrors.image = "Please enter a valid URL starting with http:// or https://";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormdata((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (field === "image") {
      setImagePreviewError(false);
    }
  };

  const submitForm = async (e) => {
    if (e) e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formdata,
        tripName: formdata.tripName.trim(),
        shortDescription: formdata.shortDescription.trim(),
        placesVisited: formdata.placesVisited.trim(),
        nameOfHotels: formdata.nameOfHotels.trim(),
        experience: formdata.experience.trim(),
        totalCost: formdata.totalCost === "" ? 0 : Number(formdata.totalCost)
      };

      const res = await axios.post(`${baseUrl}/trip`, payload);

      if (res.data === "Trip added Successfully") {
        setSuccessMessage("Journey logged successfully to RoamLog!");
        alert("Journey logged successfully to RoamLog!");
        navigate("/");
      } else {
        const errorMsg =
          typeof res.data === "string" ? res.data : "Failed to save journey.";
        setServerError(errorMsg);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to save journey.";
      setServerError("Error: " + errorMsg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: "860px" }}>
      {/* Hero Header */}
      <div
        className="p-4 p-md-5 mb-4 rounded-4 text-white shadow-sm"
        style={{
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
        }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="fs-2">✍️</span>
              <h1 className="display-6 fw-bold mb-0">Log a Journey</h1>
            </div>
            <p className="fs-6 fst-italic text-white-50 mb-1">
              "Every journey, remembered."
            </p>
            <p className="mb-0 text-white-50 small">
              Record memories, highlights, destinations, and photos
            </p>
          </div>
          <Link to="/" className="btn btn-light fw-semibold px-4 py-2 shadow-sm rounded-pill">
            ← Back to RoamLog
          </Link>
        </div>
      </div>

      {/* Success & Error Banners */}
      {successMessage && (
        <div className="alert alert-success shadow-sm rounded-3 d-flex align-items-center gap-2 mb-4" role="alert">
          <span>✅</span>
          <div>{successMessage}</div>
        </div>
      )}
      {serverError && (
        <div className="alert alert-danger shadow-sm rounded-3 d-flex align-items-center gap-2 mb-4" role="alert">
          <span>⚠️</span>
          <div>{serverError}</div>
        </div>
      )}
      {Object.keys(errors).length > 0 && (
        <div className="alert alert-warning shadow-sm rounded-3 d-flex align-items-center gap-2 mb-4" role="alert">
          <span>⚠️</span>
          <div>Please review the highlighted fields below before saving.</div>
        </div>
      )}

      <form onSubmit={submitForm} noValidate>
        {/* Section 1: Basic Information */}
        <div className="card shadow-sm border-0 rounded-3 mb-4">
          <div className="card-header bg-white py-3 border-bottom">
            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
              <span>📍</span> Basic Information
            </h5>
          </div>
          <div className="card-body p-4">
            <div className="mb-3">
              <label htmlFor="tripName" className="form-label fw-semibold">
                Trip Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control form-control-lg ${errors.tripName ? "is-invalid" : ""}`}
                id="tripName"
                placeholder="e.g. Summer Vacation in Switzerland"
                value={formdata.tripName}
                maxLength={50}
                onChange={(e) => handleChange("tripName", e.target.value)}
              />
              {errors.tripName ? (
                <div className="invalid-feedback">{errors.tripName}</div>
              ) : (
                <div className="form-text text-end">{formdata.tripName.length}/50 characters</div>
              )}
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="tripType" className="form-label fw-semibold">
                  Trip Type <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.tripType ? "is-invalid" : ""}`}
                  id="tripType"
                  value={formdata.tripType}
                  onChange={(e) => handleChange("tripType", e.target.value)}
                >
                  <option value="leisure">🏖️ Leisure (Relaxation &amp; Holidays)</option>
                  <option value="backpacking">🎒 Backpacking (Treks &amp; Adventures)</option>
                  <option value="business">💼 Business (Work &amp; Conferences)</option>
                </select>
                {errors.tripType && <div className="invalid-feedback">{errors.tripType}</div>}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold d-block">
                  Featured Experience?
                </label>
                <div className="d-flex gap-4 pt-1">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="featuredTrue"
                      name="featured"
                      value="true"
                      checked={formdata.featured === true}
                      onChange={() => handleChange("featured", true)}
                    />
                    <label htmlFor="featuredTrue" className="form-check-label fw-medium">
                      ⭐ Yes (Highlight in RoamLog)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="featuredFalse"
                      name="featured"
                      value="false"
                      checked={formdata.featured === false}
                      onChange={() => handleChange("featured", false)}
                    />
                    <label htmlFor="featuredFalse" className="form-check-label fw-medium">
                      Standard
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Dates & Costs */}
        <div className="card shadow-sm border-0 rounded-3 mb-4">
          <div className="card-header bg-white py-3 border-bottom">
            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
              <span>📅</span> Travel Dates &amp; Budget
            </h5>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="startDate" className="form-label fw-semibold">
                  Start Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control ${errors.startDateOfJourney ? "is-invalid" : ""}`}
                  id="startDate"
                  value={formdata.startDateOfJourney}
                  onChange={(e) => handleChange("startDateOfJourney", e.target.value)}
                />
                {errors.startDateOfJourney && (
                  <div className="invalid-feedback">{errors.startDateOfJourney}</div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="endDate" className="form-label fw-semibold">
                  End Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control ${errors.endDateOfJourney ? "is-invalid" : ""}`}
                  id="endDate"
                  min={formdata.startDateOfJourney || undefined}
                  value={formdata.endDateOfJourney}
                  onChange={(e) => handleChange("endDateOfJourney", e.target.value)}
                />
                {errors.endDateOfJourney && (
                  <div className="invalid-feedback">{errors.endDateOfJourney}</div>
                )}
              </div>

              <div className="col-12">
                <label htmlFor="totalCost" className="form-label fw-semibold">
                  Total Cost (in ₹)
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    className={`form-control ${errors.totalCost ? "is-invalid" : ""}`}
                    id="totalCost"
                    placeholder="e.g. 25000"
                    value={formdata.totalCost}
                    onChange={(e) => handleChange("totalCost", e.target.value)}
                  />
                  {errors.totalCost && <div className="invalid-feedback">{errors.totalCost}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Places & Hotels */}
        <div className="card shadow-sm border-0 rounded-3 mb-4">
          <div className="card-header bg-white py-3 border-bottom">
            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
              <span>🏨</span> Places &amp; Accommodation
            </h5>
          </div>
          <div className="card-body p-4">
            <div className="mb-3">
              <label htmlFor="placesVisited" className="form-label fw-semibold">
                Places Visited
              </label>
              <input
                type="text"
                className="form-control"
                id="placesVisited"
                placeholder="e.g. Zurich, Lucerne, Interlaken, Grindelwald"
                value={formdata.placesVisited}
                onChange={(e) => handleChange("placesVisited", e.target.value)}
              />
              <div className="form-text">Comma-separated list of spots, cities, or landmarks.</div>
            </div>

            <div className="mb-0">
              <label htmlFor="nameOfHotels" className="form-label fw-semibold">
                Hotels / Stays
              </label>
              <input
                type="text"
                className="form-control"
                id="nameOfHotels"
                placeholder="e.g. Alpine Grand Resort &amp; Valley Lodge"
                value={formdata.nameOfHotels}
                onChange={(e) => handleChange("nameOfHotels", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Cover Image */}
        <div className="card shadow-sm border-0 rounded-3 mb-4">
          <div className="card-header bg-white py-3 border-bottom">
            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
              <span>🖼️</span> Cover Photo
            </h5>
          </div>
          <div className="card-body p-4">
            <label htmlFor="image" className="form-label fw-semibold">
              Image URL
            </label>
            <input
              type="url"
              className={`form-control ${errors.image ? "is-invalid" : ""}`}
              id="image"
              placeholder="https://images.unsplash.com/photo-..."
              value={formdata.image}
              onChange={(e) => handleChange("image", e.target.value)}
            />
            {errors.image && <div className="invalid-feedback">{errors.image}</div>}
            <div className="form-text">Provide an image link to showcase on your RoamLog card.</div>

            {formdata.image && !imagePreviewError ? (
              <div className="mt-3 p-2 bg-light rounded-3 text-center">
                <span className="d-block text-muted small mb-2">Live Preview</span>
                <img
                  src={formdata.image}
                  alt="Trip Preview"
                  className="rounded-3 shadow-sm"
                  style={{ maxHeight: "220px", maxWidth: "100%", objectFit: "cover" }}
                  onError={() => setImagePreviewError(true)}
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* Section 5: Story & Descriptions */}
        <div className="card shadow-sm border-0 rounded-3 mb-4">
          <div className="card-header bg-white py-3 border-bottom">
            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
              <span>📝</span> Memory &amp; Story
            </h5>
          </div>
          <div className="card-body p-4">
            <div className="mb-3">
              <label htmlFor="shortDescription" className="form-label fw-semibold">
                Short Description <span className="text-danger">*</span>
              </label>
              <textarea
                className={`form-control ${errors.shortDescription ? "is-invalid" : ""}`}
                id="shortDescription"
                rows="2"
                placeholder="A quick summary for card previews (e.g. Breathtaking hikes across snow-capped peaks and cozy valley stays)."
                value={formdata.shortDescription}
                onChange={(e) => handleChange("shortDescription", e.target.value)}
              />
              {errors.shortDescription ? (
                <div className="invalid-feedback">{errors.shortDescription}</div>
              ) : (
                <div className="form-text">Displayed on the RoamLog feed card.</div>
              )}
            </div>

            <div className="mb-0">
              <label htmlFor="experience" className="form-label fw-semibold">
                Detailed Experience
              </label>
              <textarea
                className="form-control"
                id="experience"
                rows="6"
                placeholder="Write all the memorable highlights, tips, itineraries, and stories from your journey..."
                value={formdata.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="card shadow-sm border-0 rounded-3 p-3 mb-5 bg-white">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <Link to="/" className="btn btn-outline-secondary px-4 py-2 rounded-pill">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary px-5 py-2 fw-semibold shadow-sm rounded-pill"
              disabled={loading}
              style={{ background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", border: "none" }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Saving to RoamLog...
                </>
              ) : (
                "💾 Save to RoamLog"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
