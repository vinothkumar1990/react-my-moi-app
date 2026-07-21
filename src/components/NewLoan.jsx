import React, { useState, useEffect } from "react";
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
import Swal from "sweetalert2";
import { motion } from "framer-motion";
export const NewLoan = () => {
  const paperStyle = {
    width: 400,
    margin: "20px auto",
    padding: "20px",
  };

  const [newProduct, setNewProduct] = useState({
    name: "",
    place: "",
    old_amount: "",
    new_amount: "",
    given_amount_status: "",
    function_name: "",
    status: "Pending",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔍 For auto-complete
  const [nameQuery, setNameQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);

  // Supabase Config
  const BASE_URL = "https://maywdxirobbziiuhjttx.supabase.co/rest/v1";
  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA";

  const LOAN_URL = `${BASE_URL}/loans`;
  const MOI_URL = `${BASE_URL}/mois`;

  // 🔍 Fetch matching names for auto-complete
  useEffect(() => {
    const fetchNames = async () => {
      if (nameQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setSuggestLoading(true);

      try {
        const response = await fetch(
          `${MOI_URL}?name=ilike.*${nameQuery}*&select=name,place`,
          {
            headers: {
              apikey: API_KEY,
              Authorization: `Bearer ${API_KEY}`,
            },
          },
        );

        const data = await response.json();
        setSuggestions(data || []);
      } catch (error) {
        console.error("Name Suggestion Error:", error);
      }

      setSuggestLoading(false);
    };

    const timer = setTimeout(fetchNames, 300);
    return () => clearTimeout(timer);
  }, [nameQuery]);

  // On typing name
  const handleNameChange = (e) => {
    const value = e.target.value;
    setNameQuery(value);
    setNewProduct({ ...newProduct, name: value });
  };

  // Selecting suggestion
  const selectSuggestion = (item) => {
    setNewProduct({
      ...newProduct,
      name: item.name,
      place: item.place,
    });
    setNameQuery(item.name);
    setSuggestions([]);
  };

  // Normal input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Validation
  const validate = () => {
    let tempErrors = {};

    if (!newProduct.name.trim()) tempErrors.name = "Name is required";
    if (!newProduct.place.trim()) tempErrors.place = "Place is required";

    if (!newProduct.old_amount) tempErrors.old_amount = "Required";
    else if (isNaN(newProduct.old_amount))
      tempErrors.old_amount = "Must be number";

    if (!newProduct.new_amount) tempErrors.new_amount = "Required";
    else if (isNaN(newProduct.new_amount))
      tempErrors.new_amount = "Must be number";

    if (!newProduct.given_amount_status.trim())
      tempErrors.given_amount_status = "Required";

    if (!newProduct.function_name.trim()) tempErrors.function_name = "Required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submit handler
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const payload = {
      ...newProduct,
      old_amount: Number(newProduct.old_amount),
      new_amount: Number(newProduct.new_amount),
    };

    try {
      const response = await fetch(LOAN_URL, {
        method: "POST",
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed");

      Swal.fire({
        icon: "success",
        title: "Created Successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      setNewProduct({
        name: "",
        place: "",
        old_amount: "",
        new_amount: "",
        given_amount_status: "",
        function_name: "",
        status: "Pending",
      });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

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
          புதிய மொய்
        </Typography>

        <Grid
          component="form"
          onSubmit={handleAdd}
          style={{ display: "grid", gap: "20px" }}
        >
          {/* 🔍 Auto-complete name field */}
          <div style={{ position: "relative" }}>
            <TextField
              name="name"
              value={newProduct.name}
              label="பெயர்"
              variant="outlined"
              fullWidth
              required
              onChange={handleNameChange}
              error={!!errors.name}
              helperText={errors.name}
            />

            {/* Suggestions box */}
            {suggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "68px",
                  width: "100%",
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  zIndex: 1000,
                  maxHeight: "180px",
                  overflowY: "auto",
                }}
              >
                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => selectSuggestion(item)}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {item.name} —{" "}
                    <span style={{ color: "green" }}>{item.place}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <TextField
            name="place"
            value={newProduct.place}
            label="ஊர்"
            variant="outlined"
            fullWidth
            required
            onChange={handleChange}
            error={!!errors.place}
            helperText={errors.place}
          />

          <TextField
            name="old_amount"
            value={newProduct.old_amount}
            label="பழைய பணம்"
            variant="outlined"
            fullWidth
            type="number"
            onChange={handleChange}
            error={!!errors.old_amount}
            helperText={errors.old_amount}
          />

          <TextField
            name="new_amount"
            value={newProduct.new_amount}
            label="புதிய பணம்"
            variant="outlined"
            fullWidth
            type="number"
            onChange={handleChange}
            error={!!errors.new_amount}
            helperText={errors.new_amount}
          />

          {/* தடவை */}
          <TextField
            select
            name="given_amount_status"
            value={newProduct.given_amount_status}
            label="தடவை"
            variant="outlined"
            fullWidth
            onChange={handleChange}
            error={!!errors.given_amount_status}
            helperText={errors.given_amount_status}
          >
            <MenuItem value="">-- Select --</MenuItem>
            <MenuItem value="0">0</MenuItem>
            <MenuItem value="I">I</MenuItem>
            <MenuItem value="II">II</MenuItem>
            <MenuItem value="III">III</MenuItem>
            <MenuItem value="IV">IV</MenuItem>
          </TextField>

          <TextField
            name="function_name"
            value={newProduct.function_name}
            label="விழா"
            variant="outlined"
            fullWidth
            onChange={handleChange}
            error={!!errors.function_name}
            helperText={errors.function_name}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </Grid>
      </Paper>
    </Box>
  );
};
