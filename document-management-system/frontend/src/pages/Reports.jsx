import Navbar from "../components/Navbar";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import api from "../services/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/reports.css";


function Reports() {
  const [documents, setDocuments] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");

      console.log("Documents:", response.data);

      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    if (!startDate && !endDate) return true;

    const docDate = new Date(doc.createdAt);

    if (startDate && docDate < new Date(startDate)) {
      return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      if (docDate > end) {
        return false;
      }
    }

    return true;
  });

  const totalDocuments = filteredDocuments.length;

  const approved = filteredDocuments.filter(
    (doc) => doc.status === "Approved"
  ).length;

  const rejected = filteredDocuments.filter(
    (doc) => doc.status === "Rejected"
  ).length;

  const pending = filteredDocuments.filter(
    (doc) => doc.status?.startsWith("Pending")
  ).length;

  const totalAmount = filteredDocuments.reduce(
    (sum, doc) => sum + (doc.amount || 0),
    0
  );

  const totalVat = filteredDocuments.reduce(
    (sum, doc) => sum + (doc.vat || 0),
    0
  );

  const vendorSpend = filteredDocuments.reduce((acc, doc) => {
  const vendor = doc.vendor || "Unknown";

  if (!acc[vendor]) {
    acc[vendor] = 0;
  }

  acc[vendor] += doc.amount || 0;

  return acc;
}, {});

const topVendor = Object.entries(vendorSpend)
  .sort((a, b) => b[1] - a[1])[0];

const highestInvoice =
  filteredDocuments.length > 0
    ? Math.max(
        ...filteredDocuments.map(
          (doc) => doc.amount || 0
        )
      )
    : 0;

const vendorsWithMultipleInvoices =
  Object.values(
    filteredDocuments.reduce((acc, doc) => {
      const vendor = doc.vendor || "Unknown";

      acc[vendor] = (acc[vendor] || 0) + 1;

      return acc;
    }, {})
  ).filter((count) => count > 1).length;

  const statusData = [
  {
    name: "Approved",
    value: approved,
  },
  {
    name: "Rejected",
    value: rejected,
  },
  {
    name: "Pending",
    value: pending,
  },
];

  const exportToExcel = () => {
    const reportData = filteredDocuments.map((doc) => ({
      ID: doc.id,
      Vendor: doc.vendor || "-",
      InvoiceNumber: doc.invoiceNumber || "-",
      Amount: doc.amount || 0,
      VAT: doc.vat || 0,
      Status: doc.status,
      Type: doc.documentType,
      Date: new Date(doc.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(reportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Documents"
    );

    XLSX.writeFile(
      workbook,
      "Document_Report.xlsx"
    );
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Document Management Report", 14, 20);

    pdf.setFontSize(12);
    pdf.text(`Total Documents: ${totalDocuments}`, 14, 35);
    pdf.text(`Approved: ${approved}`, 14, 43);
    pdf.text(`Rejected: ${rejected}`, 14, 51);
    pdf.text(`Pending: ${pending}`, 14, 59);

    pdf.text(`Total Invoice Amount: R ${totalAmount}`, 14, 75);
    pdf.text(`Total VAT: R ${totalVat}`, 14, 83);

    autoTable(pdf, {
      startY: 95,
      theme: "grid",
      head: [
        [
          "ID",
          "Vendor",
          "Invoice Number",
          "Amount",
          "VAT",
          "Status",
          "Type",
        ],
      ],
      body: filteredDocuments.map((doc) => [
        doc.id,
        doc.vendor || "-",
        doc.invoiceNumber || "-",
        `R ${doc.amount || 0}`,
        `R ${doc.vat || 0}`,
        doc.status,
        doc.documentType,
      ]),
    });

    pdf.save("Document_Report.pdf");
  };

  return (
  <>
    <Navbar />

    <div className="reports-page">
      <h1>📊 Reports Dashboard</h1>

<p className="reports-subtitle">
  Analyze document approvals, financial summaries, and vendor performance.
</p>

      <div className="report-filters">
        <input
  className="date-input"
  type="date"
  value={startDate}
  onChange={(e) => setStartDate(e.target.value)}
/>

        <input
  className="date-input"
  type="date"
  value={endDate}
  onChange={(e) => setEndDate(e.target.value)}
/>

        <button
  className="excel-btn"
  onClick={exportToExcel}
>
  📊 Export Excel
</button>

        <button
  className="pdf-btn"
  onClick={exportToPDF}
>
  📄 Export PDF
</button>
      </div>

     <div className="summary-cards">

  <div className="summary-card">
    <h3>Total Documents</h3>
    <p>{totalDocuments}</p>
  </div>

  <div className="summary-card approved-card">
    <h3>Approved</h3>
    <p>{approved}</p>
  </div>

  <div className="summary-card pending-card">
    <h3>Pending</h3>
    <p>{pending}</p>
  </div>

  <div className="summary-card rejected-card">
    <h3>Rejected</h3>
    <p>{rejected}</p>
  </div>

</div>

      <div className="report-card">

<h3>💰 Financial Summary</h3>

<p>
  Total Invoice Amount:
  <strong>
    {" "}
    R {totalAmount.toLocaleString()}
  </strong>
</p>

<p>
  Total VAT:
  <strong>
    {" "}
    R {totalVat.toLocaleString()}
  </strong>
</p>

</div>

      <hr />

<h3>AI Insights</h3>

<ul>
  <li>
    Top Vendor:
    {" "}
    {topVendor
      ? `${topVendor[0]} (R ${topVendor[1]})`
      : "No data"}
  </li>

  <li>
    Highest Invoice:
    {" "}
    R {highestInvoice}
  </li>

  <li>
    Pending Approvals:
    {" "}
    {pending}
  </li>

  <li>
    Vendors With Multiple Invoices:
    {" "}
    {vendorsWithMultipleInvoices}
  </li>

  <li>
    Total Spend:
    {" "}
    R {totalAmount}
  </li>
</ul>

<hr />

<h3>Approval Status Chart</h3>

<div
  style={{
    width: "100%",
    height: "400px",
  }}
>
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={statusData}
        dataKey="value"
        nameKey="name"
        outerRadius={120}
        label
      />
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>

      <h3>Vendor Analysis</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>
              Vendor
            </th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>
              Documents
            </th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>
              Total Spend
            </th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(
            filteredDocuments.reduce((acc, doc) => {
              const vendor = doc.vendor || "Unknown";

              if (!acc[vendor]) {
                acc[vendor] = {
                  count: 0,
                  amount: 0,
                };
              }

              acc[vendor].count += 1;
              acc[vendor].amount += doc.amount || 0;

              return acc;
            }, {})
          ).map(([vendor, data]) => (
            <tr key={vendor}>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {vendor}
              </td>

              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {data.count}
              </td>

              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                R {data.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h3>Approval Status Report</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Vendor</th>
            <th>Invoice Number</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredDocuments.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.id}</td>
              <td>{doc.vendor || "-"}</td>
              <td>{doc.invoiceNumber || "-"}</td>
              <td>{doc.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h3>VAT Report</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Invoice</th>
            <th>VAT</th>
          </tr>
        </thead>

        <tbody>
          {filteredDocuments.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.vendor || "-"}</td>
              <td>{doc.invoiceNumber || "-"}</td>
              <td>R {doc.vat || 0}</td>
            </tr>
          ))}
        </tbody>
           </table>
    </div>
  

  </>
);
}

export default Reports;