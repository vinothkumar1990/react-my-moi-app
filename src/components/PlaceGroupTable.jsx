import React from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/LoanAllProvider";
export const PlaceGroupTable = ({ grouped_place }) => {
  const { thStyle, tdStyle, tdTotalStyle } = useContext(MoiContext);

  return (
    <motion.div
      style={{ maxWidth: "100%", width: "100%", padding: "10px" }}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {Object.entries(grouped_place).map(([name, items]) => (
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
                  <tr
                    key={item.id || index}
                    style={{
                      textAlign: "center",
                      backgroundColor: index % 2 === 0 ? "#f7d4e7" : "#e2e2e2",
                    }}
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
                  </tr>
                ))}

                <tr
                  style={{
                    backgroundColor: "#dff0d8",
                    fontWeight: "bold",
                  }}
                >
                  <td></td>
                  <td></td>
                  <td style={tdTotalStyle}>
                    மொத்தம்:{" "}
                    {items.reduce(
                      (total, item) => total + parseFloat(item.new_amount || 0),
                      0,
                    )}
                  </td>
                  <td style={tdTotalStyle}></td>
                  <td style={tdTotalStyle}></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};
