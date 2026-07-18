import React, { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllGroupProvider";
import { PrintButton } from "./PrintButton";
import { GroupNameTable } from "./GroupNameTable";

export const CompleteGroupRelo = () => {
  const { isLoading, grouped_completed } = useContext(MoiContext);
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Atom color="#32cd32" size="medium" />
      </div>
    );
  }

  return (
    <motion.div
      className="pending-container"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <PrintButton />

      <GroupNameTable grouped={grouped_completed} />
    </motion.div>
  );
};
