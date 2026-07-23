import {
  createContext,
  useState,
  useRef,
  useCallback,
  memo,
  useEffect,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useData from "../components/custom-hook/useData";
import { API_CONFIG } from "../config/config.js";
export const MoiContext = createContext();

export const MoiProvider = ({ children }) => {
  const { products, error, isLoading, setProducts } = useData(
    `${API_CONFIG.BASE_URL}/rest/v1/mois`,
    {
      headers: {
        apikey: API_CONFIG.API_KEY,
        Authorization: `Bearer ${API_CONFIG.API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
  // If products fetched successfully, filter only "வினோத் திருமணம்"
  const filteredProducts =
    products?.filter((item) => item.function_name === "வினோத் திருமணம்") || [];

  const grouped = filteredProducts.reduce((acc, curr) => {
    if (!acc[curr.place]) acc[curr.place] = [];
    acc[curr.place].push(curr);
    return acc;
  }, {});
  // end

  // If products fetched successfully, filter only "விக்னேஷ் திருமணம்"
  const filteredProductsVignesh =
    products?.filter((item) => item.function_name === "விக்னேஷ் திருமணம்") ||
    [];

  const vignesh_grouped = filteredProductsVignesh.reduce((acc, curr) => {
    if (!acc[curr.place]) acc[curr.place] = [];
    acc[curr.place].push(curr);
    return acc;
  }, {});

  // end

  // If products fetched successfully, filter only "விஜய் திருமணம்"
  const filteredProductsVijay =
    products?.filter((item) => item.function_name === "விஜய் திருமணம்") || [];

  const vijay_grouped = filteredProductsVijay.reduce((acc, curr) => {
    if (!acc[curr.place]) acc[curr.place] = [];
    acc[curr.place].push(curr);
    return acc;
  }, {});

  // end

  const groupedProducts = (products || []).reduce((acc, item) => {
    const functionName = item.function_name;
    const place = item.place;

    if (!acc[functionName]) {
      acc[functionName] = {};
    }

    if (!acc[functionName][place]) {
      acc[functionName][place] = [];
    }

    acc[functionName][place].push(item);

    return acc;
  }, {});

  const functionMap = {
    "/vinoth/mois": {
      functionName: "வினோத் திருமணம்",
      fileName: "vinoth_thirumanam_data",
    },
    "/vignesh/mois": {
      functionName: "விக்னேஷ் திருமணம்",
      fileName: "vignesh_thirumanam_data",
    },
    "/vijay/mois": {
      functionName: "விஜய் திருமணம்",
      fileName: "vijay_thirumanam_data",
    },
  };
  const location = useLocation();

  const current = functionMap[location.pathname] || {};

  const functionName = functionMap[location.pathname] || "";

  const thStyle = {
    padding: "6px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
  };
  const tdStyle = {
    padding: "6px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  };
  const tdTotalStyle = {
    padding: "6px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
    color: "#39740c",
    fontWeight: "bold",
  };

  const handlePrint = () => window.print();
  return (
    <MoiContext.Provider
      value={{
        products,
        error,
        isLoading,
        filteredProducts,
        filteredProductsVignesh,
        filteredProductsVijay,
        grouped,
        tdStyle,
        thStyle,
        tdTotalStyle,
        handlePrint,
        vignesh_grouped,
        vijay_grouped,
        groupedProducts,
        functionMap,
        location,
        current,
        functionName,
      }}
    >
      {children}
    </MoiContext.Provider>
  );
};
