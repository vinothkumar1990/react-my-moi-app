import {
  createContext,
  useState,
  useRef,
  useCallback,
  memo,
  useEffect,
  useContext,
  useMemo,
} from "react";
import useData from "../components/custom-hook/useData";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
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
import { motion } from "framer-motion";
import SearchInput from "../components/SearchInput";
export const MoiContext = createContext();

export const MoiSearchProvider = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userFunctionName = loggedInUser?.function_name || "";
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
    },
  );

  const [statusFilter, setStatusFilter] = useState("all");
  const [nameSearch, setNameSearch] = useState("");
  const [placeSearch, setPlaceSearch] = useState("");
  const [listeningField, setListeningField] = useState(null);
  const navigate = useNavigate();
  const columns = useMemo(
    () => [
      { field: "place", headerName: "ஊர்", width: 230 },
      { field: "name", headerName: "பெயர்", width: 300 },
      { field: "old_amount", headerName: "பழைய பணம்", width: 150 },
      { field: "new_amount", headerName: "புதிய பணம்", width: 150 },
      { field: "given_amount_status", headerName: "தடவை", width: 90 },
      { field: "function_name", headerName: "திருமண விழா", width: 250 },
      {
        field: "status",
        headerName: "நிலை",
        width: 200,
        renderCell: (params) => (
          <span
            style={{
              color:
                params.value === "Pending" || params.value === "pending"
                  ? "orange"
                  : "green",
              fontWeight: "bold",
            }}
          >
            {params.value === "Pending" || params.value === "pending"
              ? "நிலுவையில் உள்ளது"
              : "நிறைவு"}
          </span>
        ),
      },
      {
        field: "action",
        headerName: "Action",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <IconButton
            color="primary"
            onClick={() => navigate(`/update_relo/${params.id}`)}
          >
            <EditIcon />
          </IconButton>
        ),
      },
    ],
    [navigate],
  );
  const rows = useMemo(() => {
    return (products || []).map((row, index) => ({
      id: row.id || index + 1,
      ...row,
    }));
  }, [products]);

  const functionFilteredRows = rows;

  const statusFilteredRows =
    statusFilter === "all"
      ? functionFilteredRows
      : functionFilteredRows.filter(
          (r) => (r.status || "").toLowerCase() === statusFilter.toLowerCase(),
        );

  const finalFilteredRows = useMemo(() => {
    const nameQuery = nameSearch.trim().toLowerCase();
    const placeQuery = placeSearch.trim().toLowerCase();

    return statusFilteredRows.filter((row) => {
      const rowName = row.name?.toLowerCase() ?? "";
      const rowPlace = row.place?.toLowerCase() ?? "";

      const matchName = !nameQuery || rowName.includes(nameQuery);

      const matchPlace = !placeQuery || rowPlace.includes(placeQuery);

      return matchName && matchPlace;
    });
  }, [statusFilteredRows, nameSearch, placeSearch]);

  const {
    totalRecords,
    completedCount,
    pendingCount,
    newAmount,
    oldAmount,
    totalAmount,
    totalPendingAmount,
    totalCompletedAmount,
  } = useMemo(() => {
    const result = finalFilteredRows.reduce(
      (acc, item) => {
        const status = (item.status || "").toLowerCase();

        const newAmt = Number(item.new_amount || 0);
        const oldAmt = Number(item.old_amount || 0);

        // Total Amounts
        acc.newAmount += newAmt;
        acc.oldAmount += oldAmt;

        // Completed
        if (status === "completed" || status === "") {
          acc.completedCount++;
          acc.totalCompletedAmount += newAmt;
        }

        // Pending
        if (status === "pending" || status === "") {
          acc.pendingCount++;
          acc.totalPendingAmount += newAmt;
        }

        return acc;
      },
      {
        completedCount: 0,
        pendingCount: 0,
        newAmount: 0,
        oldAmount: 0,
        totalPendingAmount: 0,
        totalCompletedAmount: 0,
      },
    );

    return {
      totalRecords: finalFilteredRows.length,
      completedCount: result.completedCount,
      pendingCount: result.pendingCount,
      newAmount: result.newAmount,
      oldAmount: result.oldAmount,
      totalAmount: result.newAmount + result.oldAmount,
      totalPendingAmount: result.totalPendingAmount,
      totalCompletedAmount: result.totalCompletedAmount,
    };
  }, [finalFilteredRows]);

  const recognitionRef = useRef(null);

  // 🎤 START VOICE
  const startVoiceSearch = useCallback((field) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Voice not supported");

    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = "ta-IN";
    recognition.start();

    setListeningField(field);
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      if (field === "name") setNameSearch(text);
      if (field === "place") setPlaceSearch(text);
    };

    recognition.onend = () => setListeningField(null);
  }, []);

  // 🎤 STOP VOICE
  const stopVoice = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListeningField(null);
  }, []);

  const value = useMemo(
    () => ({
      products,

      error,

      isLoading,

      rows,

      functionFilteredRows,

      statusFilteredRows,

      finalFilteredRows,

      nameSearch,

      placeSearch,

      statusFilter,

      setStatusFilter,

      setNameSearch,

      setPlaceSearch,

      columns,

      startVoiceSearch,

      stopVoice,

      listeningField,

      totalRecords,

      completedCount,

      pendingCount,

      newAmount,

      oldAmount,

      totalAmount,

      totalPendingAmount,

      totalCompletedAmount,
    }),
    [
      products,

      error,

      isLoading,

      rows,

      functionFilteredRows,

      statusFilteredRows,

      finalFilteredRows,

      nameSearch,

      placeSearch,

      statusFilter,

      setStatusFilter,

      setNameSearch,

      setPlaceSearch,

      columns,

      startVoiceSearch,

      stopVoice,

      listeningField,

      totalRecords,

      completedCount,

      pendingCount,

      newAmount,

      oldAmount,

      totalAmount,

      totalPendingAmount,

      totalCompletedAmount,
    ],
  );
  return <MoiContext.Provider value={value}>{children}</MoiContext.Provider>;
};
