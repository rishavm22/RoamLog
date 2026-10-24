import React, { useEffect, useState, useMemo } from "react";
import Card from "../UIC/Card";
import FeaturedCard from "../UIC/FeaturedCard";
import axios from "axios";
import { baseUrl } from "../../url";

const CATEGORIES = [
  {
    id: "lastMonth",
    title: "Last Month",
    subtitle: "Recent adventures from the past 30 days",
    icon: "🕒",
    badgeColor: "bg-primary"
  },
  {
    id: "last6Months",
    title: "Last 6 Month",
    subtitle: "Journeys logged within the last 6 months",
    icon: "📅",
    badgeColor: "bg-info text-dark"
  },
  {
    id: "lastYear",
    title: "Last Year",
    subtitle: "Memories from 6 months to a year ago",
    icon: "🗓️",
    badgeColor: "bg-warning text-dark"
  },
  {
    id: "lastMemories",
    title: "Last Memories",
    subtitle: "Timeless travel moments older than a year",
    icon: "📖",
    badgeColor: "bg-secondary"
  }
];

export default function Home() {
  const [data, setData] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTrips = () => {
    axios
      .get(`${baseUrl}/trip/`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching trips:", err);
        setData([]);
      });
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = (id) => {
    setData((prev) => (prev ? prev.filter((item) => item._id !== id) : []));
  };

  // Categorize a single trip based on startDateOfJourney or createdAt
  const getTripCategory = (trip) => {
    const dateStr = trip.startDateOfJourney || trip.createdAt;
    if (!dateStr) return "lastMemories";
    const tripDate = new Date(dateStr);
    if (isNaN(tripDate.getTime())) return "lastMemories";

    const now = new Date();
    const diffTime = now.getTime() - tripDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays <= 30) {
      return "lastMonth";
    } else if (diffDays <= 182.5) {
      return "last6Months";
    } else if (diffDays <= 365.25) {
      return "lastYear";
    } else {
      return "lastMemories";
    }
  };

  // Group trips by category with optional search filtering
  const { groupedTrips, categoryCounts, totalCount } = useMemo(() => {
    const groups = {
      lastMonth: [],
      last6Months: [],
      lastYear: [],
      lastMemories: []
    };
    const counts = {
      lastMonth: 0,
      last6Months: 0,
      lastYear: 0,
      lastMemories: 0
    };

    if (!data) return { groupedTrips: groups, categoryCounts: counts, totalCount: 0 };

    const query = searchQuery.trim().toLowerCase();

    data.forEach((trip) => {
      const cat = getTripCategory(trip);
      counts[cat] = (counts[cat] || 0) + 1;

      const matchesSearch =
        !query ||
        trip.tripName?.toLowerCase().includes(query) ||
        trip.placesVisited?.toLowerCase().includes(query) ||
        trip.shortDescription?.toLowerCase().includes(query) ||
        trip.tripType?.toLowerCase().includes(query);

      if (matchesSearch) {
        groups[cat].push(trip);
      }
    });

    return {
      groupedTrips: groups,
      categoryCounts: counts,
      totalCount: data.length
    };
  }, [data, searchQuery]);

  if (!data) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading your RoamLog...</p>
      </div>
    );
  }

  // Filter sections to display
  const sectionsToDisplay =
    activeCategory === "all"
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.id === activeCategory);

  return (
    <div className="container my-4">
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
              <span className="fs-2">🧭</span>
              <h1 className="display-6 fw-bold mb-0">RoamLog</h1>
            </div>
            <p className="fs-5 fst-italic text-white-50 mb-2">
              "Every journey, remembered."
            </p>
            <p className="small mb-0 text-white-50">
              Categorized across time: Last Month, Last 6 Month, Last Year &amp; Last Memories
            </p>
          </div>
          <div className="text-md-end">
            <span className="badge bg-white text-dark px-3 py-2 rounded-pill fw-semibold shadow-sm fs-6">
              🗺️ {totalCount} {totalCount === 1 ? "Journey" : "Journeys"} Logged
            </span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="card shadow-sm border-0 rounded-3 mb-4">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">🔍</span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by trip, place, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchQuery("")}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="col-12 col-md-7">
              <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                <button
                  type="button"
                  className={`btn btn-sm ${
                    activeCategory === "all" ? "btn-dark" : "btn-outline-secondary"
                  } rounded-pill px-3`}
                  onClick={() => setActiveCategory("all")}
                >
                  All ({totalCount})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`btn btn-sm ${
                      activeCategory === cat.id ? "btn-dark" : "btn-outline-secondary"
                    } rounded-pill px-3`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.icon} {cat.title} ({categoryCounts[cat.id] || 0})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State when no trips match search or database is empty */}
      {totalCount === 0 ? (
        <div className="text-center py-5 my-4 bg-light rounded-4">
          <h3 className="fw-bold">No journeys logged yet!</h3>
          <p className="text-muted">Start documenting your adventures in your RoamLog.</p>
          <a href="/addexperience" className="btn btn-primary mt-2 rounded-pill px-4">
            Log Your First Experience
          </a>
        </div>
      ) : null}

      {/* Render Sections */}
      {sectionsToDisplay.map((cat) => {
        const trips = groupedTrips[cat.id] || [];

        return (
          <div key={cat.id} className="mb-5">
            {/* Category Section Header */}
            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <span className="fs-4">{cat.icon}</span>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">{cat.title}</h4>
                  <small className="text-muted">{cat.subtitle}</small>
                </div>
              </div>
              <span className={`badge ${cat.badgeColor} rounded-pill px-3 py-2 fs-6`}>
                {trips.length} {trips.length === 1 ? "Trip" : "Trips"}
              </span>
            </div>

            {/* Cards Grid */}
            {trips.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {trips.map((e) => (
                  <div className="col" key={e._id}>
                    {e.featured ? (
                      <FeaturedCard
                        id={e._id}
                        title={e.tripName}
                        tripType={e.tripType}
                        description={e.shortDescription}
                        image={e.image}
                        startDate={e.startDateOfJourney}
                        endDate={e.endDateOfJourney}
                        placesVisited={e.placesVisited}
                        totalCost={e.totalCost}
                        onDelete={handleDelete}
                      />
                    ) : (
                      <Card
                        id={e._id}
                        title={e.tripName}
                        tripType={e.tripType}
                        description={e.shortDescription}
                        image={e.image}
                        startDate={e.startDateOfJourney}
                        endDate={e.endDateOfJourney}
                        placesVisited={e.placesVisited}
                        totalCost={e.totalCost}
                        onDelete={handleDelete}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center bg-light rounded-3 text-muted">
                <p className="mb-0">
                  No memories found in <strong>{cat.title}</strong>
                  {searchQuery ? ` matching "${searchQuery}"` : ""}.
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
