import { createContext, useMemo, useCallback } from "react";
import useData from "../components/custom-hook/useData";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../config/config.js";
export const MoiContext = createContext();

export const MoiAllGroupProvider = ({ children }) => {
  const navigate = useNavigate();
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

  const handleEdit = useCallback(
    (id) => {
      navigate(`/update_relo/${id}`);
    },
    [navigate],
  );

  const {
    filteredProducts,
    filteredProductsComplete,
    grouped,
    grouped_completed,
    grouped_all,
    grouped_pending_all,
    grouped_completed_all,
  } = useMemo(() => {
    const pending = [];
    const completed = [];

    const pendingGroup = {};
    const completedGroup = {};
    const allGroup = {};

    const pendingFunctionGroup = {};
    const completedFunctionGroup = {};

    (products || []).forEach((item) => {
      // Group All Records
      if (!allGroup[item.name]) {
        allGroup[item.name] = [];
      }
      allGroup[item.name].push(item);

      // Pending Records
      if (item.status === "pending") {
        pending.push(item);

        if (!pendingGroup[item.name]) {
          pendingGroup[item.name] = [];
        }
        pendingGroup[item.name].push(item);

        const key = item.function_name || "Others";

        if (!pendingFunctionGroup[key]) {
          pendingFunctionGroup[key] = [];
        }
        pendingFunctionGroup[key].push(item);
      }

      // Completed Records
      if (item.status === "completed") {
        completed.push(item);

        if (!completedGroup[item.name]) {
          completedGroup[item.name] = [];
        }
        completedGroup[item.name].push(item);

        const key = item.function_name || "Others";

        if (!completedFunctionGroup[key]) {
          completedFunctionGroup[key] = [];
        }
        completedFunctionGroup[key].push(item);
      }
    });

    return {
      filteredProducts: pending,
      filteredProductsComplete: completed,
      grouped: pendingGroup,
      grouped_completed: completedGroup,
      grouped_all: allGroup,
      grouped_pending_all: pendingFunctionGroup,
      grouped_completed_all: completedFunctionGroup,
    };
  }, [products]);

  const thStyle = useMemo(
    () => ({
      padding: "6px",
      borderBottom: "1px solid #ccc",
      textAlign: "center",
    }),
    [],
  );

  const tdStyle = useMemo(
    () => ({
      padding: "6px",
      borderBottom: "1px solid #eee",
      textAlign: "center",
    }),
    [],
  );

  const tdTotalStyle = useMemo(
    () => ({
      padding: "6px",
      borderBottom: "1px solid #eee",
      textAlign: "center",
      color: "#39740c",
      fontWeight: "bold",
    }),
    [],
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const value = useMemo(
    () => ({
      navigate,
      products,
      error,
      isLoading,
      handleEdit,
      filteredProducts,
      grouped,
      handlePrint,
      thStyle,
      tdStyle,
      tdTotalStyle,
      grouped_completed,
      grouped_all,
      grouped_pending_all,
      grouped_completed_all,
    }),
    [
      navigate,
      products,
      error,
      isLoading,
      handleEdit,
      filteredProducts,
      grouped,
      handlePrint,
      thStyle,
      tdStyle,
      tdTotalStyle,
      grouped_completed,
      grouped_all,
      grouped_pending_all,
      grouped_completed_all,
    ],
  );

  return <MoiContext.Provider value={value}>{children}</MoiContext.Provider>;
};
