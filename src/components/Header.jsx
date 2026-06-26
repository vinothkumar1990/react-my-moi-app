// src/components/Header.js
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

export const Header = () => {
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
    <div className="navbar">
      <div className="logo">
        <Image src={logo} alt="logo" width="125" height="40" roundedCircle />
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {/* Admin Menus */}
        {role === "admin" && (
          <>
            <li>
              <Link to="/">முகப்பு</Link>
            </li>

            {/* Moi List */}
            <li className={`dropdown ${openDropdown === "moi" ? "active" : ""}`}>
              <span className="dropbtn" onClick={() => toggleDropdown("moi")}>
                வாங்கிய மொய் பட்டியல்
              </span>
              <ul
                className={`dropdown-content ${
                  openDropdown === "moi" ? "show" : ""
                }`}
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
                  <Link to="/pending/name_group">நிலுவையில் உள்ள மொய் பெயர் வரியாக பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/complete/name_group">முடிக்கப்பட்ட மொய் பெயர் வரியாக பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/all_name_group">அனைத்து மொய் பெயர் வரியாக பட்டியல்</Link>
                </li>
                <li>
                  <Link to="/mois_charts">விளக்கப்படங்கள்</Link>
                </li>
              </ul>
            </li>

            {/* Moi Status List */}
            <li
              className={`dropdown ${
                openDropdown === "status" ? "active" : ""
              }`}
            >
              <span
                className="dropbtn"
                onClick={() => toggleDropdown("status")}
              >
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

            {/* ✅ Fixed Loan List Dropdown */}
            <li className={`dropdown ${openDropdown === "loan" ? "active" : ""}`}>
              <span className="dropbtn" onClick={() => toggleDropdown("loan")}>
                செய்த மொய் பட்டியல்
              </span>
              <ul
                className={`dropdown-content ${
                  openDropdown === "loan" ? "show" : ""
                }`}
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
              </ul>
            </li>
          </>
        )}

        {/* Customer Menus */}
        {role === "customer" && (
          <li
            className={`dropdown ${
              openDropdown === "kovil" ? "active" : ""
            }`}
          >
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
        )}

        {/* User initials + Logout */}
        {isAuthenticated() ? (
          <li className="user-menu">
            <div
              className="user-initials"
              onClick={() => setShowLogout(!showLogout)}
            >
              {userInitials || "U"}
            </div>
            {showLogout && (
              <div className="logout-dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </div>
  );
};
