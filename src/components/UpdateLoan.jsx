import React, { useEffect, useState } from "react";
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
export const UpdateLoan = () => {
  const paperStyle = {
    width: 400,
    margin: "20px auto",
    padding: "20px",
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const [updateProduct, setUpdateProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Supabase Configuration
  const API_URL = "https://maywdxirobbziiuhjttx.supabase.co/rest/v1/loans";
  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA";

  // ✅ Fetch existing data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}?id=eq.${id}`, {
          headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        });

        if (res.data && res.data.length > 0) {
          setUpdateProduct(res.data[0]);
        } else {
          Swal.fire("Not Found", "No record found for this ID.", "warning");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire("Error!", "Failed to fetch data from Supabase.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle Form Submit (Update Record)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.patch(`${API_URL}?id=eq.${id}`, updateProduct, {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "The Moi record was updated successfully.",
        confirmButtonColor: "#3085d6",
      }).then(() => navigate("/loans"));
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error!", "Failed to update Moi record.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress color="success" />
      </div>
    );
  }

  // ✅ If no data found
  if (!updateProduct) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        No data found.
      </div>
    );
  }

  // ✅ Render Form
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #b1ece4, #d5f5f1, #ffffff)",
        backgroundSize: "400% 400%",
        animation: "gradient 10s ease infinite",
        p: 2,

        "@keyframes gradient": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        elevation={12}
        sx={{
          maxWidth: 500,
          width: "95%",
          margin: "20px auto",
          p: 3,
          borderRadius: 5,
          backgroundColor: "#f5ddeb",
          boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          gutterBottom
          style={{ color: "blue" }}
        >
          மொய்
        </Typography>

        <Grid
          component="form"
          style={{ display: "grid", gap: "20px" }}
          onSubmit={handleUpdate}
        >
          <TextField
            name="place"
            value={updateProduct.place || ""}
            label="ஊர்"
            variant="outlined"
            fullWidth
            onChange={handleChange}
            required
          />

          <TextField
            name="name"
            value={updateProduct.name || ""}
            label="பெயர்"
            variant="outlined"
            fullWidth
            onChange={handleChange}
            required
          />

          <TextField
            name="old_amount"
            value={updateProduct.old_amount || "0"}
            label="பழைய பணம்"
            variant="outlined"
            fullWidth
            type="number"
            onChange={handleChange}
          />

          <TextField
            name="new_amount"
            value={updateProduct.new_amount || "0"}
            label="புதிய பணம்"
            variant="outlined"
            fullWidth
            type="number"
            onChange={handleChange}
          />

          {/* தடவை */}
          <TextField
            select
            name="given_amount_status"
            value={updateProduct.given_amount_status || ""}
            label="தடவை"
            variant="outlined"
            fullWidth
            required
            onChange={handleChange}
          >
            <MenuItem value="">-- தடவை தேர்ந்தெடுக்கவும் --</MenuItem>
            <MenuItem value="0">0</MenuItem>
            <MenuItem value="I">I</MenuItem>
            <MenuItem value="II">II</MenuItem>
            <MenuItem value="III">III</MenuItem>
            <MenuItem value="IV">IV</MenuItem>
          </TextField>

          <TextField
            name="function_name"
            value={updateProduct.function_name || ""}
            label="Function Name"
            variant="outlined"
            fullWidth
            onChange={handleChange}
          />

          {/* மொய் நிலை */}
          <TextField
            select
            name="status"
            value={updateProduct.status || ""}
            label="மொய் நிலை"
            variant="outlined"
            fullWidth
            required
            onChange={handleChange}
          >
            <MenuItem value="">-- நிலை தேர்ந்தெடுக்கவும் --</MenuItem>
            <MenuItem value="Pending">நிலுவையில்</MenuItem>
            <MenuItem value="Completed">முடிக்கப்பட்டது</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </Grid>
      </Paper>
    </Box>
  );
};
