import React, { useEffect, useState } from "react";
import data from "../assets/pending.json";
import { BlinkBlur } from "react-loading-indicators";
import useData from "./custom-hook/useData"; // ✅ Make sure this hook file exists
import "./Home.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllGroupProvider";
import { PrintButton } from "./PrintButton";
import { GroupFunctionTable } from "./GroupFunctionTable";

export const CompleteListRelo = () => {
  const { isLoading, grouped_completed_all, products } = useContext(MoiContext);
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <center>
          <BlinkBlur color="#32cd32" size="medium" text="" textColor="" />
        </center>
      </div>
    );
  }

  // ✅ Empty state
  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
        Pending records not found.
      </div>
    );
  }

  // ✅ Table rendering
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <PrintButton />

      <GroupFunctionTable grouped={grouped_completed_all} />
    </motion.div>
  );
};
