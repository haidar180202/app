import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import {
  MdApps,
  MdCalendarToday,
  MdNotifications,
  MdSearch,
  MdMenu,
  MdDarkMode,
  MdLightMode,
  MdAccountCircle,
  MdClose,
} from "react-icons/md";
import { Link, useNavigate } from "react-router";
import "./style/header.css"; // File CSS terpisah untuk style modular

const Header: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("themeMode");
    return saved === "true";
  });

  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Resize listener with debounce for responsiveness
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
        if (window.innerWidth > 768) {
          setIsMenuOpen(false);
        }
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute("data-bs-theme", darkMode ? "dark" : "light");
    localStorage.setItem("themeMode", darkMode.toString());
  }, [darkMode]);

  // Close Profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        event.target instanceof Node &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileDropdownOpen]);

  // Keyboard accessible toggle menu/profile dropdown
  const onKeyToggle = (event: KeyboardEvent<HTMLButtonElement>, toggleFunc: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFunc();
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    // Insert your logout logic here
    navigate("/auth?page=login");
  };

  return (
    <header className="header d-flex align-items-center justify-content-between px-4 py-3 shadow-sm">
      {/* Left */}
      <div className="d-flex align-items-center gap-3">
        {isMobile && (
          <button
            className="circle-btn"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onKeyDown={(e) => onKeyToggle(e, () => setIsMenuOpen((prev) => !prev))}
          >
            {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        )}
        <Link to="/home" className="logo-link" aria-label="Go to home">
          MyApp
        </Link>
      </div>

      {/* Center: Search Bar */}
      {!isMobile && (
        <div className="search-container position-relative flex-grow-1 mx-4" style={{ maxWidth: 600 }}>
          <input
            type="search"
            className="form-control rounded-pill ps-4 pe-5 search-input"
            placeholder="Search..."
            aria-label="Search"
          />
          <MdSearch className="search-icon" size={20} aria-hidden="true" />
        </div>
      )}

      {/* Right: Icons and Profile */}
      <nav className="d-flex align-items-center gap-3">
        {!isMobile && (<><button className="circle-btn" title="Modules" aria-label="Modules">
          <MdApps size={24} />
        </button>

          <Link to="/event-calendar" title="Event Calendar" className="circle-btn" aria-label="Event Calendar">
            <MdCalendarToday size={24} />
          </Link></>)}

        <button className="circle-btn position-relative" title="Notifications" aria-label="Notifications">
          <MdNotifications size={24} />
          <span className="notification-badge" aria-live="polite" aria-atomic="true">5</span>
        </button>

        <button
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-pressed={darkMode}
          className="circle-btn"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </button>

        {/* Profile Dropdown */}
        <div className="profile-dropdown-wrapper position-relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
            className=" btn-light profile-btn d-flex align-items-center gap-2 rounded-pill shadow-sm"
            aria-expanded={isProfileDropdownOpen}
            aria-haspopup="true"
            aria-label="User profile menu"
            onKeyDown={(e) => onKeyToggle(e, () => setIsProfileDropdownOpen((prev) => !prev))}
          >
            <MdAccountCircle size={28} />
            <span className="d-none d-md-inline fw-semibold">Hi, User</span>
          </button>
          {isProfileDropdownOpen && (
            <div
              className="dropdown-menu show position-absolute end-0 mt-2 py-2 bg-white border rounded shadow"
              style={{ minWidth: 180, zIndex: 1050 }}
              role="menu"
            >
              <button
                className="dropdown-item"
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  navigate("/profile");
                }}
              >
                Profile
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      {isMobile && (
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`} role="menu" aria-label="Mobile menu">
          <nav className="d-flex flex-column p-3">
            <Link to="/modules" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
              Modules
            </Link>
            <Link to="/event-calendar" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
              Event Calendar
            </Link>
            <Link to="/profile" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>
              Profile
            </Link>
            <button className="mobile-menu-item btn-logout" onClick={() => { setIsMenuOpen(false); handleLogout(); }}>
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
