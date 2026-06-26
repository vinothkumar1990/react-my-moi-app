import React, { memo } from "react";

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

const MoiRow = ({ item, index, handleEdit, handleDelete, rowRef }) => {
  return (
    <tr
      ref={rowRef}
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

      <td className="no-print" style={tdStyle}>
        <button
          onClick={() => handleEdit(item.id)}
          className="btn btn-primary btn-sm"
        >
          Edit
        </button>
      </td>

      <td className="no-print" style={tdStyle}>
        <button
          onClick={() => handleDelete(item.id)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default memo(MoiRow);