import React from 'react';
import { Commet } from 'react-loading-indicators';
import useFetch from './custom-hook/useFetch';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export const KovilBalance = () => {
  const navigate = useNavigate();
  const { products, error, isLoading, setProducts } = useFetch(
    "https://68e3d31b8e14f4523daec9c5.mockapi.io/api/v1/all_mois"
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
          .delete(`https://68e3d31b8e14f4523daec9c5.mockapi.io/api/v1/all_mois/${id}`)
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
    navigate(`/update_balance/${id}`);
  };

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

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <Commet color="#32cd32" size="medium" text="loading..." textColor="#000" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* ✅ Responsive Button Container */}
      <div
        style={{
          marginBottom: '25px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <button
          onClick={() => navigate("/new/balance")}
          className="btn btn-primary"
          style={{
            backgroundColor: '#0275d8',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          ➕ Add New
        </button>

        <button
          onClick={downloadCSV}
          className="btn btn-success"
          style={{
            backgroundColor: '#28a745',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          📄 Download CSV
        </button>

        <button
          onClick={handlePrint}
          className="btn btn-info"
          style={{
            backgroundColor: '#17a2b8',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          🖨️ Print
        </button>
      </div>

      {/* ✅ Table Section */}
      <div style={{ overflowX: 'auto', maxWidth: '100%', margin: '0 auto' }}>
        <table
          width="100%"
          style={{
            borderCollapse: 'collapse',
            backgroundColor: '#fff',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#0275d8' }}>
              <th style={{ ...thStyle, textAlign: 'center' }} colSpan="4">மொத்த மீதம்</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
                  No records found.
                </td>
              </tr>
            ) : (
              products.map((item, index) => (
                <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#f2f2f2' }}>
                  <td style={tdStyle}>{item.year}</td>
                  <td style={tdStyle}>{item.balance_amount}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="btn btn-primary btn-sm"
                      style={{
                        backgroundColor: '#0275d8',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        color: 'white'
                      }}
                    >
                      Edit
                    </button>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-danger btn-sm"
                      style={{
                        backgroundColor: '#d9534f',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        color: 'white'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {/* ✅ Print + Mobile Styles */}
      <style>
        {`
          @media (max-width: 768px) {
            button {
              width: 100%;
              font-size: 16px;
            }
            table th, table td {
              font-size: 14px;
              padding: 8px;
            }
          }

          @media print {
            button, .btn {
              display: none !important;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background: white;
              font-family: 'Noto Sans Tamil', sans-serif;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
            }
            th, td {
              border: 1px solid #000 !important;
              padding: 8px !important;
              text-align: center !important;
            }
            th {
              background-color: #0275d8 !important;
              color: white !important;
            }
            .navbar, .footer {
              display: none !important;
            }
            /* Hide edit/delete columns in print */
            tr td:nth-child(3),
            tr td:nth-child(4),
            tr th:nth-child(3),
            tr th:nth-child(4) {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};
