import React, { useEffect, useRef } from "react";
import useData from "./custom-hook/useData";
import { useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import axios from "axios";
import Swal from "sweetalert2";
import "./Home.css";

export const Loan = () => {
  const navigate = useNavigate();
  const { products, error, isLoading, setProducts } = useData(
    "https://maywdxirobbziiuhjttx.supabase.co/rest/v1/loans",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA",
        "Content-Type": "application/json",
      },
    }
  );

  const lastRowRef = useRef(null);

  // ✅ Scroll to last row when a new record is added
  useEffect(() => {
    if (lastRowRef.current) {
      lastRowRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [products.length]);

  // ✅ Delete Function
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://maywdxirobbziiuhjttx.supabase.co/rest/v1/loans?id=eq.${id}`,
            {
              headers: {
                apikey:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA",
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA",
                "Content-Type": "application/json",
              },
            }
          )
          .then(() => {
            const newProductList = products.filter((p) => p.id !== id);
            setProducts(newProductList);
            Swal.fire("Deleted!", "Your record has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Delete error:", error);
            Swal.fire("Error!", "Something went wrong while deleting.", "error");
          });
      }
    });
  };

  // ✅ Edit Function
  const handleEdit = (id) => {
    navigate(`/update_loan/${id}`);
  };

  // ✅ Calculate Totals
  const totalOldAmount = products.reduce(
    (sum, item) => sum + Number(item.old_amount || 0),
    0
  );
  const totalNewAmount = products.reduce(
    (sum, item) => sum + Number(item.new_amount || 0),
    0
  );

  // ✅ Export to CSV
  const exportToCSV = () => {
    const headers = [
      "ஊர்",
      "பெயர்",
      "பழைய பணம்",
      "புதிய பணம்",
      "தடவை",
      "திருமண விழா",
    ];
    const rows = products.map((item) => [
      item.place,
      item.name,
      item.old_amount,
      item.new_amount,
      item.given_amount_status,
      item.function_name,
    ]);
    rows.push([]);
    rows.push(["", "மொத்தம்:", totalOldAmount, totalNewAmount, "", ""]);

    const csvContent = [
      "\uFEFF" + headers.join(","), // UTF-8 BOM
      ...rows.map((r) =>
        r.map((f) => `"${String(f || "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "all_moi_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Print
  const handlePrint = () => window.print();

  if (isLoading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <OrbitProgress color="#32cd32" size="medium" />
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        ⚠️ Error: {error.message}
      </div>
    );

  const thStyle = {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    color: "white",
  };
  const tdStyle = { padding: "10px", borderBottom: "1px solid #eee" };
  const tdTotalStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
    color: "#39740c",
  };

  return (
    <div style={{ padding: "10px" }}>
      {/* ✅ Buttons */}
      <div style={{ textAlign: "right", margin: "10px 20px" }}>
        <button
          onClick={exportToCSV}
          style={{
            backgroundColor: "#d9534f",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Download CSV
        </button>
        <button
          onClick={handlePrint}
          style={{
            backgroundColor: "#0275d8",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Print Page
        </button>
      </div>

      {/* ✅ Add New Moi */}
      {/*<article style={{ marginBottom: "20px" }}>
        <span
          style={{
            color: "#163b16ff",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Create New Loan
        </span>
        <button
          onClick={() => navigate("/new/loan")}
          className="btn btn-primary"
          style={{ marginLeft: "10px" }}
        >
          Click me
        </button>
      </article>*/}

      {/* ✅ Table */}
      <div style={{ overflowX: "auto" }}>
        <table width="100%" border="1" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#0275d8" }}>
              <th style={thStyle}>ஊர்</th>
              <th style={thStyle}>பெயர்</th>
              <th style={thStyle}>பழைய பணம்</th>
              <th style={thStyle}>புதிய பணம்</th>
              <th style={thStyle}>தடவை</th>
              <th style={thStyle}>திருமண விழா</th>
              <th style={thStyle}></th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr
                key={item.id}
                ref={index === products.length - 1 ? lastRowRef : null}
                style={{
                  textAlign: "center",
                  backgroundColor: index % 2 === 0 ? "#f7d4e7" : "#e2e2e2",
                }}
              >
                <td style={tdStyle}>{item.place}</td>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>{item.old_amount}</td>
                <td style={tdStyle}>{item.new_amount}</td>
                <td style={tdStyle}>{item.given_amount_status}</td>
                <td style={tdStyle}>{item.function_name}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="btn btn-primary btn-sm"
                    style={{ marginRight: "5px" }}
                  >
                    Edit
                  </button>
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr
              style={{
                backgroundColor: "#d1ecf1",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}>மொத்தம்</td>
              <td style={tdTotalStyle}>{totalOldAmount}</td>
              <td style={tdTotalStyle}>{totalNewAmount}</td>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ✅ Print CSS */}
      <style>
        {`
        @media print {
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { size: landscape; margin: 10mm; }
          .navbar, .footer {
              display: none !important;
            }
          button { display: none !important; }
          table { width: 100% !important; font-size: 12px !important; }
          th, td { border: 1px solid #000 !important; padding: 8px !important; }
        }
      `}
      </style>
    </div>
  );
};
