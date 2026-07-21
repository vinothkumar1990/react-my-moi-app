import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  isAuthenticated,
  logoutUser,
  getUserRole,
  getUserInitials,
} from "../utils/auth";
import { Image } from "react-bootstrap";
import "./Header.css";
import logo from "../assets/images/image1.jpg";
export const LoanMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [role, setRole] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [userInitials, setUserInitials] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setRole(getUserRole());
    setUserInitials(getUserInitials());

    const handleUserChange = () => {
      setRole(getUserRole());
      setUserInitials(getUserInitials());
    };

    window.addEventListener("userChanged", handleUserChange);
    window.addEventListener("storage", handleUserChange);

    return () => {
      window.removeEventListener("userChanged", handleUserChange);
      window.removeEventListener("storage", handleUserChange);
    };
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  return (
    <li className={`dropdown ${openDropdown === "loan" ? "active" : ""}`}>
      <span className="dropbtn" onClick={() => toggleDropdown("loan")}>
        செய்த மொய் பட்டியல்
      </span>
      <ul
        className={`dropdown-content ${openDropdown === "loan" ? "show" : ""}`}
      >
        <li>
          <Link to="/new/loan">புதிய மொய்</Link>
        </li>
        <li>
          <Link to="/loans">அனைத்து மொய்</Link>
        </li>
        <li>
          <Link to="/name_group/loans">அனைத்து மொய் பெயர் வரியாக</Link>
        </li>
        <li>
          <Link to="/place_group/loans">அனைத்து மொய் ஊர் வரியாக</Link>
        </li>
        <li>
          <Link to="/loans/mois_search">செய்த மொய் தேடல்</Link>
        </li>
      </ul>
    </li>
  );
};
