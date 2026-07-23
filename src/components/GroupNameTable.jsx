import React from "react";
import { motion } from "framer-motion";
import { useContext, memo } from "react";
import { MoiContext } from "../context/MoiAllGroupProvider";
export const GroupNameTable = ({ grouped }) => {
  const { handleEdit, thStyle, tdStyle, tdTotalStyle } = useContext(MoiContext);
  return (
    <div style={{ width: "100%", padding: "10px" }}>
      {Object.entries(grouped).map(([name, items]) => (
        <motion.div
          key={name}
          style={{
            marginBottom: "20px",
            border: "1px solid #aaa",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: "#0275d8",
              color: "white",
              padding: "10px 15px",
              fontSize: "18px",
            }}
          >
            {name}
          </div>

          <div
            style={{
              width: "100%",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <table
              border="1"
              style={{
                borderCollapse: "collapse",
                width: "100%",
                minWidth: "900px",
                tableLayout: "auto",
                whiteSpace: "nowrap",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f1f1f1" }}>
                  <th style={thStyle}>ஊர்</th>
                  <th style={thStyle}>பழைய பணம்</th>
                  <th style={thStyle}>புதிய பணம்</th>
                  <th style={thStyle}>தடவை</th>
                  <th style={thStyle}>திருமண விழா</th>
                  <th style={thStyle}>நிலை</th>
                  <th className="no-print" style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id || index}
                    style={{
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
                        fontWeight: "bold",
                      }}
                    >
                      {item.status === "pending"
                        ? "நிலுவையில் உள்ளது"
                        : "நிறைவு"}
                    </td>
                    <td className="no-print" style={tdStyle}>
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="btn btn-primary btn-sm"
                        style={{ marginRight: "5px" }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
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
                    {items
                      .reduce(
                        (total, item) =>
                          total + parseFloat(item.new_amount || 0),
                        0,
                      )
                      .toLocaleString("ta-IN")}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="no-print"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
export default memo(GroupNameTable);
