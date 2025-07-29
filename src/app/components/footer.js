import { motion, AnimatePresence } from "framer-motion";
import Styles from "./footer.module.css";
const allCategories = [
  "Adventure",
  "Architecture",
  "Art",
  "Automobile",
  "Aviation",
  "Baking",
  "Book Reviews",
  "Business",
  "Christian",
  "Cyber Security",
  "DIY",
  "Dogs",
  "Fashion",
  "Fitness",
  "Gardening",
  "Happiness",
  "Health",
  "Healthy Lifestyle",
  "Insurance",
  "Knitting",
  "Leadership",
  "Legal Law",
  "Life",
  "Lifestyle",
];
export default function Footer() {
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  return (
    <div className={Styles.browseSection}>
      <h2>Browse Widgets By Categories</h2>
      <div className={Styles.categoriesList}>
        <AnimatePresence>
          {allCategories.map((category, index) => (
            <motion.div
              key={index}
              className={Styles.categoryItem}
              onClick={() => alert("This category has no RSS feed yet.")}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className={Styles.categoryIcon}>📁</span>
              <span className={Styles.categoryName}>{category}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
