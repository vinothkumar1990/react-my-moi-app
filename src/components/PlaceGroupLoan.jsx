import React, { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import "./Home.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/LoanAllProvider";
import { PlaceGroupTable } from "./PlaceGroupTable";
export const PlaceGroupLoan = ({ cart, setCart }) => {
  const {

    error,
    isLoading,
    handlePrint,
    grouped_place,
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
      <PlaceGroupTable grouped_place={grouped_place}/>
    </motion.div>
  );
};
