import React, { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { MoiContext } from "../context/MoiAllProvider";
const MoiRow = lazy(() => import("./MoiRow"));
export const AllTable = () => {
  const {
    handleDelete,
    handleEdit,
    functionOrder,
    sortedProducts,
    totalNewAmount,
    totalOldAmount,
    lastRowRef,
    thStyle,
    tdStyle,
    tdTotalStyle,
  } = useContext(MoiContext);
  return (
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
                rowRef={index === sortedProducts.length - 1 ? lastRowRef : null}
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
  );
};
