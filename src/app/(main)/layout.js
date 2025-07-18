import Sidebar from "@/app/components/sidebar";
import "@/app/globals.css";

export default function MainLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
