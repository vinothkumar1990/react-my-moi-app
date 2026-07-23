import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import data from "../assets/mois.json";
import image1 from "../assets/images/image1.jpg";
import image2 from "../assets/images/image2.jpg";
import image3 from "../assets/images/image3.jpg";
import image4 from "../assets/images/image4.jpg";
import useData from "./custom-hook/useData"; // ✅ Custom data hook
import { API_CONFIG } from "../config/config.js";
const images = [image1, image2, image3, image4];

export const Slides = () => {
  // ✅ Fetch data from Supabase
  const { products, error, isLoading } = useData(
    `${API_CONFIG.BASE_URL}/rest/v1/mois`,
    {
      headers: {
        apikey: API_CONFIG.API_KEY,
        Authorization: `Bearer ${API_CONFIG.API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const [mois, setMois] = useState([]);

  useEffect(() => {
    let list = [];
    if (products && products.length > 0) {
      list = [...products];
    } else {
      list = [...data];
    }

    // ✅ Sort by new_amount (largest first) and take top 5
    const sorted = list
      .filter((item) => item.new_amount)
      .sort((a, b) => Number(b.new_amount || 0) - Number(a.new_amount || 0))
      .slice(0, 5);

    setMois(sorted);
  }, [products]);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h5>Loading slides...</h5>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <Carousel data-bs-theme="dark" interval={2500} fade>
      {mois.map((product, index) => (
        <Carousel.Item key={product.id || index} interval={2500}>
          <div
            style={{
              width: "100%",
              height: "70vh",
              maxHeight: "650px",
              minHeight: "400px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* ✅ Full-width image */}
            <img
              src={images[index % images.length]}
              alt={`Slide ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                transition: "transform 1.2s ease-in-out",
              }}
            />

            {/* ✅ Gradient overlay for text readability */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))",
              }}
            ></div>

            {/* ✅ Caption text block */}
            <Carousel.Caption
              style={{
                position: "absolute",
                bottom: "30px",
                backgroundColor: "rgba(0,0,0,0.45)",
                borderRadius: "10px",
                padding: "12px 20px",
                maxWidth: "80%",
                margin: "auto",
              }}
            >
              <h5
                style={{
                  color: "#1bcabc",
                  fontWeight: "bold",
                  fontSize: "1.6rem",
                }}
              >
                {product.name}
              </h5>
              <p
                style={{
                  color: "#fff",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                }}
              >
                {product.place} — ₹{product.new_amount} -{" "}
                {product.function_name}
              </p>
              {/* ✅ Display Status (Pending / Completed / etc.) */}
            </Carousel.Caption>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};
