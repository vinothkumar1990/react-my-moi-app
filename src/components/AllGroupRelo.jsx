import React, { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import "./Home.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllGroupProvider";
import { PrintButton } from "./PrintButton";
import { GroupNameTable } from "./GroupNameTable";

export const AllGroupRelo = ({ cart, setCart }) => {
  const { isLoading, grouped_all, error } = useContext(MoiContext);
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
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <PrintButton />

      <GroupNameTable grouped={grouped_all} />
    </motion.div>
  );
};
