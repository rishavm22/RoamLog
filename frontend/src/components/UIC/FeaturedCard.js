import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../url";

export default function FeaturedCard(props) {
  const {
    id,
    title,
    tripType,
    description,
    image,
    startDate,
    endDate,
    placesVisited,
    totalCost,
    onDelete
  } = props;

  const navigate = useNavigate();

  const visitDetails = () => {
    navigate(`/experiencedetails/${id}`);
  };

  const deleteTrip = async () => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await axios.delete(`${baseUrl}/trip/${id}`);
        if (onDelete) {
          onDelete(id);
        }
      } catch (error) {
        console.error("Error deleting experience:", error);
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

  return (
    <div
      className="card h-100 shadow rounded-3 overflow-hidden position-relative bg-white"
      style={{ border: "2px solid #198754" }}
    >
      <div className="position-absolute top-0 start-0 m-2" style={{ zIndex: 1 }}>
        <span className="badge bg-success shadow-sm px-3 py-1">⭐ Featured</span>
      </div>
      {image ? (
        <img
          src={image}
          alt={title}
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : null}
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title fw-bold text-dark mb-0">{title}</h5>
          {tripType ? (
            <span className={`badge ${getBadgeClass(tripType)} text-uppercase px-2 py-1`}>
              {tripType}
            </span>
          ) : null}
        </div>

        {startDate || endDate ? (
          <div className="text-muted small mb-2">
            <span>📅 {startDate}{endDate ? ` - ${endDate}` : ""}</span>
          </div>
        ) : null}

        {placesVisited ? (
          <div className="text-secondary small mb-2 text-truncate" title={placesVisited}>
            <span>📍 {placesVisited}</span>
          </div>
        ) : null}

        <p className="card-text text-muted flex-grow-1" style={{ fontSize: "0.95rem" }}>
          {description}
        </p>

        {totalCost ? (
          <div className="mb-3 text-success fw-semibold small">
            💰 ₹{Number(totalCost).toLocaleString()}
          </div>
        ) : null}

        <div className="d-flex gap-2 mt-auto pt-2 border-top">
          <button className="btn btn-success btn-sm flex-grow-1" onClick={visitDetails}>
            More Details
          </button>
          <button className="btn btn-outline-danger btn-sm" onClick={deleteTrip}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
