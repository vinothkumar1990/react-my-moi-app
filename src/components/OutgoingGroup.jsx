import React from 'react';
import { Atom } from 'react-loading-indicators';
import useFetch from './custom-hook/useFetch';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const OutgoingGroup = () => {
  const navigate = useNavigate();
  const { products, error, isLoading, setProducts } = useFetch(
    "https://68ea6044f1eeb3f856e7108e.mockapi.io/outgoing"
  );

  // 🧮 Group outgoing records by type
  const grouped = products.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {});

  const thStyle = {
    padding: '10px',
    borderBottom: '1px solid #ccc',
    textAlign: 'center',
    backgroundColor: '#0275d8',
    color: 'white'
  };

  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #eee',
    textAlign: 'center'
  };

  const tdTotalStyle = {
    padding: '10px',
    borderBottom: '1px solid #eee',
    textAlign: 'center',
    color: '#39740c',
    fontWeight: 'bold'
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <center><Atom color="#32cd32" size="medium" text="" textColor="" /></center>
      </div>
    );
  } else {
    return (
      <div style={{ padding: '10px' }}>
        {/* Print button (hidden in print view) */}
        <div
          className="no-print"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          
          <button
            onClick={handlePrint}
            className="btn btn-success"
            style={{ marginBottom: '10px' }}
          >
            🖨️ Print
          </button>
        </div>

        {/* Grouped Outgoing Data */}
        <div style={{ width: '100%' }}>
          {Object.entries(grouped).map(([type, items]) => (
            <div
              key={type}
              style={{
                marginBottom: '30px',
                border: '1px solid #aaa',
                borderRadius: '5px',
                overflow: 'hidden'
              }}
            >
              {/* Section Header */}
              <div style={{ backgroundColor: '#0275d8', color: 'white', padding: '10px 15px', fontSize: '18px' }}>
                {type}
              </div>

              {/* Table */}
              <div>
                <table
                  width="100%"
                  style={{
                    borderCollapse: 'collapse',
                    tableLayout: 'fixed',
                    width: '100%'
                  }}
                >
                  
                  <tbody>
                    {items.map((item, index) => (
                      <tr
                        key={item.id}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#f9d6d6' : '#f2f2f2',
                          textAlign: 'center'
                        }}
                      >
                        <td style={tdStyle}>{item.name}</td>
                        <td style={tdStyle}>{item.amount}</td>
                        <td style={tdStyle}>{item.type}</td>
                        <td style={tdStyle}>{item.description}</td>
                      </tr>
                    ))}

                    {/* 🧾 Total Row */}
                    <tr style={{ backgroundColor: '#dff0d8', textAlign: 'center' }}>
                      <td style={tdTotalStyle}>மொத்தம்</td>
                      <td style={tdTotalStyle}>
                        {
                          items.reduce((total, item) => total + parseFloat(item.amount || 0), 0)
                        }
                      </td>
                      <td style={tdTotalStyle}></td>
                      <td style={tdTotalStyle}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* 🖨️ Print Styles */}
        <style>
          {`
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                margin: 0;
                padding: 0;
                font-family: 'Noto Sans Tamil', sans-serif;
                width: 100%;
              }

              /* Hide navbar, footer, and print button */
              .no-print,
              .navbar,
              .footer {
                display: none !important;
              }

              html, body {
                height: 100%;
                overflow: visible !important;
              }

              /* ✅ Ensure full-width tables (no scrollbar) */
              table {
                width: 100% !important;
                border-collapse: collapse !important;
                table-layout: fixed !important;
              }

              th, td {
                border: 1px solid #000 !important;
                padding: 8px;
                word-wrap: break-word;
              }

              th {
                background-color: #0275d8 !important;
                color: white !important;
              }

              h3 {
                text-align: center;
                color: black;
                margin-bottom: 10px;
              }

              div {
                overflow: visible !important;
              }

              /* Prevent breaking inside grouped sections */
              div[style*="margin-bottom: 30px"] {
                page-break-inside: avoid;
              }

              /* Full-width A4 page */
              @page {
                size: A4 landscape;
                margin: 10mm;
              }
            }
          `}
        </style>
      </div>
    );
  }
};
