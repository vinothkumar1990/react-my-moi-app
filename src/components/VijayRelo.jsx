import React, { useEffect, useState } from "react";
import data from "../assets/vinoth.json";
import { FourSquare } from "react-loading-indicators";
import "./Home.css";
import useData from "./custom-hook/useData"; // Make sure this hook exists
import { motion } from "framer-motion";

export const VijayRelo = () => {
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

  // Use local JSON initially if Supabase not ready
  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredData = data.filter(
        (item) => item.function_name === "விஜய் திருமணம்",
      );
      setMois(filteredData);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // If products fetched successfully, filter only "விஜய் திருமணம்"
  const filteredProducts =
    products?.filter((item) => item.function_name === "விஜய் திருமணம்") || [];

  const grouped = filteredProducts.reduce((acc, curr) => {
    if (!acc[curr.place]) acc[curr.place] = [];
    acc[curr.place].push(curr);
    return acc;
  }, {});

  const thStyle = {
    padding: "6px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
  };
  const tdStyle = {
    padding: "6px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  };
  const tdTotalStyle = {
    padding: "6px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
    color: "#39740c",
    fontWeight: "bold",
  };

  // Export CSV for Vinoth Thirumanam only
  const exportToCSV = () => {
    const headers = [
      "ஊர்",
      "பெயர்",
      "பழைய பணம்",
      "புதிய பணம்",
      "தடவை",
      "திருமண விழா",
    ];
    const rows = filteredProducts.map((item) => [
      item.place,
      item.name,
      item.old_amount,
      item.new_amount,
      item.given_amount_status,
      item.function_name,
    ]);

    const csvContent = [
      "\uFEFF" + headers.join(","),
      ...rows.map((row) =>
        row.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "vinoth_thirumanam_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => window.print();

  if (loading || isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <FourSquare color="#32cd32" size="medium" />
      </div>
    );
  }

  return (
    <motion.div
      className="vinoth-container"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="button-container no-print"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
          className="csv-btn"
          onClick={exportToCSV}
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
          📄 Download CSV
        </motion.button>
        <motion.button
          className="print-btn"
          onClick={handlePrint}
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
          🖨️ Print
        </motion.button>
      </motion.div>

      <motion.div
        className="table-section"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 8,
        }}
      >
        {Object.entries(grouped).map(([place, items]) => (
          <motion.div
            key={place}
            className="place-section"
            initial={{
              y: -40,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
          >
            <motion.div
              className="place-header"
              initial={{
                y: -40,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                duration: 0.6,
                delay: 0.2,
              }}
            >
              {place}
            </motion.div>
            <motion.div
              className="table-wrapper"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.table
                className="vinoth-table"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <thead>
                  <tr>
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
                      key={item.id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f7d4e7" : "#e2e2e2",
                      }}
                      initial={{
                        y: -40,
                        opacity: 0,
                      }}
                      animate={{
                        y: 0,
                        opacity: 1,
                      }}
                      transition={{
                        duration: 0.6,
                        delay: 0.2,
                      }}
                    >
                      <td style={tdStyle}>{item.place}</td>
                      <td style={tdStyle}>{item.name}</td>
                      <td style={tdStyle}>{item.old_amount}</td>
                      <td style={tdStyle}>{item.new_amount}</td>
                      <td style={tdStyle}>{item.given_amount_status}</td>
                      <td style={tdStyle}>{item.function_name}</td>
                    </motion.tr>
                  ))}
                  <motion.tr
                    style={{ backgroundColor: "#dff0d8", fontWeight: "bold" }}
                    initial={{
                      y: -40,
                      opacity: 0,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0.2,
                    }}
                  >
                    <td></td>
                    <td></td>
                    <td style={tdTotalStyle}>
                      மொத்தம் பழைய பணம்:{" "}
                      {items.reduce(
                        (t, i) => t + parseFloat(i.old_amount || 0),
                        0,
                      )}
                    </td>
                    <td style={tdTotalStyle}>
                      மொத்தம் புதிய பணம்:{" "}
                      {items.reduce(
                        (t, i) => t + parseFloat(i.new_amount || 0),
                        0,
                      )}
                    </td>
                    <td></td>
                    <td></td>
                  </motion.tr>
                </tbody>
              </motion.table>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* PRINT STYLES */}
      <style>
        {`
          @media print {
            @page {
              size: landscape;
              margin: 10mm;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background: white;
            }
            .no-print, .navbar, .footer {
              display: none !important;
            }
            table {
              width: 100% !important;
              font-size: 12px !important;
            }
            th, td {
              border: 1px solid #000 !important;
              padding: 8px !important;
              text-align: center !important;
            }
            div {
              overflow: visible !important;
            }
          }
        `}
      </style>
    </motion.div>
  );
};
