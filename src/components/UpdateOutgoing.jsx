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

export const UpdateOutgoing = () => {
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

  // Fetch existing data
  useEffect(() => {
    axios
      .get(`https://68ea6044f1eeb3f856e7108e.mockapi.io/outgoing/${id}`)
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

  // Handle form submit
  const handleUpdate = (e) => {
    e.preventDefault();
    setSaving(true);

    axios
      .put(
        `https://68ea6044f1eeb3f856e7108e.mockapi.io/outgoing/${id}`,
        updateProduct
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "The Outgoing record was updated successfully.",
          confirmButtonColor: "#3085d6"
        }).then(() => {
          navigate("/kovil/outgoing_list");
        });
      })
      .catch(() => {
        Swal.fire("Error!", "Failed to update record.", "error");
      })
      .finally(() => setSaving(false));
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress color="success" />
      </div>
    );
  }

  // No data case
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
        செலவு
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
          label="செலவு தலைப்பு"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          required
        />

        {/* Amount */}
        <TextField
          name="amount"
          value={updateProduct.amount || ""}
          label="செலவு தொகை"
          variant="outlined"
          fullWidth
          type="number"
          onChange={handleChange}
          required
        />

        {/* Type Dropdown */}
        <TextField
          select
          name="type"
          value={updateProduct.type || ""}
          label="செலவு வகை"
          variant="outlined"
          fullWidth
          required
          onChange={handleChange}
        >
          <MenuItem value="">-- Select Type --</MenuItem>
          <MenuItem value="விளக்கு பூஜை செலவு">விளக்கு பூஜை செலவு</MenuItem>
          <MenuItem value="வீரனார் கோவில் கிடா வெட்டு செலவு">வீரனார் கோவில் கிடா வெட்டு செலவு</MenuItem>
          <MenuItem value="முனி கோவில் கிடா வெட்டு செலவு">முனி கோவில் கிடா வெட்டு செலவு</MenuItem>
          <MenuItem value="உதிர்வா செலவு">உதிர்வா செலவு</MenuItem>
          <MenuItem value="பொது செலவு">பொது செலவு</MenuItem>
          <MenuItem value="-">-</MenuItem>
        </TextField>

        {/* Description Textarea */}
        <TextField
          name="description"
          value={updateProduct.description || ""}
          label="செலவு விளக்கம்"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          onChange={handleChange}
        />

        {/* Save Button */}
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
