// src/components/UpdateBalance.jsx
import React, { useEffect, useState } from "react";
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const UpdateBalance = () => {
  const paperStyle = {
    width: 400,
    margin: "20px auto",
    padding: "20px",
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const [updateProduct, setUpdateProduct] = useState({
    year: "",
    balance_amount: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch existing data
  useEffect(() => {
    let mounted = true;
    axios
      .get(`https://68e3d31b8e14f4523daec9c5.mockapi.io/api/v1/all_mois/${id}`)
      .then((res) => {
        if (!mounted) return;
        // Ensure fields exist on the state object
        setUpdateProduct({
          year: res.data.year ?? "",
          balance_amount: res.data.balance_amount ?? "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (!mounted) return;
        Swal.fire("Error!", "Failed to fetch data.", "error");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Validation function (prevents ReferenceError)
  const validate = () => {
    const newErrors = {};

    // Year: required and 4-digit
    if (!updateProduct.year || String(updateProduct.year).trim() === "") {
      newErrors.year = "Year is required";
    } else if (!/^\d{4}$/.test(String(updateProduct.year).trim())) {
      newErrors.year = "Enter a valid 4-digit year";
    }

    // Balance amount: required and positive number
    if (
      updateProduct.balance_amount === "" ||
      updateProduct.balance_amount === null ||
      updateProduct.balance_amount === undefined
    ) {
      newErrors.balance_amount = "Balance amount is required";
    } else if (Number(updateProduct.balance_amount) <= 0) {
      newErrors.balance_amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleUpdate = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    axios
      .put(
        `https://68e3d31b8e14f4523daec9c5.mockapi.io/api/v1/all_mois/${id}`,
        updateProduct
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "The Balance record was updated successfully.",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          navigate("/kovil/balances");
        });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error!", "Failed to update record.", "error");
      })
      .finally(() => setSaving(false));
  };

  // Show loader while fetching
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress color="success" />
      </div>
    );
  }

  if (!updateProduct) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        No data found.
      </div>
    );
  }

  return (
    <Paper elevation={20} style={paperStyle}>
      <Typography variant="h5" textAlign="center" gutterBottom style={{ color: "blue" }}>
        மீதம்
      </Typography>

      <Grid
        component="form"
        style={{ display: "grid", gap: "20px" }}
        onSubmit={handleUpdate}
      >
        {/* Year */}
        <TextField
          name="year"
          value={updateProduct.year || ""}
          label="ஆண்டு"
          variant="outlined"
          fullWidth
          required
          onChange={handleChange}
          error={!!errors.year}
          helperText={errors.year}
        />

        {/* Balance Amount */}
        <TextField
          name="balance_amount"
          value={updateProduct.balance_amount || ""}
          label="மீத தொகை"
          variant="outlined"
          fullWidth
          required
          type="number"
          onChange={handleChange}
          error={!!errors.balance_amount}
          helperText={errors.balance_amount}
          inputProps={{ step: "0.01" }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} color="inherit" /> : "Save"}
        </Button>
      </Grid>
    </Paper>
  );
};
