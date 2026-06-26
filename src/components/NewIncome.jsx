import React, { useState } from 'react';
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  MenuItem
} from "@mui/material";
import Swal from 'sweetalert2';

export const NewIncome = () => {
  const paperStyle = {
    width: 400,
    margin: "20px auto",
    padding: "20px"
  };

  const [newProduct, setNewProduct] = useState({
    name: "",
    amount: "",
    type: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Validation function
  const validate = () => {
    let tempErrors = {};

    if (!newProduct.name.trim()) tempErrors.name = "Name is required";
    if (!newProduct.type.trim()) tempErrors.type = "Please select a type";

    if (newProduct.amount !== "" && isNaN(newProduct.amount))
      tempErrors.amount = "Amount must be a number";
    else if (Number(newProduct.amount) < 0)
      tempErrors.amount = "Amount cannot be negative";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submit
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const response = await fetch("https://68ea6044f1eeb3f856e7108e.mockapi.io/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) throw new Error("Failed to create record");

      Swal.fire({
        icon: "success",
        title: "Created successfully",
        showConfirmButton: false,
        timer: 1500
      });

      // Reset form
      setNewProduct({
        name: "",
        amount: "",
        type: "",
        description: ""
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
        புதிய வரவு
      </Typography>

      <Grid
        component="form"
        style={{ display: "grid", gap: "20px" }}
        onSubmit={handleAdd}
      >
        {/* Name */}
        <TextField
          name="name"
          value={newProduct.name}
          label="வரவு தலைப்பு"
          variant="outlined"
          fullWidth
          required
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />

        {/* Amount */}
        <TextField
          name="amount"
          value={newProduct.amount}
          label="வரவு தொகை"
          variant="outlined"
          required
          fullWidth
          type="number"
          onChange={handleChange}
          error={!!errors.amount}
          helperText={errors.amount}
        />

        {/* Type Dropdown */}
        <TextField
          select
          name="type"
          value={newProduct.type}
          label="வரவு வகை"
          variant="outlined"
          fullWidth
          required
          onChange={handleChange}
          error={!!errors.type}
          helperText={errors.type}
        >
          <MenuItem value="">-- Select Type --</MenuItem>
          <MenuItem value="விளக்கு பூஜை வரவு">விளக்கு பூஜை வரவு</MenuItem>
          <MenuItem value="வீரனார் கோவில் கிடா வெட்டு வரவு">வீரனார் கோவில் கிடா வெட்டு வரவு</MenuItem>
          <MenuItem value="முனி கோவில் கிடா வெட்டு வரவு">முனி கோவில் கிடா வெட்டு வரவு</MenuItem>
          <MenuItem value="உதிர்வா வரவு">உதிர்வா வரவு</MenuItem>
          <MenuItem value="பொது வரவு">பொது வரவு</MenuItem>
          <MenuItem value="-">-</MenuItem>
        </TextField>

        {/* Description Textarea */}
        <TextField
          name="description"
          value={newProduct.description}
          label="வரவு விளக்கம்"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          onChange={handleChange}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add"}
        </Button>
      </Grid>
    </Paper>
  );
};
