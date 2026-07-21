
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
import { LoanMenu } from "./LoanMenu";
import { MoiMenu } from "./MoiMenu";
import { CustomerMenu } from "./CustomerMenu";

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

            <MoiMenu />
            <LoanMenu />
          </>
        )}

        {/* Customer Menus */}
        {role === "customer" && <CustomerMenu />}

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
