import React, { useState, useRef, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Atom } from "react-loading-indicators";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/LoanSearchProvider";
import { LoanFilterContent } from "./LoanFilterContent";
import { LoanFilterSection } from "./LoanFilterSection";
import { LoanFilterTable } from "./LoanFilterTable";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  TextField,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MicIcon from "@mui/icons-material/Mic";

export const LoanSearchRelo = () => {
  const {
    loggedInUser,
    userFunctionName,
    products,
    error,
    isLoading,
    rows,
    functionFilteredRows,
    statusFilteredRows,
    finalFilteredRows,
    name,
    totalRecords,
    completedCount,
    pendingCount,
    newAmount,
    oldAmount,
    totalAmount,
    totalPendingAmount,
    totalCompletedAmount,
    nameSearch,
    placeSearch,
    listeningField,
    setStatusFilter,
    setNameSearch,
    setPlaceSearch,
    setListeningField,
    statusFilter,
    columns,
    SearchInput,
    startVoiceSearch,
    stopVoice,
  } = useContext(MoiContext);
  const paginationModel = { page: 0, pageSize: 20 };

  // LOADING
  if (isLoading) {
    return (
      <Box textAlign="center" mt={5}>
        <Atom color="#32cd32" size="medium" />
      </Box>
    );
  }

  if (error) {
    return <div style={{ color: "red" }}>⚠️ {error.message}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <LoanFilterContent />
      <LoanFilterSection />
      <LoanFilterTable />
    </motion.div>
  );
};
