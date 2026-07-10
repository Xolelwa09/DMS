import { Link } from "react-router-dom";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";



function Dashboard() {


    const role = localStorage.getItem("role")?.toLowerCase();
    console.log("ROLE:", role);
console.log("ROLE TYPE:", typeof role);


  return (
    <>
  <Navbar />

  <div className="dashboard">

      <h2>Dashboard</h2>

<p className="welcome-text">
  Welcome, {localStorage.getItem("name")} ({role})
</p>



      <div className="card-grid">

  {/* User */}
  {role === "user" && (
    <>
      <Link to="/upload" className="card">
        <div className="card-icon">📤</div>
        <h3>Upload Documents</h3>
        <p>Upload invoices and supporting documents.</p>
        <span className="card-link">Go →</span>
      </Link>

      <Link to="/documents" className="card">
        <div className="card-icon">📄</div>
        <h3>My Documents</h3>
        <p>View documents you have uploaded.</p>
        <span className="card-link">Go →</span>
      </Link>
    </>
  )}

  {/* Reviewer */}
  {role === "reviewer" && (
    <Link to="/documents" className="card">
      <div className="card-icon">✅</div>
      <h3>Review Documents</h3>
      <p>Review and approve pending documents.</p>
      <span className="card-link">Go →</span>
    </Link>
  )}

  {/* Manager */}
  {role === "manager" && (
    <>
      <Link to="/documents" className="card">
        <div className="card-icon">📋</div>
        <h3>Manager Approval</h3>
        <p>Approve documents awaiting manager review.</p>
        <span className="card-link">Go →</span>
      </Link>

      <Link to="/reports" className="card">
        <div className="card-icon">📊</div>
        <h3>Reports</h3>
        <p>View system reports and analytics.</p>
        <span className="card-link">Go →</span>
      </Link>
    </>
  )}

  {/* Finance */}
  {role === "finance" && (
    <>
      <Link to="/documents" className="card">
        <div className="card-icon">💰</div>
        <h3>Finance Approval</h3>
        <p>Perform final approval of documents.</p>
        <span className="card-link">Go →</span>
      </Link>

      <Link to="/reports" className="card">
        <div className="card-icon">📊</div>
        <h3>Reports</h3>
        <p>View financial reports and analytics.</p>
        <span className="card-link">Go →</span>
      </Link>
    </>
  )}

  {/* Admin */}
  {role === "admin" && (
    <>
      <Link to="/upload" className="card">
        <div className="card-icon">📤</div>
        <h3>Upload Documents</h3>
        <span className="card-link">Go →</span>
      </Link>

      <Link to="/documents" className="card">
        <div className="card-icon">📄</div>
        <h3>Manage Documents</h3>
        <span className="card-link">Go →</span>
      </Link>

      <Link to="/reports" className="card">
        <div className="card-icon">📊</div>
        <h3>Reports</h3>
        <span className="card-link">Go →</span>
      </Link>
    </>
  )}

</div>
    
    </div>
</>
  );
}

export default Dashboard;