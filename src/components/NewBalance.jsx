import React, { useState } from "react";
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";

export const NewBalance = () => {
  const paperStyle = {
    width: 400,
    margin: "20px auto",
    padding: "20px",
  };

  const [newProduct, setNewProduct] = useState({
    year: "",
    balance_amount: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Validation function added here
  const validate = () => {
    const newErrors = {};

    if (!newProduct.year) {
      newErrors.year = "Year is required";
    } else if (!/^\d{4}$/.test(newProduct.year)) {
      newErrors.year = "Enter a valid 4-digit year";
    }

    if (!newProduct.balance_amount) {
      newErrors.balance_amount = "Balance amount is required";
    } else if (Number(newProduct.balance_amount) <= 0) {
      newErrors.balance_amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Handle form submit
  const handleAdd = async (e) => {
    e.preventDefault();

    // ✅ Validate before sending
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await fetch(
        "https://68e3d31b8e14f4523daec9c5.mockapi.io/api/v1/all_mois",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        }
      );

      if (!response.ok) throw new Error("Failed to create record");

      Swal.fire({
        icon: "success",
        title: "Created successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      // Reset form
      setNewProduct({
        year: "",
        balance_amount: "",
      });

      setErrors({});
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Failed to create record.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={20} style={paperStyle}>
      <Typography variant="h5" textAlign="center" gutterBottom style={{ color: "blue" }}>
        புதிய மீதம்
      </Typography>

      <Grid
        component="form"
        style={{ display: "grid", gap: "20px" }}
        onSubmit={handleAdd}
      >
        {/* Year Field */}
        <TextField
          name="year"
          value={newProduct.year}
          label="ஆண்டு"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          error={!!errors.year}
          helperText={errors.year}
        />

        {/* Balance Amount Field */}
        <TextField
          name="balance_amount"
          value={newProduct.balance_amount}
          label="மீத தொகை"
          variant="outlined"
          fullWidth
          type="number"
          onChange={handleChange}
          error={!!errors.balance_amount}
          helperText={errors.balance_amount}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Add"
          )}
        </Button>
      </Grid>
    </Paper>
  );
};
