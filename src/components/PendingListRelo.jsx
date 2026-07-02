import React, { useEffect, useState } from "react";
import data from "../assets/pending.json";
import { BlinkBlur } from "react-loading-indicators";
import useData from "./custom-hook/useData"; // ✅ Make sure this hook file exists
import "./Home.css";
import { motion } from "framer-motion";

export const PendingListRelo = () => {
  const { products, error, isLoading } = useData(
    "https://maywdxirobbziiuhjttx.supabase.co/rest/v1/mois",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA",
        "Content-Type": "application/json",
      },
    },
  );

  const [mois, setMois] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load data from Supabase or fallback JSON
  useEffect(() => {
    if (products && products.length > 0) {
      setMois(products);
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setMois(data);
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [products]);

  // ✅ Filter only pending status
  const pendingMois = mois.filter(
    (item) => item.status && item.status.toLowerCase() === "pending",
  );

  // ✅ Group pending records by function name
  const grouped = pendingMois.reduce((acc, curr) => {
    const key = curr.function_name || "Others";
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  const thStyle = {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
    fontWeight: "bold",
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  };

  const tdTotalStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
    color: "#39740c",
    fontWeight: "bold",
  };

  const handlePrint = () => {
    window.print();
  };

  // ✅ Loading state
  if (loading || isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <center>
          <BlinkBlur color="#32cd32" size="medium" text="" textColor="" />
        </center>
      </div>
    );
  }

  // ✅ Empty state
  if (pendingMois.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
        Pending records not found.
      </div>
    );
  }

  // ✅ Table rendering
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ✅ Print button */}
      <motion.div
        style={{ textAlign: "right", margin: "10px" }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
          onClick={handlePrint}
          style={{
            padding: "8px 15px",
            backgroundColor: "#0275d8",
            color: "white",
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
          🖨 Print
        </motion.button>
      </motion.div>

      <motion.div
        style={{ width: "100%", padding: "10px" }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {Object.entries(grouped).map(([function_name, items]) => (
          <motion.div
            key={function_name}
            style={{
              marginBottom: "30px",
              border: "1px solid #aaa",
              borderRadius: "5px",
              overflow: "hidden",
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              style={{
                backgroundColor: "#0275d8",
                color: "white",
                padding: "10px 15px",
                fontSize: "18px",
              }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {function_name}
            </motion.div>

            <motion.div
              style={{ overflowX: "auto" }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <table
                width="100%"
                border="1"
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  tableLayout: "fixed",
                  minWidth: "1100px", // Ensures all columns fit
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f1f1f1" }}>
                    <th style={thStyle}>ஊர்</th>
                    <th style={thStyle}>பெயர்</th>
                    <th style={thStyle}>பழைய பணம்</th>
                    <th style={thStyle}>புதிய பணம்</th>
                    <th style={thStyle}>தடவை</th>
                    <th style={thStyle}>திருமண விழா</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <motion.tr
                      key={item.id || index}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f7d4e7" : "#e2e2e2",
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
                    </motion.tr>
                  ))}

                  {/* ✅ Total Row */}
                  <motion.tr
                    style={{ backgroundColor: "#dff0d8" }}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <td></td>
                    <td></td>
                    <td style={tdTotalStyle}>
                      மொத்தம் பழைய பணம்:{" "}
                      {items
                        .reduce(
                          (total, item) =>
                            total + parseFloat(item.old_amount || 0),
                          0,
                        )
                        .toFixed(0)}
                    </td>
                    <td style={tdTotalStyle}>
                      மொத்தம் புதிய பணம்:{" "}
                      {items
                        .reduce(
                          (total, item) =>
                            total + parseFloat(item.new_amount || 0),
                          0,
                        )
                        .toFixed(0)}
                    </td>
                    <td style={tdTotalStyle}></td>
                    <td style={tdTotalStyle}></td>
                  </motion.tr>
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* ✅ Print Styles */}
      <style>
        {`
          @media print {
            @page {
              size: landscape;
              margin: 10mm;
            }
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            button {
              display: none !important;
            }
            table {
              width: 100% !important;
              min-width: 100% !important;
              font-size: 11px;
              border-collapse: collapse;
            }
            th, td {
              padding: 4px !important;
              word-wrap: break-word;
            }
            div[style*="overflow-x: auto"] {
              overflow: visible !important;
            }
            .navbar, .footer {
              display: none !important;
            }
          }
        `}
      </style>
    </motion.div>
  );
};
