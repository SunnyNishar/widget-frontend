"use client";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import Navbar from "@/app/components/Navbar";
import "@/app/globals.css";
import { useState, useEffect } from "react";

export default function MainLayout({ children }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleCategorySelect = (category) => {
    router.push(`/?feed=${encodeURIComponent(category.rss_url)}`);
  };

  const sidebarWidth = collapsed ? 60 : 250;

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
      }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        style={{
          flex: 1,
        }}
      >
        {/* This wrapper ensures CSS variable applies to children */}
        <div style={{ "--sidebar-width": `${sidebarWidth}px` }}>
          <Navbar onCategorySelect={handleCategorySelect} />
          {children}
        </div>
      </div>
    </div>
  );
}
