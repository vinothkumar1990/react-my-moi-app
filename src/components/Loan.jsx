import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import axios from "axios";
import Swal from "sweetalert2";
import "./Home.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/LoanAllProvider";
export const Loan = () => {
  const {
    navigate,
    products,
    error,
    isLoading,
    handleDelete,
    handleEdit,
    totalNewAmount,
    totalOldAmount,
    handlePrint,
    lastRowRef,
    thStyle,
    tdStyle,
    tdTotalStyle,
  } = useContext(MoiContext);

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
        r.map((f) => `"${String(f || "").replace(/"/g, '""')}"`).join(","),
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

  return (
    <motion.div
      style={{ padding: "10px" }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ✅ Buttons */}
      <motion.div
        style={{ textAlign: "right", margin: "10px 20px" }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
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
          initial={{
            opacity: 0,
            scale: 0.8,
            y: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 150,
            damping: 12,
          }}
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          Download CSV
        </motion.button>
        <motion.button
          onClick={handlePrint}
          style={{
            backgroundColor: "#0275d8",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          initial={{
            opacity: 0,
            scale: 0.8,
            y: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 150,
            damping: 12,
          }}
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          Print Page
        </motion.button>
      </motion.div>

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
      <motion.div
        style={{ overflowX: "auto" }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.table
          width="100%"
          border="1"
          style={{ borderCollapse: "collapse" }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
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
              <motion.tr
                key={item.id}
                ref={index === products.length - 1 ? lastRowRef : null}
                style={{
                  textAlign: "center",
                  backgroundColor: index % 2 === 0 ? "#f7d4e7" : "#e2e2e2",
                }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
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
              </motion.tr>
            ))}
            <motion.tr
              style={{
                backgroundColor: "#d1ecf1",
                fontWeight: "bold",
                textAlign: "center",
              }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}>மொத்தம்</td>
              <td style={tdTotalStyle}>{totalOldAmount}</td>
              <td style={tdTotalStyle}>{totalNewAmount}</td>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}></td>
            </motion.tr>
          </tbody>
        </motion.table>
      </motion.div>

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
    </motion.div>
  );
};
