import React from 'react'
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllGroupProvider";
export const GroupFunctionTable = ({ grouped }) => {
    const { handleEdit, thStyle, tdStyle, tdTotalStyle } = useContext(MoiContext);
  return (
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
  )
}
