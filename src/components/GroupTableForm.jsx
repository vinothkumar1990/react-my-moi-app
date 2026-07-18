import React from "react";
import { motion } from "framer-motion";
import { useContext,memo } from "react";
import { MoiContext } from "../context/MoiProvider";
export const GroupTableForm = ({ grouped }) => {
  const { tdStyle, thStyle, tdTotalStyle } = useContext(MoiContext);
  return (
    <motion.div
      className="table-section"
    >
      {Object.entries(grouped).map(([place, items]) => (
        <div
          key={place}
          style={{
            marginBottom: "30px",
            border: "1px solid #aaa",
            borderRadius: "8px",
            overflow: "hidden",
          }}
          className="place-section"
        >
          <div
            className="place-header"
          >
            {place}
          </div>
          <div className="table-wrapper">
            <table className="vinoth-table">
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
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f7d4e7" : "#e2e2e2",
                    }}
                  >
                    <td style={tdStyle}>{item.place}</td>
                    <td style={tdStyle}>{item.name}</td>
                    <td style={tdStyle}>{item.old_amount}</td>
                    <td style={tdStyle}>{item.new_amount}</td>
                    <td style={tdStyle}>{item.given_amount_status}</td>
                    <td style={tdStyle}>{item.function_name}</td>
                  </tr>
                ))}
                <tr
                  style={{ backgroundColor: "#dff0d8", fontWeight: "bold" }}
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
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </motion.div>
  );
};
export default memo(GroupTableForm);
