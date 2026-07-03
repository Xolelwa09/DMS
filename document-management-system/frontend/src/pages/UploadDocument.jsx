import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/upload.css";

function UploadDocument() {
  const [documentType, setDocumentType] = useState("invoice");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("documentType", documentType);
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:5000/api/documents/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message || "Upload failed."
      );
    }
  };

  return (
  <>
    <Navbar />

    <div className="upload-page">

      <div className="upload-card">

        <h2>📤 Upload Document</h2>

        <p className="upload-subtitle">
          Upload invoices and supporting documents for approval.
        </p>

        <form onSubmit={handleUpload}>

          <div className="form-group">

            <label>Document Type</label>

            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="invoice">Invoice</option>
              <option value="credit_note">Credit Note</option>
            </select>

          </div>

          <div className="form-group">

            <label>Select File</label>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

          </div>

          {file && (
            <div className="selected-file">
              📄 {file.name}
            </div>
          )}

          <button className="upload-btn" type="submit">
            📤 Upload Document
          </button>

        </form>

        {message && (
          <div className="upload-message">
            {message}
          </div>
        )}

      </div>

    </div>
  </>
);
}

export default UploadDocument;