import React from 'react';
import { Commet } from 'react-loading-indicators';
import useFetch from './custom-hook/useFetch';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export const KovilIncome = () => {
  const navigate = useNavigate();
  const { products, error, isLoading, setProducts } = useFetch(
    "https://68ea6044f1eeb3f856e7108e.mockapi.io/income"
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
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://68ea6044f1eeb3f856e7108e.mockapi.io/income/${id}`)
          .then(() => {
            const newList = products.filter(p => p.id !== id);
            setProducts(newList);
            Swal.fire("Deleted!", "Record has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Error!", "Something went wrong while deleting.", "error");
          });
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/update_income/${id}`);
  };

  // ✅ Calculate total amount
  const totalAmount = products.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  // ✅ CSV download
  const downloadCSV = () => {
    const rows = products.map(item => [item.name, item.amount, item.type, item.description]);
    rows.push(["மொத்த வரவு", totalAmount, "", ""]);
    let csvContent = "\uFEFF" + [...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "மொத்த_வரவு.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Print page
  const handlePrint = () => {
    window.print();
  };

  const thStyle = { padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'center', color: 'white' };
  const tdStyle = { padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center' };
  const tdTotalStyle = { padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center', color: '#39740c', fontWeight: 'bold' };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <Commet color="#32cd32" size="medium" text="loading..." textColor="#000" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* ✅ Action Buttons */}
      <div style={{ marginBottom: '25px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
        <button
          onClick={() => navigate("/newIncome")}
          className="btn btn-primary"
          style={{ backgroundColor: '#0275d8', border: 'none', padding: '8px 16px', borderRadius: '5px', fontWeight: 'bold' }}
        >
          ➕ Add New
        </button>

        <button
          onClick={downloadCSV}
          className="btn btn-success"
          style={{ padding: '8px 16px', borderRadius: '5px', fontWeight: 'bold' }}
        >
          📄 Download CSV
        </button>

        <button
          onClick={handlePrint}
          className="btn btn-info"
          style={{ padding: '8px 16px', borderRadius: '5px', fontWeight: 'bold', backgroundColor: '#17a2b8', border: 'none' }}
        >
          🖨️ Print
        </button>
      </div>

      {/* ✅ Table Wrapper */}
      <div style={{ overflowX: 'auto', maxWidth: '100%', margin: '0 auto' }}>
        <table
          width="100%"
          style={{
            borderCollapse: 'collapse',
            backgroundColor: '#fff',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
            fontSize: '14px'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#0275d8' }}>
              <th style={thStyle}>பெயர்</th>
              <th style={thStyle}>தொகை</th>
              <th style={thStyle}>வகை</th>
              <th style={thStyle}>விளக்கம்</th>
              <th style={thStyle} className="no-print">Edit</th>
              <th style={thStyle} className="no-print">Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
                  No income records found.
                </td>
              </tr>
            ) : (
              products.map((item, index) => (
                <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#f2f2f2' }}>
                  <td style={tdStyle}>{item.name}</td>
                  <td style={tdStyle}>{item.amount}</td>
                  <td style={tdStyle}>{item.type}</td>
                  <td style={tdStyle}>{item.description}</td>
                  <td style={tdStyle} className="no-print">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="btn btn-primary btn-sm"
                      style={{ marginRight: '5px', backgroundColor: '#0275d8', border: 'none' }}
                    >
                      Edit
                    </button>
                  </td>
                  <td style={tdStyle} className="no-print">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-danger btn-sm"
                      style={{ backgroundColor: '#d9534f', border: 'none' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
            {products.length > 0 && (
              <tr style={{ backgroundColor: '#d1ecf1' }}>
                <td style={tdTotalStyle}></td>
                <td style={tdTotalStyle} colSpan="3">
                  மொத்த வரவு: ₹{totalAmount.toLocaleString('ta-IN')}
                </td>
                <td style={tdTotalStyle} className="no-print"></td>
                <td style={tdTotalStyle} className="no-print"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {/* ✅ Print + Mobile Responsive Styles */}
      <style>
        {`
          /* General Mobile Optimization */
          @media (max-width: 600px) {
            table {
              font-size: 12px !important;
            }
            th, td {
              padding: 6px !important;
            }
            button {
              width: 100%;
              margin-bottom: 10px;
            }
          }

          /* ✅ Print Styling */
          @media print {
            button, .btn, .no-print {
              display: none !important;
            }

            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-family: 'Noto Sans Tamil', sans-serif;
              font-size: 12pt;
              margin: 0;
              padding: 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12pt;
              page-break-inside: auto;
            }

            th, td {
              border: 1px solid #000;
              padding: 8px;
              word-wrap: break-word;
              text-align: center;
            }

            th {
              background-color: #0275d8 !important;
              color: white !important;
            }

            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }

            .navbar, .footer {
              display: none !important;
            }

            @page {
              size: A4 portrait;
              margin: 10mm;
            }
          }
        `}
      </style>
    </div>
  );
};
