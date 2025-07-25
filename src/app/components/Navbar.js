"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./navbar.module.css";
import { SlUser } from "react-icons/sl";
import { jwtDecode } from "jwt-decode";
import { AiOutlineSearch } from "react-icons/ai";
import { LuLogOut } from "react-icons/lu";

export default function Navbar({ onCategorySelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const router = useRouter();

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://localhost/backend/getWidgetCategories.php"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.email) {
          setEmail(decoded.email);
        }
      }
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }
  }, []);

  // Filter categories based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (category) =>
          category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(value.length > 0);
  };

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSearchQuery(category.title);
    setShowDropdown(false);

    // If onCategorySelect prop is provided, use it
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      // Otherwise, navigate to home page with feed URL as query parameter
      router.push(`/?feed=${encodeURIComponent(category.rss_url)}`);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (searchQuery.length > 0) {
      setShowDropdown(true);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close search dropdown
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }

      // Close profile dropdown
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setShowDropdown(false);
  };

  // Handle profile dropdown toggle
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowProfileDropdown(false);
    router.push("/login");
  };

  const getUserInitial = () => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.searchContainer} ref={searchRef}>
        <div className={styles.searchInputWrapper}>
          <AiOutlineSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search Widget Categories (e.g., News, Tech, Food, etc.)"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
          />
          {searchQuery && (
            <button
              className={styles.clearButton}
              onClick={handleClearSearch}
              type="button"
            >
              ×
            </button>
          )}
        </div>

        {/* Dropdown with categories */}
        {showDropdown && (
          <div className={styles.dropdown} ref={dropdownRef}>
            {isLoading ? (
              <div className={styles.loadingItem}>Loading categories...</div>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className={styles.categoryItem}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className={styles.categoryImage}>
                    <img
                      src={category.image}
                      alt={category.title}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                  <div className={styles.categoryInfo}>
                    <div className={styles.categoryTitle}>{category.title}</div>
                    <div className={styles.categoryDescription}>
                      {category.description}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                No categories found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.profileIcon} ref={profileDropdownRef}>
        <div className={styles.userCircle} onClick={toggleProfileDropdown}>
          {getUserInitial()}
        </div>

        {/* Profile Dropdown */}
        {showProfileDropdown && (
          <div className={styles.profileDropdown}>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>{getUserInitial()}</div>
              <div className={styles.profileInfo}>
                <div className={styles.profileName}>User Account</div>
                <div className={styles.profileEmail}>{email}</div>
              </div>
            </div>
            <div className={styles.profileDivider}></div>

            <button
              className={`${styles.profileMenuItem} ${styles.logoutItem}`}
              onClick={handleLogout}
              title="Logout"
            >
              <span className={styles.profileMenuIcon}>
                <LuLogOut />
              </span>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
