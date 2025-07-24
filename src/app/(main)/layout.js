"use client";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import Navbar from "@/app/components/Navbar";
import "@/app/globals.css";

export default function MainLayout({ children }) {
  const router = useRouter();

  // Handle category selection from navbar
  const handleCategorySelect = (category) => {
    router.push(`/?feed=${encodeURIComponent(category.rss_url)}`);
  };

  return (
    <>
      <Navbar onCategorySelect={handleCategorySelect} />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </>
  );
}
