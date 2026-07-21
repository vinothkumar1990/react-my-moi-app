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
export const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
 

  return (
    <VoiceContext.Provider
      value={{
        SearchInput,
        startVoiceSearch,
        stopVoice,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};
