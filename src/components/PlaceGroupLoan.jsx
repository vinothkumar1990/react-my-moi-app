import React, { useEffect, useState } from "react";
import data from "../assets/mois.json";
import { Atom } from "react-loading-indicators";
import "./Home.css";
import useData from "./custom-hook/useData"; // ✅ Make sure this path is correct
import { motion } from "framer-motion";

export const PlaceGroupLoan = ({ cart, setCart }) => {
  // Fetch data from Supabase using the custom hook
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
    },
  );

  const [loading, setLoading] = useState(true);
  const [mois, setMois] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMois(data);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Combine Supabase products or fallback to local mois data
  const activeData = products && products.length > 0 ? products : mois;

  // Group by `name`
  const grouped = activeData.reduce((acc, curr) => {
    if (!acc[curr.place]) acc[curr.place] = [];
    acc[curr.place].push(curr);
    return acc;
  }, {});

  const thStyle = {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
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
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <center>
          <Atom color="#32cd32" size="medium" text="" textColor="" />
        </center>
      </div>
    );
  }

  if (error) {
    return (
      <p style={{ color: "red", textAlign: "center" }}>Error loading data.</p>
    );
  }

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Print Button (hidden in print) */}
      <motion.div
        style={{ textAlign: "right", margin: "10px" }}
        className="no-print"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
          onClick={handlePrint}
          style={{
            padding: "10px 20px",
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
          Print Page
        </motion.button>
      </motion.div>

      {/* Table Display Section */}
      <motion.div
        style={{ maxWidth: "100%", width: "100%", padding: "10px" }}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {Object.entries(grouped).map(([name, items]) => (
          <motion.div
            key={name}
            style={{
              marginBottom: "30px",
              border: "1px solid #aaa",
              borderRadius: "5px",
              overflow: "hidden",
            }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              style={{
                backgroundColor: "#0275d8",
                color: "white",
                padding: "10px 15px",
                fontSize: "18px",
              }}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {name}
            </motion.div>

            <motion.div
              style={{ overflowX: "auto" }}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.table
                width="100%"
                border="1"
                style={{
                  borderCollapse: "collapse",
                  minWidth: "1200px",
                  fontSize: "14px",
                }}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f1f1f1" }}>
                    <th style={thStyle}>ஊர்</th>
                    <th style={thStyle}>பழைய பணம்</th>
                    <th style={thStyle}>புதிய பணம்</th>
                    <th style={thStyle}>தடவை</th>
                    <th style={thStyle}>திருமண விழா</th>
                    <th style={thStyle}>நிலை</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, index) => (
                    <motion.tr
                      key={item.id || index}
                      style={{
                        textAlign: "center",
                        backgroundColor:
                          index % 2 === 0 ? "#f7d4e7" : "#e2e2e2",
                      }}
                      initial={{ y: 80, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      <td style={tdStyle}>{item.place}</td>
                      <td style={tdStyle}>{item.old_amount}</td>
                      <td style={tdStyle}>{item.new_amount}</td>
                      <td style={tdStyle}>{item.given_amount_status}</td>
                      <td style={tdStyle}>{item.function_name}</td>
                      <td
                        style={{
                          ...tdStyle,
                          color: item.status === "pending" ? "green" : "red",
                        }}
                      >
                        {item.status === "pending"
                          ? "நிலுவையில் உள்ளது"
                          : "நிறைவு"}
                      </td>
                    </motion.tr>
                  ))}

                  <motion.tr
                    style={{
                      backgroundColor: "#dff0d8",
                      fontWeight: "bold",
                    }}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <td></td>
                    <td></td>
                    <td style={tdTotalStyle}>
                      மொத்தம்:{" "}
                      {items.reduce(
                        (total, item) =>
                          total + parseFloat(item.new_amount || 0),
                        0,
                      )}
                    </td>
                    <td style={tdTotalStyle}></td>
                    <td style={tdTotalStyle}></td>
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

          /* Hide elements not needed in print */
          .slides-section, .no-print, .navbar, .footer {
            display: none !important;
          }

          table {
            width: 100% !important;
            min-width: 100% !important;
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
