import React, { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import "./Home.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/LoanAllProvider";

export const AllGroupLoan = ({ cart, setCart }) => {
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
    loanGroup,
    grouped_name,
  } = useContext(MoiContext);

  if (isLoading) {
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
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Print Button (hidden in print) */}
      <motion.div
        style={{ textAlign: "right", margin: "10px" }}
        className="no-print"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
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
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {Object.entries(grouped_name).map(([name, items]) => (
          <motion.div
            key={name}
            style={{
              marginBottom: "30px",
              border: "1px solid #aaa",
              borderRadius: "5px",
              overflow: "hidden",
            }}
            initial={{ x: 100, opacity: 0 }}
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
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {name}
            </motion.div>

            <div style={{ overflowX: "auto" }}>
              <table
                width="100%"
                border="1"
                style={{
                  borderCollapse: "collapse",
                  minWidth: "1200px",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "rgb(243, 125, 125)" }}>
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
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
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
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
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
              </table>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
