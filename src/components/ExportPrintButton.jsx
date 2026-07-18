import React from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllProvider";
export const ExportPrintButton = () => {
  const { exportToCSV, handlePrint } = useContext(MoiContext);
  return (
    <motion.div
      className="no-print"
      style={{ textAlign: "right", margin: "10px 20px" }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.button
        onClick={exportToCSV}
        style={{
          backgroundColor: "#d9534f",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: "10px",
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
        Download CSV
      </motion.button>
      <motion.button
        onClick={handlePrint}
        style={{
          backgroundColor: "#0275d8",
          color: "white",
          padding: "10px 20px",
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
  );
};
