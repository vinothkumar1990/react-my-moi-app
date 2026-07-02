import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import useData from "./custom-hook/useData";
import { useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import axios from "axios";
import Swal from "sweetalert2";
import "./Home.css";
import { motion } from "framer-motion";
const MoiRow = lazy(() => import("./MoiRow"));

export const Relo = () => {
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
    <motion.div
      style={{ padding: "10px" }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ✅ Action Buttons */}
      <motion.div
        className="no-print"
        style={{ textAlign: "right", margin: "10px 20px" }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
          onClick={exportToCSV}
          style={{
            backgroundColor: "#d9534f",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
          initial={{
            opacity: 0,
            scale: 0.8,
            y: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 150,
            damping: 12,
          }}
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          Download CSV
        </motion.button>
        <motion.button
          onClick={handlePrint}
          style={{
            backgroundColor: "#0275d8",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          initial={{
            opacity: 0,
            scale: 0.8,
            y: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 150,
            damping: 12,
          }}
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          Print Page
        </motion.button>
      </motion.div>

      {/* ✅ Add New Moi */}
      {/*<article className="no-print" style={{ marginBottom: "20px" }}>
        <span
          style={{
            color: "#163b16ff",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Create New Moi
        </span>
        <button
          onClick={() => navigate("/new/moi")}
          className="btn btn-primary"
          style={{ marginLeft: "10px" }}
        >
          Click me
        </button>
      </article>*/}

      {/* ✅ Table */}
      <motion.div
        style={{ overflowX: "auto" }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 8,
        }}
      >
        <motion.table
          width="100%"
          border="1"
          style={{ borderCollapse: "collapse" }}
          initial={{
            y: -40,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#0275d8" }}>
              <th style={thStyle}>ஊர்</th>
              <th style={thStyle}>பெயர்</th>
              <th style={thStyle}>பழைய பணம்</th>
              <th style={thStyle}>புதிய பணம்</th>
              <th style={thStyle}>தடவை</th>
              <th style={thStyle}>திருமண விழா</th>
              <th className="no-print" style={thStyle}></th>
              <th className="no-print" style={thStyle}></th>
            </tr>
          </thead>
          <motion.tbody
            initial={{
              y: -40,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
          >
            <Suspense fallback={<div>Loading rows...</div>}>
              {sortedProducts.map((item, index) => (
                <MoiRow
                  key={item.id}
                  item={item}
                  index={index}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  rowRef={
                    index === sortedProducts.length - 1 ? lastRowRef : null
                  }
                />
              ))}
            </Suspense>
            <motion.tr
              style={{
                backgroundColor: "#d1ecf1",
                fontWeight: "bold",
                textAlign: "center",
              }}
              initial={{
                y: -40,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                duration: 0.6,
                delay: 0.2,
              }}
            >
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}>மொத்தம்</td>
              <td style={tdTotalStyle}>{totalOldAmount}</td>
              <td style={tdTotalStyle}>{totalNewAmount}</td>
              <td style={tdTotalStyle}></td>
              <td style={tdTotalStyle}></td>
              <td className="no-print" style={tdTotalStyle}></td>
              <td className="no-print" style={tdTotalStyle}></td>
            </motion.tr>
          </motion.tbody>
        </motion.table>
      </motion.div>

      {/* ✅ Print Styles */}
      <style>
        {`
        @media print {
          @page {
            size: landscape;
            margin: 10mm;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }

          .no-print, .navbar, .footer {
            display: none !important;
          }

          table {
            width: 100% !important;
            font-size: 12px !important;
            border-collapse: collapse !important;
          }

          th, td {
            border: 1px solid #000 !important;
            padding: 8px !important;
            text-align: center !important;
          }

          div {
            overflow: visible !important;
          }
        }
      `}
      </style>
    </motion.div>
  );
};
