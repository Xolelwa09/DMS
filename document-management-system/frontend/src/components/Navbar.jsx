import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        📁 <span>Document Management System</span>
      </div>

      <div className="navbar-links">
        <Link
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          Dashboard
        </Link>

        <Link
          to="/upload"
          className={location.pathname === "/upload" ? "active" : ""}
        >
          Upload
        </Link>

        <Link
          to="/documents"
          className={location.pathname === "/documents" ? "active" : ""}
        >
          Documents
        </Link>

        <Link
          to="/reports"
          className={location.pathname === "/reports" ? "active" : ""}
        >
          Reports
        </Link>
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;