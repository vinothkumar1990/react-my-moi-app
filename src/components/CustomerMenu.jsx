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
export const CustomerMenu = () => {
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
      <li className={`dropdown ${openDropdown === "kovil" ? "active" : ""}`}>
        <span className="dropbtn" onClick={() => toggleDropdown("kovil")}>
          கோவில் வரவு செலவு
        </span>
        <ul
          className={`dropdown-content ${
            openDropdown === "kovil" ? "show" : ""
          }`}
        >
          <li>
            <Link to="/newIncome">புதிய வரவு</Link>
          </li>
          <li>
            <Link to="/newOutgoing">புதிய செலவு</Link>
          </li>
          <li>
            <Link to="/kovil/income_list">மொத்த வரவு பட்டியல்</Link>
          </li>
          <li>
            <Link to="/kovil/outgoing_list">மொத்த செலவு பட்டியல்</Link>
          </li>
          <li>
            <Link to="/kovil/summary">மொத்த வரவு செலவு பட்டியல்</Link>
          </li>
          <li>
            <Link to="/kovil/income_group">வரவு வகை பட்டியல்</Link>
          </li>
          <li>
            <Link to="/kovil/outgoing_group">செலவு வகை பட்டியல்</Link>
          </li>
          <li>
            <Link to="/kovil/balances">கடந்த வருட மீதம் பட்டியல்</Link>
          </li>
        </ul>
      </li>
    </>
  );
};
