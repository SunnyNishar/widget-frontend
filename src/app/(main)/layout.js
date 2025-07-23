import Sidebar from "@/app/components/sidebar";
import Navbar from "@/app/components/Navbar";
import "@/app/globals.css";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </>
  );
}
