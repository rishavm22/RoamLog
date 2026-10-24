import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../url";

export default function ExperienceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseUrl}/trip/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error loading trip details:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this trip experience from RoamLog?")) {
      try {
        await axios.delete(`${baseUrl}/trip/${id}`);
        alert("Experience deleted successfully!");
        navigate("/");
      } catch (err) {
        console.error("Error deleting experience:", err);
        alert("Failed to delete experience.");
      }
    }
  };

  const getBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case "backpacking":
        return "bg-warning text-dark";
      case "business":
        return "bg-secondary text-white";
      case "leisure":
      default:
        return "bg-info text-dark";
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading journey details from RoamLog...</p>
      </div>
    );
  }

  if (!data || typeof data === "string") {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning py-4">
          <h4>Journey Not Found</h4>
          <p className="text-muted">The experience you are looking for may have been removed.</p>
          <Link to="/" className="btn btn-primary mt-2 rounded-pill px-4">
            Back to RoamLog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4" style={{ maxWidth: "860px" }}>
      {/* Top Navigation */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/" className="btn btn-outline-secondary btn-sm px-3 rounded-pill">
          ← Back to RoamLog
        </Link>
        <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={handleDelete}>
          🗑️ Delete Experience
        </button>
      </div>

      {/* Main Card */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4 bg-white">
        {data.image ? (
          <img
            src={data.image}
            alt={data.tripName}
            className="w-100"
            style={{ maxHeight: "420px", objectFit: "cover" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : null}

        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
            <div>
              <h1 className="fw-bold mb-1 text-dark">{data.tripName}</h1>
              {data.shortDescription && (
                <p className="text-muted fs-5 mb-0">{data.shortDescription}</p>
              )}
            </div>
            <div className="d-flex gap-2">
              {data.featured && (
                <span className="badge bg-success px-3 py-2 fs-6">⭐ Featured</span>
              )}
              {data.tripType && (
                <span className={`badge ${getBadgeClass(data.tripType)} text-uppercase px-3 py-2 fs-6`}>
                  {data.tripType}
                </span>
              )}
            </div>
          </div>

          <hr className="my-4 text-muted" />

          {/* Quick Info Grid */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <span className="d-block text-muted small fw-semibold">📅 TRAVEL DATES</span>
                <span className="fw-medium">
                  {data.startDateOfJourney} {data.endDateOfJourney ? `to ${data.endDateOfJourney}` : ""}
                </span>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <span className="d-block text-muted small fw-semibold">💰 TOTAL BUDGET</span>
                <span className="fw-medium text-success">
                  {data.totalCost ? `₹${Number(data.totalCost).toLocaleString()}` : "Not specified"}
                </span>
              </div>
            </div>

            {data.placesVisited && (
              <div className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-3 h-100">
                  <span className="d-block text-muted small fw-semibold">📍 PLACES VISITED</span>
                  <span className="fw-medium">{data.placesVisited}</span>
                </div>
              </div>
            )}

            {data.nameOfHotels && (
              <div className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-3 h-100">
                  <span className="d-block text-muted small fw-semibold">🏨 HOTELS &amp; STAYS</span>
                  <span className="fw-medium">{data.nameOfHotels}</span>
                </div>
              </div>
            )}
          </div>

          {/* Experience Story */}
          {data.experience && (
            <div className="mt-4">
              <h4 className="fw-bold text-dark mb-3">📖 The Journey &amp; Story</h4>
              <div
                className="text-secondary lh-lg fs-6 p-4 rounded-3 border bg-light"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {data.experience}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
