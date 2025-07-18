"use client";

import { motion } from "framer-motion";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { SlUser } from "react-icons/sl";
import Link from "next/link";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [email, setEmail] = useState("");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Check if sidebar has been animated before in this session
    const sidebarAnimated = sessionStorage.getItem("sidebarAnimated");
    if (sidebarAnimated === "true") {
      setHasAnimated(true);
    } else {
      // Mark as animated and store in sessionStorage
      sessionStorage.setItem("sidebarAnimated", "true");
      setHasAnimated(true);
    }
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

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      // Reset animation state on logout so it animates again for new user
      sessionStorage.removeItem("sidebarAnimated");
      router.push("/login");
    }, 1000);
  };

  // Animation variants for menu items only
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  const menuItems = [
    { name: "Feedspot Home", href: "#", clickable: false },
    { name: "Widget Home", href: "/", clickable: true },
    { name: "My Widgets", href: "/mywidgets", clickable: true },
    { name: "Widget Catalog", href: "/widgetcatalog", clickable: true },
    { name: "Support", href: "#", clickable: false },
    { name: "Widget Examples", href: "#", clickable: false },
    { name: "Customers", href: "#", clickable: false },
  ];

  return (
    <div className={styles.sidebar}>
      {/* Title - no animation */}
      <h2>
        <a href="/">Feedspot</a>
      </h2>

      {/* Menu Items - staggered animation */}
      <ul>
        {menuItems.map((item, index) => (
          <motion.li
            key={item.name}
            className={pathname === item.href ? styles.active : ""}
            variants={itemVariants}
            initial={hasAnimated ? false : "hidden"}
            animate="visible"
            transition={{
              delay: hasAnimated ? 0 : index * 0.1,
            }}
          >
            {item.clickable ? (
              <Link href={item.href}>{item.name}</Link>
            ) : (
              <span>{item.name}</span>
            )}
          </motion.li>
        ))}
        {email && (
          <motion.div
            className={styles.userInfo}
            initial={
              hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
            }
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: hasAnimated ? 0 : (menuItems.length - 1) * 0.1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <SlUser width={24} height={24} />
              <span>{email}</span>
            </div>
          </motion.div>
        )}

        {/* Logout Button - appears with the last menu items */}
        <motion.button
          onClick={handleLogout}
          disabled={isLoggingOut}
          type="button"
          className={styles.logoutButton}
          initial={hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: hasAnimated ? 0 : (menuItems.length - 1) * 0.1,
          }}
          title="Logout"
        >
          {isLoggingOut ? (
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <motion.div
                className={styles.spinner}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
              Logging out...
            </span>
          ) : (
            "Logout"
          )}
        </motion.button>
      </ul>
    </div>
  );
}
