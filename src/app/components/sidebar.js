"use client";

import { motion } from "framer-motion";
import styles from "./sidebar.module.css";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { SlUser } from "react-icons/sl";
import { BsFillPeopleFill } from "react-icons/bs";
import { GrCatalog } from "react-icons/gr";
import {
  FaWrench,
  FaRegLightbulb,
  FaListUl,
  FaHome,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import Link from "next/link";

export default function Sidebar({ collapsed, setCollapsed }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [email, setEmail] = useState("");
  const [hasAnimated, setHasAnimated] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  useEffect(() => {
    const sidebarAnimated = sessionStorage.getItem("sidebarAnimated");
    if (sidebarAnimated === "true") {
      setHasAnimated(true);
    } else {
      sessionStorage.setItem("sidebarAnimated", "true");
      setHasAnimated(true);
    }
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.email) setEmail(decoded.email);
      }
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      sessionStorage.removeItem("sidebarAnimated");
      router.push("/login");
    }, 1000);
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const menuItems = [
    {
      name: "Feedspot Home",
      href: "#",
      icon: <FaHome />,
      clickable: false,
      title: "Feedspot Home",
    },
    {
      name: "Widget Home",
      href: "/",
      icon: <IoExtensionPuzzleOutline />,
      clickable: true,
      title: "Widget Home",
    },
    {
      name: "My Widgets",
      href: "/mywidgets",
      icon: <FaListUl />,
      clickable: true,
      title: "My Widgets",
    },
    {
      name: "Widget Catalog",
      href: "/widgetcatalog",
      icon: <GrCatalog />,
      clickable: true,
      title: "Widget Catalog",
    },
    {
      name: "Support",
      href: "#",
      icon: <FaWrench />,
      clickable: false,
      title: "Support",
    },
    {
      name: "Widget Examples",
      href: "#",
      icon: <FaRegLightbulb />,
      clickable: false,
      title: "Widget Examples",
    },
    {
      name: "Customers",
      href: "#",
      icon: <BsFillPeopleFill />,
      clickable: false,
      title: "Customers",
    },
  ];

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.headerRow}>
        <h2 className={styles.brand}>
          <a href="/">Feedspot</a>
        </h2>
        <button
          onClick={toggleSidebar}
          className={styles.collapseButton}
          title="Toggle sidebar"
        >
          {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
        </button>
      </div>

      <ul>
        {menuItems.map((item, index) => (
          <motion.li
            key={item.name}
            className={pathname === item.href ? styles.active : ""}
            variants={itemVariants}
            initial={hasAnimated ? false : "hidden"}
            animate="visible"
            transition={{ delay: hasAnimated ? 0 : index * 0.1 }}
            title={item.title}
          >
            {item.clickable ? (
              <Link href={item.href} className={styles.menuItemContent}>
                <span className={styles.icon}>{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ) : (
              <div className={styles.menuItemContent}>
                <span className={styles.icon}>{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </div>
            )}
          </motion.li>
        ))}

        {!collapsed && email && (
          <motion.div className={styles.userInfo}>
            <SlUser />
            <span>{email}</span>
          </motion.div>
        )}

        {!collapsed && (
          <motion.button
            onClick={handleLogout}
            disabled={isLoggingOut}
            type="button"
            className={styles.logoutButton}
            initial={
              hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
            }
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: hasAnimated ? 0 : (menuItems.length - 1) * 0.1,
            }}
            title="Logout"
          >
            {isLoggingOut ? (
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <motion.div
                  className={styles.spinner}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Logging out...
              </span>
            ) : (
              "Logout"
            )}
          </motion.button>
        )}
      </ul>
    </div>
  );
}
