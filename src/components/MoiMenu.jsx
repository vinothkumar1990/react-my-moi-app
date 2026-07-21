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
export const MoiMenu = () => {
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
    <>
      <li className={`dropdown ${openDropdown === "moi" ? "active" : ""}`}>
        <span className="dropbtn" onClick={() => toggleDropdown("moi")}>
          வாங்கிய மொய் பட்டியல்
        </span>
        <ul
          className={`dropdown-content ${openDropdown === "moi" ? "show" : ""}`}
        >
          <li>
            <Link to="/new/moi">புதிய மொய்</Link>
          </li>
          <li>
            <Link to="/all">அனைத்து மொய் பட்டியல்</Link>
          </li>
          <li>
            <Link to="/vinoth/mois">வினோத் திருமணம் மொய்</Link>
          </li>
          <li>
            <Link to="/vignesh/mois">விக்னேஷ் திருமணம் மொய்</Link>
          </li>
          <li>
            <Link to="/vijay/mois">விஜய் திருமணம் மொய்</Link>
          </li>
          <li>
            <Link to="/pending/name_group">
              நிலுவையில் உள்ள மொய் பெயர் வரியாக பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/complete/name_group">
              முடிக்கப்பட்ட மொய் பெயர் வரியாக பட்டியல்
            </Link>
          </li>
          <li>
            <Link to="/all_name_group">அனைத்து மொய் பெயர் வரியாக பட்டியல்</Link>
          </li>
          <li>
            <Link to="/mois_charts">விளக்கப்படங்கள்</Link>
          </li>
        </ul>
      </li>

      <li className={`dropdown ${openDropdown === "status" ? "active" : ""}`}>
        <span className="dropbtn" onClick={() => toggleDropdown("status")}>
          வாங்கிய மொய் நிலை பட்டியல்
        </span>
        <ul
          className={`dropdown-content ${
            openDropdown === "status" ? "show" : ""
          }`}
        >
          <li>
            <Link to="/pending/lists">நிலுவையில் உள்ள மொய் பட்டியல்</Link>
          </li>
          <li>
            <Link to="/completed/lists">முடிக்கப்பட்ட மொய் பட்டியல்</Link>
          </li>
        </ul>
      </li>

      <li>
        <Link to="/mois_search">மொய் தேடல்</Link>
      </li>
    </>
  );
};
