import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/documents.css";


function Documents() {
  const [documents, setDocuments] = useState([]);

  const [searchVendor, setSearchVendor] = useState("");
  const [searchInvoice, setSearchInvoice] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const role = (localStorage.getItem("role") || "")
  .trim()
  .toLowerCase();


  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(
        `/documents/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Status updated successfully!");
      fetchDocuments();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update status."
      );
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const vendorMatch =
      !searchVendor ||
      doc.vendor?.toLowerCase().includes(
        searchVendor.toLowerCase()
      );

    const invoiceMatch =
      !searchInvoice ||
      doc.invoiceNumber?.toLowerCase().includes(
        searchInvoice.toLowerCase()
      );

    const statusMatch =
      !statusFilter ||
      doc.status === statusFilter;

    const typeMatch =
      !typeFilter ||
      doc.documentType === typeFilter;

    return (
      vendorMatch &&
      invoiceMatch &&
      statusMatch &&
      typeMatch
    );
  });


  return (
    <div className="documents">
     <h2>
  {role === "user" && "📄 My Documents"}
  {role === "reviewer" && "✅ Documents Awaiting Review"}
  {role === "manager" && "📋 Documents Awaiting Manager Approval"}
  {role === "finance" && "💰 Documents Awaiting Finance Approval"}
  {role === "admin" && "📄 All Documents"}
</h2>

<div className="summary-cards">

  <div className="summary-card">
    <h3>Total</h3>
    <p>{documents.length}</p>
  </div>

  <div className="summary-card approved-card">
    <h3>Approved</h3>
    <p>{documents.filter(doc => doc.status === "Approved").length}</p>
  </div>

  <div className="summary-card pending-card">
    <h3>Pending</h3>
    <p>{documents.filter(doc => doc.status?.includes("Pending")).length}</p>
  </div>

  <div className="summary-card rejected-card">
    <h3>Rejected</h3>
    <p>{documents.filter(doc => doc.status === "Rejected").length}</p>
  </div>

</div>


      <div className="filters card-section">
        <input
          type="text"
          placeholder="Search Vendor"
          value={searchVendor}
          onChange={(e) =>
            setSearchVendor(e.target.value)
          }
      
        />

        <input
          type="text"
          placeholder="Search Invoice Number"
          value={searchInvoice}
          onChange={(e) =>
            setSearchInvoice(e.target.value)
          }
         
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
         
        >
          <option value="">All Statuses</option>
<option value="Pending Stage 1">Pending Stage 1</option>
<option value="Pending Stage 2">Pending Stage 2</option>
<option value="Pending Stage 3">Pending Stage 3</option>
<option value="Approved">Approved</option>
<option value="Rejected">Rejected</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
        >
          <option value="">All Types</option>
          <option value="invoice">Invoice</option>
          <option value="credit-note">Credit Note</option>
        </select>

        <button
  className="reset-btn"
  onClick={() => {
    setSearchVendor("");
    setSearchInvoice("");
    setStatusFilter("");
    setTypeFilter("");
  }}
>
  Reset Filters
</button>
      </div>

      <p className="document-count">
  Showing {filteredDocuments.length} of {documents.length} documents
</p>

     
  <div className="table-card">

<div className="table-header">
    <h3>Document List</h3>
</div>

<div className="table-container">
<table>
        <thead>
          <tr>
            <th >ID</th>
            <th >Type</th>
            <th >File Name</th>
            <th >Status</th>
            <th >Vendor</th>
            <th >Invoice Number</th>
            <th >Amount</th>
            <th >Uploaded</th>
            <th >Preview</th>
            <th >Download</th>
            <th >Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredDocuments.map((doc) => (
            <tr key={doc.id}>
              <td >{doc.id}</td>
              <td >
                {doc.documentType}
              </td>
              <td >{doc.fileName}</td>
              <td>
  <span
    className={
      doc.status === "Approved"
        ? "status-approved"
        : doc.status === "Rejected"
        ? "status-rejected"
        : "status-pending"
    }
  >
    {doc.status}
  </span>
</td>
              <td >
                {doc.vendor || "-"}
              </td>
              <td >
                {doc.invoiceNumber || "-"}
              </td>
              <td>
  {doc.amount
    ? `R ${Number(doc.amount).toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
      })}`
    : "-"}
</td>

              <td >
                {new Date(
                  doc.createdAt
                ).toLocaleDateString()}
              </td>

              <td >
                <a
                  href={`http://localhost:5000/${doc.filePath.replace(
                    /\\/g,
                    "/"
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  👁 View
                </a>
              </td>

              <td >
                <a
                  href={`http://localhost:5000/${doc.filePath.replace(
                    /\\/g,
                    "/"
                  )}`}
                  download
                >
                 ⬇ Download
                </a>
              </td>

      <td >
  {(() => {
    

    const status = doc.status;

console.log({
  id: doc.id,
  status,
  role,
});

    // Reviewer - Stage 1
    if (status === "Pending Stage 1" && role === "reviewer") {
      return (
        <>
          <button
  className="approve-btn"
  onClick={() => updateStatus(doc.id, "Approved")}
>
  Approve
</button>

          <button
            onClick={() => updateStatus(doc.id, "Rejected")}
            className="reject-btn"
          >
            Reject
          </button>
        </>
      );
    }

    // Manager - Stage 2
    if (status === "Pending Stage 2" && role === "manager") {
      return (
        <>
          <button className="approve-btn" onClick={() => updateStatus(doc.id, "Approved")}>
            Approve
          </button>

          <button
            className="reject-btn"
            onClick={() => updateStatus(doc.id, "Rejected")}
            
          >
            Reject
          </button>
        </>
      );
    }

    // Finance/Admin - Stage 3
    if (
      status === "Pending Stage 3" &&
      (role === "finance" || role === "admin")
    ) {
      return (
        <>
          <button className="approve-btn" onClick={() => updateStatus(doc.id, "Approved")}>
            Final Approve
          </button>

          <button
            className="reject-btn"
            onClick={() => updateStatus(doc.id, "Rejected")}
           
          >
            Reject
          </button>
        </>
      );
    }

    if (status === "Approved") {
      return <span className="approved">✅ Approved</span>;
    }

    if (status === "Rejected") {
      return <span className="rejected">❌ Rejected</span>;
    }

    return <span>No actions</span>;
  })()}
</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>


      </div>
    
    </div>
  );
}

export default Documents;