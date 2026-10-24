import React from "react";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top py-2">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" href="/">
          <span className="fs-3">🧭</span>
          <div>
            <span className="fw-bold fs-4 text-dark" style={{ letterSpacing: "-0.5px" }}>
              Roam<span style={{ color: "#2a5298" }}>Log</span>
            </span>
            <small className="d-none d-sm-block text-muted" style={{ fontSize: "0.72rem", marginTop: "-3px" }}>
              Every journey, remembered.
            </small>
          </div>
        </a>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
          <div className="navbar-nav align-items-lg-center gap-2 mt-2 mt-lg-0">
            <a className="nav-link px-3 fw-medium text-secondary" href="/">
              📖 All Journeys
            </a>
            <a
              className="btn btn-primary btn-sm px-3 py-2 rounded-pill fw-semibold shadow-sm"
              href="/addexperience"
              style={{ background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", border: "none" }}
            >
              ➕ Log an Experience
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
