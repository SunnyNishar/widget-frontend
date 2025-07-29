"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Styles from "./widgetcatalog.module.css";
import { isTokenExpired } from "../../../utils/auth";
import Footer from "../../components/footer";

export default function WidgetCatalogPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const router = useRouter();
  const sessionHandled = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (sessionHandled.current) return;

    if (!token || isTokenExpired(token)) {
      sessionHandled.current = true;
      localStorage.removeItem("token");
      alert("Session Token expired. Please log in again.");
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getWidgetCategories.php`)
      .then((res) => res.json())
      .then((data) => {
        setFeaturedCategories(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setIsLoading(false);
      });
  }, []);

  const handleCategoryClick = (category) => {
    const rssUrl = category.rss_url;
    if (rssUrl) {
      console.log(
        `Navigating to ${category.title} widgets with RSS: ${rssUrl}`
      );
      router.push(`/?feed=${encodeURIComponent(rssUrl)}`);
    } else {
      console.warn("No RSS URL found for this category.");
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  return (
    <>
      <motion.div
        className={Styles.wrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* <Sidebar /> */}
        <div className={Styles.main}>
          <h1 className={Styles.heading}>Widget Catalog</h1>

          {isLoading ? (
            <div className={Styles.loader}>Loading...</div>
          ) : (
            <>
              {/* Featured Categories Grid */}
              <div className={Styles.featuredGrid}>
                <AnimatePresence>
                  {featuredCategories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      className={Styles.categoryCard}
                      onClick={() => handleCategoryClick(category)}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={Styles.categoryImage}>
                        <img src={category.image} alt={category.title} />
                        <div className={Styles.categoryOverlay}>
                          <h3>{category.title}</h3>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <Footer />
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
