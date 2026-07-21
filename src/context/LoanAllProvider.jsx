import {
  createContext,
  useState,
  useRef,
  useCallback,
  memo,
  useEffect,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useData from "../components/custom-hook/useData";

export const MoiContext = createContext();

export const LoanAllProvider = ({ children }) => {
  const navigate = useNavigate();
  const { products, error, isLoading, setProducts } = useData(
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

  const lastRowRef = useRef(null);

  // ✅ Scroll to last row when a new record is added
  useEffect(() => {
    if (lastRowRef.current) {
      lastRowRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [products.length]);

  // ✅ Delete Function
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://maywdxirobbziiuhjttx.supabase.co/rest/v1/loans?id=eq.${id}`,
            {
              headers: {
                apikey:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA",
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA",
                "Content-Type": "application/json",
              },
            },
          )
          .then(() => {
            const newProductList = products.filter((p) => p.id !== id);
            setProducts(newProductList);
            Swal.fire("Deleted!", "Your record has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Delete error:", error);
            Swal.fire(
              "Error!",
              "Something went wrong while deleting.",
              "error",
            );
          });
      }
    });
  };

  // ✅ Edit Function
  const handleEdit = useCallback(
    (id) => {
      navigate(`/update_loan/${id}`);
    },
    [navigate],
  );

  const { totalOldAmount, totalNewAmount } = useMemo(() => {
    return products.reduce(
      (acc, item) => {
        acc.totalOldAmount += Number(item.old_amount || 0);
        acc.totalNewAmount += Number(item.new_amount || 0);
        return acc;
      },
      {
        totalOldAmount: 0,
        totalNewAmount: 0,
      },
    );
  }, [products]);

  const loanGroup = useMemo(() => {
    return products ?? [];
  }, [products]);

  const { grouped_name, grouped_place } = useMemo(() => {
    const grouped_name = {};
    const grouped_place = {};

    loanGroup.forEach((item) => {
      if (!grouped_name[item.name]) {
        grouped_name[item.name] = [];
      }

      grouped_name[item.name].push(item);

      if (!grouped_place[item.place]) {
        grouped_place[item.place] = [];
      }

      grouped_place[item.place].push(item);
    });

    return {
      grouped_name,
      grouped_place,
    };
  }, [loanGroup]);

  const thStyle = useMemo(
    () => ({
      padding: "10px",
      borderBottom: "1px solid #ccc",
      textAlign: "center",
      color: "white",
    }),
    [],
  );

  const tdStyle = useMemo(
    () => ({
      padding: "10px",
      borderBottom: "1px solid #eee",
    }),
    [],
  );
  const tdTotalStyle = useMemo(
    () => ({
      padding: "10px",
      borderBottom: "1px solid #eee",
      textAlign: "center",
      color: "#39740c",
    }),
    [],
  );

  // ✅ Print
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const contextValue = useMemo(
    () => ({
      navigate,
      products,
      error,
      isLoading,
      handleDelete,
      handleEdit,
      totalNewAmount,
      totalOldAmount,
      handlePrint,
      lastRowRef,
      thStyle,
      tdStyle,
      tdTotalStyle,
      loanGroup,
      grouped_name,
      grouped_place,
    }),
    [
      navigate,
      products,
      error,
      isLoading,
      handleDelete,
      handleEdit,
      totalNewAmount,
      totalOldAmount,
      handlePrint,
      lastRowRef,
      thStyle,
      tdStyle,
      tdTotalStyle,
      loanGroup,
      grouped_name,
      grouped_place,
    ],
  );

  return (
    <MoiContext.Provider value={contextValue}>{children}</MoiContext.Provider>
  );
};
