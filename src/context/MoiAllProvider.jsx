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

export const MoiAllProvider = ({ children }) => {
  const navigate = useNavigate();
  const { products, error, isLoading, setProducts } = useData(
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

  const lastRowRef = useRef(null);
  // ✅ Scroll to last row when a new record is added
  useEffect(() => {
    if (lastRowRef.current) {
      lastRowRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [products.length]);

  // ✅ Delete record
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
            `https://maywdxirobbziiuhjttx.supabase.co/rest/v1/mois?id=eq.${id}`,
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

  const handleEdit = useCallback(
    (id) => {
      navigate(`/update_relo/${id}`);
    },
    [navigate],
  );

  // ✅ Define Tamil order
  const functionOrder = [
    "வினோத் திருமணம்",
    "விக்னேஷ் திருமணம்",
    "விஜய் திருமணம்",
  ];

  // ✅ Sort by function_name order
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const indexA = functionOrder.indexOf(a.function_name);
      const indexB = functionOrder.indexOf(b.function_name);

      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  }, [products]);

  // ✅ Totals
  const totalOldAmount = useMemo(() => {
    return sortedProducts.reduce(
      (sum, item) => sum + Number(item.old_amount || 0),
      0,
    );
  }, [sortedProducts]);

  const totalNewAmount = useMemo(() => {
    return sortedProducts.reduce(
      (sum, item) => sum + Number(item.new_amount || 0),
      0,
    );
  }, [sortedProducts]);

  // ✅ Export CSV
  const exportToCSV = () => {
    const headers = [
      "ஊர்",
      "பெயர்",
      "பழைய பணம்",
      "புதிய பணம்",
      "தடவை",
      "திருமண விழா",
    ];
    const rows = sortedProducts.map((item) => [
      item.place,
      item.name,
      item.old_amount,
      item.new_amount,
      item.given_amount_status,
      item.function_name,
    ]);
    rows.push([]);
    rows.push(["", "மொத்தம்:", totalOldAmount, totalNewAmount, "", ""]);

    const csvContent = [
      "\uFEFF" + headers.join(","), // UTF-8 BOM
      ...rows.map((r) =>
        r.map((f) => `"${String(f || "").replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "all_moi_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const thStyle = {
      padding: "10px",
      borderBottom: "1px solid #ccc",
      textAlign: "center",
      color: "white",
    };
    const tdStyle = { padding: "10px", borderBottom: "1px solid #eee" };
    const tdTotalStyle = {
      padding: "10px",
      borderBottom: "1px solid #eee",
      textAlign: "center",
      color: "#39740c",
    };

  return (
    <MoiContext.Provider
      value={{
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

      }}
    >
      {children}
    </MoiContext.Provider>
  );
};
