import React from "react";

export const Footer = () => {
  const currentYear = new Date().getFullYear(); // ✅ dynamic year

  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {currentYear} All rights reserved.</p>
      </div>
    </footer>
  );
};