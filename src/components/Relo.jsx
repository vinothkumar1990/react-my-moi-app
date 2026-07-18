import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import axios from "axios";
import Swal from "sweetalert2";
import "./Home.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllProvider";
import { ExportPrintButton } from "./ExportPrintButton";
import { AllTable } from "./AllTable";
const MoiRow = lazy(() => import("./MoiRow"));

export const Relo = () => {
  const {
    navigate,
    products,
    error,
    isLoading,
    handleDelete,
    handleEdit,
    functionOrder,
    sortedProducts,
    totalNewAmount,
    totalOldAmount,
    exportToCSV,
    handlePrint,
    lastRowRef,
    thStyle,
    tdStyle,
    tdTotalStyle,
  } = useContext(MoiContext);

  if (isLoading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <OrbitProgress color="#32cd32" size="medium" />
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        ⚠️ Error: {error.message}
      </div>
    );

  return (
    <motion.div
      style={{ padding: "10px" }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ✅ Action Buttons */}
      <ExportPrintButton />

      {/* ✅ Table */}
      <AllTable />
    </motion.div>
  );
};
