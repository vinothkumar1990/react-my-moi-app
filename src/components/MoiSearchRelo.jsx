import React, { useState, useRef, useCallback, memo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Atom } from "react-loading-indicators";
import useData from "./custom-hook/useData";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import EditIcon from "@mui/icons-material/Edit";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const paginationModel = { page: 0, pageSize: 20 };

// -------------------
// INPUT WITH MIC
// -------------------
const SearchInput = memo(
  ({ label, value, setValue, field, onMicClick, stopVoice, listeningField }) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          fullWidth
          label={label}
          value={value}
          onChange={(e) => {
            stopVoice();
            setValue(e.target.value);
          }}
          onFocus={stopVoice}
          size="small"
        />

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onMicClick(field);
          }}
          size="small"
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            height: "40px",
            width: "40px",
          }}
        >
          <motion.div
            animate={{
              scale: listeningField === field ? [1, 1.3, 1] : 1,
            }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <MicIcon
              color={listeningField === field ? "error" : "primary"}
            />
          </motion.div>
        </IconButton>
      </Box>
    );
  }
);

// -------------------
// MAIN COMPONENT
// -------------------
export const MoiSearchRelo = () => {
  const navigate = useNavigate();

  const { products, error, isLoading } = useData(
    "https://maywdxirobbziiuhjttx.supabase.co/rest/v1/mois",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA",
        "Content-Type": "application/json",
      },
    }
  );

  const [statusFilter, setStatusFilter] = useState("all");
  const [nameSearch, setNameSearch] = useState("");
  const [placeSearch, setPlaceSearch] = useState("");
  const [amountFilter, setAmountFilter] = useState(0);
  const [listeningField, setListeningField] = useState(null);

  const recognitionRef = useRef(null);

  // 🎤 VOICE COMMAND AI
  const handleVoiceCommand = (text, field) => {
    const lower = text.toLowerCase();

    // STATUS
    if (
      lower.includes("pending") ||
      lower.includes("நிலுவை") ||
      lower.includes("நிலுவையில்")
    ) {
      setStatusFilter("Pending");
    } else if (
      lower.includes("completed") ||
      lower.includes("நிறைவு") ||
      lower.includes("முடிந்த")
    ) {
      setStatusFilter("Completed");
    }

    // AMOUNT
    const amountMatch = lower.match(/\d+/);
    if (amountMatch && (lower.includes("மேல்") || lower.includes("above"))) {
      setAmountFilter(Number(amountMatch[0]));
    }

    // ✅ ONLY UPDATE CORRECT FIELD
    if (field === "name") {
      setNameSearch(text);
    } else if (field === "place") {
      setPlaceSearch(text);
    }
  };

  // 🎤 START VOICE
  const startVoiceSearch = useCallback((field) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = "ta-IN";
    recognition.start();

    setListeningField(field);
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      // ✅ pass field here
      handleVoiceCommand(text, field);
    };

    recognition.onend = () => setListeningField(null);
  }, []);

  // 🎤 STOP
  const stopVoice = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListeningField(null);
  }, []);

  // LOADING
  if (isLoading) {
    return (
      <Box textAlign="center" mt={5}>
        <Atom color="#32cd32" size="medium" />
      </Box>
    );
  }

  if (error) {
    return <div style={{ textAlign: "center" }}>Error loading data</div>;
  }

  // ROWS
  const rows = (products || []).map((row, index) => ({
    id: row.id || index + 1,
    ...row,
  }));

  // FILTER
  const finalFilteredRows = rows.filter((row) => {
    const name = row.name?.toLowerCase() || "";
    const place = row.place?.toLowerCase() || "";

    const nameQuery = nameSearch.toLowerCase();
    const placeQuery = placeSearch.toLowerCase();

    const matchStatus =
      statusFilter === "all" ||
      row.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchName = !nameQuery || name.includes(nameQuery);
    const matchPlace = !placeQuery || place.includes(placeQuery);

    const matchAmount =
      amountFilter === 0 ||
      Number(row.new_amount || 0) >= amountFilter;

    return matchStatus && matchName && matchPlace && matchAmount;
  });

  const handleEdit = (id) => {
    navigate(`/update_relo/${id}`);
  };

  const columns = [
    { field: "place", headerName: "ஊர்", width: 220 },
    { field: "name", headerName: "பெயர்", width: 260 },
    { field: "old_amount", headerName: "பழைய", width: 120 },
    { field: "new_amount", headerName: "புதிய", width: 120 },
    { field: "given_amount_status", headerName: "தடவை", width: 90 },
    { field: "function_name", headerName: "விழா", width: 220 },
    {
      field: "status",
      headerName: "நிலை",
      width: 150,
      renderCell: (params) => {
        const value = params.value?.toLowerCase();
        return (
          <span
            style={{
              color: value === "pending" ? "orange" : "green",
              fontWeight: "bold",
            }}
          >
            {value === "pending" ? "நிலுவையில்" : "நிறைவு"}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Edit",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<EditIcon />}
          onClick={() => handleEdit(params.row.id)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          p: 2,
        }}
      >
        <SearchInput
          label="பெயர் தேடல்"
          value={nameSearch}
          setValue={setNameSearch}
          field="name"
          onMicClick={startVoiceSearch}
          stopVoice={stopVoice}
          listeningField={listeningField}
        />

        <SearchInput
          label="ஊர் தேடல்"
          value={placeSearch}
          setValue={setPlaceSearch}
          field="place"
          onMicClick={startVoiceSearch}
          stopVoice={stopVoice}
          listeningField={listeningField}
        />

        <FormControl fullWidth>
          <InputLabel>நிலை</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="all">அனைத்தும்</MenuItem>
            <MenuItem value="Pending">நிலுவையில்</MenuItem>
            <MenuItem value="Completed">நிறைவு</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={finalFilteredRows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[20, 50, 100]}
          autoHeight
        />
      </Paper>
    </motion.div>
  );
};