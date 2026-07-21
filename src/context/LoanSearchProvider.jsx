import {
  createContext,
  useState,
  useRef,
  useCallback,
  memo,
  useEffect,
  useContext,
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

export const LoanSearchProvider = ({ children }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userFunctionName = loggedInUser?.function_name || "";
  const { products, error, isLoading } = useData(
    "https://maywdxirobbziiuhjttx.supabase.co/rest/v1/loans",
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
  const columns = [
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
  ];
  const rows = (products || []).map((row, index) => ({
    id: row.id || index + 1,
    ...row,
  }));

  const functionFilteredRows = rows;

  const statusFilteredRows =
    statusFilter === "all"
      ? functionFilteredRows
      : functionFilteredRows.filter(
          (r) => (r.status || "").toLowerCase() === statusFilter.toLowerCase(),
        );

  const finalFilteredRows = statusFilteredRows.filter((row) => {
    const name = row.name?.toLowerCase() || "";
    const place = row.place?.toLowerCase() || "";

    const nameQuery = nameSearch.toLowerCase();
    const placeQuery = placeSearch.toLowerCase();

    if (!nameQuery && !placeQuery) return true;
    if (nameQuery && !placeQuery) return name.includes(nameQuery);
    if (!nameQuery && placeQuery) return place.includes(placeQuery);

    return name.includes(nameQuery) && place.includes(placeQuery);
  });
  const totalRecords = finalFilteredRows.length;
  const completedCount = finalFilteredRows.filter(
    (item) =>
      item.status === "Completed" ||
      item.status === "completed" ||
      item.status === "" ||
      item.status == null,
  ).length;
  const pendingCount = finalFilteredRows.filter(
    (item) =>
      item.status === "Pending" ||
      item.status === "" ||
      item.status == null ||
      item.status === "pending",
  ).length;
  const newAmount = finalFilteredRows.reduce(
    (sum, item) => sum + Number(item.new_amount || 0),

    0,
  );

  const oldAmount = finalFilteredRows.reduce(
    (sum, item) => sum + Number(item.old_amount || 0),

    0,
  );
  const totalAmount = newAmount + oldAmount;

  const totalPendingAmount = finalFilteredRows
    .filter((item) => item.status === "Pending" || item.status === "pending")
    .reduce((sum, item) => {
      return sum + Number(item.new_amount || 0);
    }, 0);

  const totalCompletedAmount = finalFilteredRows
    .filter(
      (item) => item.status === "Completed" || item.status === "completed",
    )
    .reduce((sum, item) => {
      return sum + Number(item.new_amount || 0);
    }, 0);

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

  return (
    <MoiContext.Provider
      value={{
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
        startVoiceSearch,
        stopVoice,
      }}
    >
      {children}
    </MoiContext.Provider>
  );
};
