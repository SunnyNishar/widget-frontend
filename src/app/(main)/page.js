"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FeedDisplay from "../components/FeedDisplay";
import WidgetForm from "../components/widegtform";
import PageHeader from "../components/pageHeader";
import Footer from "../components/footer";
import WidgetLayouts from "../components/WidgetLayouts";
import { useWidgetStore, useAuthStore } from "@/stores";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editWidgetId = searchParams.get("edit");

  // Get state and actions from Zustand stores
  const {
    // Widget State
    isLoading,
    loadWidgetForEdit,
    loadFeedFromUrl,
  } = useWidgetStore();

  const {
    // Auth State & Actions
    checkAuth,
  } = useAuthStore();

  // Check authentication
  useEffect(() => {
    const isAuth = checkAuth();
    if (!isAuth) {
      router.push("/login");
    }
  }, [router, checkAuth]);

  // Load widget data if in edit mode
  useEffect(() => {
    if (editWidgetId) {
      loadWidgetForEdit(editWidgetId).then((result) => {
        if (!result.success) {
          alert("Failed to load widget data");
          console.error(result.error);
        }
      });
    }
  }, [editWidgetId, loadWidgetForEdit]);

  // Handle RSS feed from URL parameters (from navbar category selection)
  useEffect(() => {
    const rssFromCategory = searchParams.get("feed");

    if (rssFromCategory && !editWidgetId) {
      loadFeedFromUrl(rssFromCategory);
    }
  }, [searchParams, editWidgetId, loadFeedFromUrl]);

  if (isLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>Loading widget...</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <PageHeader />
      <div className={styles.contentWrapper}>
        <div className={styles.formSection}>
          <WidgetForm />
        </div>
        <div className={styles.previewSection}>
          <FeedDisplay />
        </div>
      </div>
      {/* <WidgetLayouts /> */}
      <div className={styles.footer}>
        <Footer />
      </div>
    </main>
  );
}
