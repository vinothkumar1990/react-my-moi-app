import React, { useEffect, useState } from 'react';
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  MenuItem
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export const UpdateIncome = () => {
  const paperStyle = {
    width: 400,
    margin: "20px auto",
    padding: "20px"
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const [updateProduct, setUpdateProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch existing data
  useEffect(() => {
    axios
      .get(`https://68ea6044f1eeb3f856e7108e.mockapi.io/income/${id}`)
      .then((res) => {
        setUpdateProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error!", "Failed to fetch data.", "error");
        setLoading(false);
      });
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };

  // Validation function
  const validate = () => {
    let tempErrors = {};

    if (!updateProduct.name?.trim()) tempErrors.name = "Name is required";
    if (updateProduct.amount !== "" && isNaN(updateProduct.amount))
      tempErrors.amount = "Amount must be a number";
    else if (Number(updateProduct.amount) < 0)
      tempErrors.amount = "Amount cannot be negative";
    if (!updateProduct.type?.trim()) tempErrors.type = "Please select a type";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submit
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    axios
      .put(
        `https://68ea6044f1eeb3f856e7108e.mockapi.io/income/${id}`,
        updateProduct
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "The Income record was updated successfully.",
          confirmButtonColor: "#3085d6"
        }).then(() => {
          navigate("/kovil/income_list");
        });
      })
      .catch(() => {
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
        வரவு
      </Typography>

      <Grid
        component="form"
        style={{ display: "grid", gap: "20px" }}
        onSubmit={handleUpdate}
      >
        {/* Name */}
        <TextField
          name="name"
          value={updateProduct.name || ""}
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
          value={updateProduct.amount || ""}
          label="வரவு தொகை"
          variant="outlined"
          fullWidth
          required
          type="number"
          onChange={handleChange}
          error={!!errors.amount}
          helperText={errors.amount}
        />

        {/* Type Dropdown */}
        <TextField
          select
          name="type"
          value={updateProduct.type || ""}
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
          value={updateProduct.description || ""}
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
          color="success"
          fullWidth
          disabled={saving}
        >
          {saving ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Save"
          )}
        </Button>
      </Grid>
    </Paper>
  );
};
