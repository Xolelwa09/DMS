import { Link } from "react-router-dom";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";

function Dashboard() {


  return (
    <>
  <Navbar />

  <div className="dashboard">

      <h2>Dashboard</h2>

<p className="welcome-text">
    Welcome back! Manage your documents and reports from one place.
</p>

      {/* Cards */}
      <div className="card-grid">
<Link to="/upload" className="card">

    <div className="card-icon">📤</div>

    <h3>Upload Documents</h3>

    <p>
        Upload invoices and supporting
        documents into the system.
    </p>

    <span className="card-link">
        Go →
    </span>

</Link>


        <Link to="/documents" className="card">

    <div className="card-icon">📄 </div>

    <h3>View Documents</h3>

    <p>
        Browse and manage uploaded documents
        into the system.
    </p>

    <span className="card-link">
        Go →
    </span>

</Link>

           <Link to="/reports" className="card">

    <div className="card-icon">📊 </div>

    <h3>Reports</h3>

    <p>
        View financial reports and analytics
        into the system.
    </p>

    <span className="card-link">
        Go →
    </span>

</Link>

      </div>

    
    </div>
</>
  );
}

export default Dashboard;