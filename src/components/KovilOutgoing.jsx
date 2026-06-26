import React from "react";
import { Commet } from "react-loading-indicators";
import useFetch from "./custom-hook/useFetch";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const KovilOutgoing = () => {
  const navigate = useNavigate();
  const { products, error, isLoading, setProducts } = useFetch(
    "https://68ea6044f1eeb3f856e7108e.mockapi.io/outgoing"
  );

  // ✅ Delete record
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://68ea6044f1eeb3f856e7108e.mockapi.io/outgoing/${id}`)
          .then(() => {
            const newList = products.filter((p) => p.id !== id);
            setProducts(newList);
            Swal.fire("Deleted!", "Record has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Error!", "Something went wrong while deleting.", "error");
          });
      }
    });
  };

  // ✅ Edit navigation
  const handleEdit = (id) => {
    navigate(`/update_outgoing/${id}`);
  };

  // ✅ Calculate total
  const totalAmount = products.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  // ✅ CSV download (Tamil compatible)
  const downloadCSV = () => {
    const rows = products.map((item) => [
      item.name,
      item.amount,
      item.type,
      item.description,
    ]);
    rows.push(["மொத்த செலவு", totalAmount, "", ""]);
    const csvContent = "\uFEFF" + rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "மொத்த_செலவு.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Print page
  const handlePrint = () => {
    window.print();
  };

  const thStyle = {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    color: "white",
  };
  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  };
  const tdTotalStyle = {
    padding: "10px",
    textAlign: "center",
    color: "#39740c",
    fontWeight: "bold",
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <Commet
          color="#32cd32"
          size="medium"
          text="loading..."
          textColor="#000"
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* ✅ Responsive Buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        <button
          onClick={() => navigate("/newOutgoing")}
          className="btn btn-primary"
          style={{
            backgroundColor: "#0275d8",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            fontWeight: "bold",
            minWidth: "120px",
          }}
        >
          ➕ Add New
        </button>

        <button
          onClick={downloadCSV}
          className="btn btn-success"
          style={{
            backgroundColor: "#28a745",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            fontWeight: "bold",
            minWidth: "120px",
          }}
        >
          📄 Download CSV
        </button>

        <button
          onClick={handlePrint}
          className="btn btn-secondary"
          style={{
            backgroundColor: "#6c757d",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            fontWeight: "bold",
            minWidth: "120px",
          }}
        >
          🖨️ Print Page
        </button>
      </div>

      {/* ✅ Table */}
      <div style={{ overflowX: "auto", maxWidth: "100%", margin: "0 auto" }}>
        <table
          width="100%"
          style={{
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#0275d8" }}>
              <th style={thStyle}>பெயர்</th>
              <th style={thStyle}>தொகை</th>
              <th style={thStyle}>வகை</th>
              <th style={thStyle}>விளக்கம்</th>
              <th style={thStyle} className="no-print">
                Edit
              </th>
              <th style={thStyle} className="no-print">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "20px", color: "gray" }}
                >
                  No outgoing records found.
                </td>
              </tr>
            ) : (
              products.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#f2f2f2",
                  }}
                >
                  <td style={tdStyle}>{item.name}</td>
                  <td style={tdStyle}>{item.amount}</td>
                  <td style={tdStyle}>{item.type}</td>
                  <td style={tdStyle}>{item.description}</td>
                  <td style={tdStyle} className="no-print">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="btn btn-primary btn-sm"
                      style={{
                        marginRight: "5px",
                        backgroundColor: "#0275d8",
                        border: "none",
                      }}
                    >
                      Edit
                    </button>
                  </td>
                  <td style={tdStyle} className="no-print">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-danger btn-sm"
                      style={{ backgroundColor: "#d9534f", border: "none" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
            {products.length > 0 && (
              <tr style={{ backgroundColor: "#d1ecf1" }}>
                <td style={tdTotalStyle}></td>
                <td style={tdTotalStyle} colSpan="3">
                  மொத்த செலவு: ₹{totalAmount.toLocaleString('ta-IN')}
                </td>
                <td style={tdTotalStyle} className="no-print"></td>
                <td style={tdTotalStyle} className="no-print"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {/* ✅ Print + Mobile Styles */}
      <style>
        {`
          @media (max-width: 600px) {
            table {
              font-size: 0.85rem;
            }
            button {
              width: 100%;
              margin-bottom: 8px;
            }
          }

          @media print {
            button, .btn, .no-print {
              display: none !important;
            }
            .navbar, .footer {
              display: none !important;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-family: 'Noto Sans Tamil', sans-serif;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
            }
            th {
              background-color: #0275d8 !important;
              color: white !important;
            }
            /* ✅ Completely remove Edit/Delete columns from print (no gaps) */
            thead th:nth-last-child(-n+2),
            tbody td:nth-last-child(-n+2),
            tfoot td:nth-last-child(-n+2) {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};
