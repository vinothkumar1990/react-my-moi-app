import React, { useState, useEffect } from "react";
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";

export const NewRelo = () => {
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

  const [allNames, setAllNames] = useState([]); // full DB list
  const [filtered, setFiltered] = useState([]); // filtered suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------------------------------------
  //   🔥 Supabase
  // ---------------------------------------
  const API_URL = "https://maywdxirobbziiuhjttx.supabase.co/rest/v1/mois";
  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1heXdkeGlyb2JiemlpdWhqdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDQxODgsImV4cCI6MjA3NzEyMDE4OH0.XzwnZInezLXhwmBI29JmcGjmnRCGc35ih1XYBvYrlwA";

  // ---------------------------------------
  //   🔥 Load names for autocomplete
  // ---------------------------------------
  useEffect(() => {
    const loadNames = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        let data = await res.json();

        // 👉 FIX: ensure we always have an array
        if (!Array.isArray(data)) {
          console.error("Expected array but received:", data);
          data = [];
        }

        // Pick unique name + place only
        const uniqueList = data.map((item) => ({
          id: item.id,
          name: item.name,
          place: item.place,
        }));

        setAllNames(uniqueList);
      } catch (err) {
        console.error("Error loading names", err);
        setAllNames([]);
      }
    };

    loadNames();
  }, []);

  // ---------------------------------------
  //   🔥 User typing in NAME field
  // ---------------------------------------
  const handleNameTyping = (e) => {
    const value = e.target.value;

    setNewProduct((prev) => ({ ...prev, name: value }));

    if (!value.trim()) {
      setFiltered([]);
      setShowSuggestions(false);
      return;
    }

    const matches = allNames.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(matches);
    setShowSuggestions(true);
  };

  // ---------------------------------------
  //   🔥 On suggestion click — auto-fill
  // ---------------------------------------
  const selectSuggestion = (item) => {
    setNewProduct((prev) => ({
      ...prev,
      name: item.name,
      place: item.place,
    }));
    setShowSuggestions(false);
  };

  // ---------------------------------------
  //   🔥 Validate
  // ---------------------------------------
  const validate = () => {
    let temp = {};

    if (!newProduct.name.trim()) temp.name = "பெயர் தேவை";
    if (!newProduct.place.trim()) temp.place = "ஊர் தேவை";

    if (!newProduct.function_name.trim())
      temp.function_name = "விழா தேவை";

    if (!newProduct.given_amount_status.trim())
      temp.given_amount_status = "தடவை தேவை";

    if (newProduct.old_amount && isNaN(newProduct.old_amount))
      temp.old_amount = "எண் மட்டும் இருக்க வேண்டும்";

    if (newProduct.new_amount && isNaN(newProduct.new_amount))
      temp.new_amount = "எண் மட்டும் இருக்க வேண்டும்";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ---------------------------------------
  //   🔥 Submit
  // ---------------------------------------
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error("Insert failed");

      Swal.fire({
        icon: "success",
        title: "Created successfully",
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

      setFiltered([]);
    } catch (err) {
      Swal.fire("Error", "Failed to create Moi", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  //   🔥 UI
  // ---------------------------------------
  return (
    <Paper elevation={20} style={paperStyle}>
      <Typography
        variant="h5"
        textAlign="center"
        gutterBottom
        style={{ color: "blue" }}
      >
        புதிய மொய்
      </Typography>

      <Grid component="form" style={{ display: "grid", gap: "20px" }} onSubmit={handleAdd}>

        {/* NAME + AUTO-COMPLETE */}
        <div style={{ position: "relative" }}>
          <TextField
            name="name"
            value={newProduct.name}
            label="பெயர்"
            variant="outlined"
            fullWidth
            required
            onChange={handleNameTyping}
            error={!!errors.name}
            helperText={errors.name}
          />

          {showSuggestions && filtered.length > 0 && (
            <div
              style={{
                position: "absolute",
                background: "#fff",
                width: "100%",
                border: "1px solid #ccc",
                zIndex: 10,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => selectSuggestion(item)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {item.name} — {item.place}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PLACE */}
        <TextField
          name="place"
          value={newProduct.place}
          label="ஊர்"
          variant="outlined"
          fullWidth
          required
          onChange={(e) =>
            setNewProduct((p) => ({ ...p, place: e.target.value }))
          }
          error={!!errors.place}
          helperText={errors.place}
        />

        {/* OLD AMOUNT */}
        <TextField
          name="old_amount"
          value={newProduct.old_amount}
          label="பழைய பணம்"
          variant="outlined"
          fullWidth
          type="number"
          required
          onChange={(e) =>
            setNewProduct((p) => ({ ...p, old_amount: e.target.value }))
          }
          error={!!errors.old_amount}
          helperText={errors.old_amount}
        />

        {/* NEW AMOUNT */}
        <TextField
          name="new_amount"
          value={newProduct.new_amount}
          label="புதிய பணம்"
          variant="outlined"
          fullWidth
          type="number"
          required
          onChange={(e) =>
            setNewProduct((p) => ({ ...p, new_amount: e.target.value }))
          }
          error={!!errors.new_amount}
          helperText={errors.new_amount}
        />

        {/* GIVEN AMOUNT STATUS */}
        <TextField
                  select
                  name="given_amount_status"
                  value={newProduct.given_amount_status}
                  label="தடவை"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      given_amount_status: e.target.value,
                    }))
                  }
                  error={!!errors.given_amount_status}
                  helperText={errors.given_amount_status}
                >
                  <MenuItem value="">-- தடவை தேர்ந்தெடுக்கவும் --</MenuItem>
                  <MenuItem value="0">0</MenuItem>
                  <MenuItem value="I">I</MenuItem>
                  <MenuItem value="II">II</MenuItem>
                  <MenuItem value="III">III</MenuItem>
                  <MenuItem value="IV">IV</MenuItem>
                </TextField>

                {/* ✅ விழா Select Dropdown with validation */}
        <TextField
          select
          name="function_name"
          value={newProduct.function_name}
          label="விழா"
          variant="outlined"
          fullWidth
          required
          onChange={(e) =>
                    setNewProduct((prev) => ({
                      ...prev,
                      function_name: e.target.value,
                    }))
                  }
          error={!!errors.function_name}
          helperText={errors.function_name}
        >
          <MenuItem value="">-- விழா தேர்ந்தெடுக்கவும் --</MenuItem>
          <MenuItem value="வினோத் திருமணம்">வினோத் திருமணம்</MenuItem>
          <MenuItem value="விக்னேஷ் திருமணம்">விக்னேஷ் திருமணம்</MenuItem>
          <MenuItem value="விஜய் திருமணம்">விஜய் திருமணம்</MenuItem>
        </TextField>
          <TextField
                    select
                    name="status"
                    value={newProduct.status}
                    label="மொய் நிலை"
                    variant="outlined"
                    fullWidth
                    disabled
                  >
                    <MenuItem value="Pending">நிலுவையில்</MenuItem>
                    <MenuItem value="Completed">முடிக்கப்பட்டது</MenuItem>
                  </TextField>
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
  );
};
