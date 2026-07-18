import React, { useEffect, useState } from "react";
import { FourSquare } from "react-loading-indicators";
import "./Home.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiProvider";
import { GroupTableForm } from "./GroupTableForm";

export const GroupTable = () => {
  const {
    isLoading,
    tdStyle,
    thStyle,
    tdTotalStyle,
    handlePrint,
    filteredProducts,
    groupedProducts,
    functionMap,
    location,
    current,
    functionName,
  } = useContext(MoiContext);

  const grouped = groupedProducts[current.functionName] || {};

  const exportToCSV = (functionName, fileName) => {
    const headers = [
      "ஊர்",
      "பெயர்",
      "பழைய பணம்",
      "புதிய பணம்",
      "தடவை",
      "திருமண விழா",
    ];

    // Get all records for the selected function
    const rows = Object.values(groupedProducts[functionName] || {})
      .flat()
      .map((item) => [
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
        row
          .map((field) => `"${String(field ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <FourSquare color="#32cd32" size="medium" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.8,
      }}
      className="vinoth-container"
    >
      <motion.div
        className="button-container no-print"
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
        style={{
          textAlign: "right",
          margin: "10px",
        }}
      >
        <motion.button
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
          className="csv-btn"
          onClick={() => exportToCSV(current.functionName, current.fileName)}
        >
          📄 Download CSV
        </motion.button>

        <motion.button
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
          className="print-btn"
          onClick={handlePrint}
        >
          🖨️ Print
        </motion.button>
      </motion.div>

      <GroupTableForm grouped={grouped} />
    </motion.div>
  );
};
