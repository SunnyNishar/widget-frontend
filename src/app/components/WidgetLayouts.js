"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./WidgetLayouts.module.css";
import Image from "next/image";

// Image imports
import layout1 from "../../assets/bluelist.png";
import layout2 from "@/assets/joker.png";
import layout3 from "@/assets/kitchen.png";
import layout4 from "@/assets/light.png";
import layout5 from "@/assets/joker2.png";
import layout6 from "@/assets/movie.png";
import layout7 from "@/assets/joker3.png";
import layout8 from "@/assets/yt.png";
import layout9 from "@/assets/techcrunch.png";
import layout10 from "@/assets/red.png";

const WidgetLayouts = () => {
  const scrollRef = useRef(null);
  const hasCentered = useRef(false);
  const isScrolling = useRef(false);

  const imageSet = [
    layout1,
    layout2,
    layout3,
    layout4,
    layout5,
    layout6,
    layout7,
    layout8,
    layout9,
    layout10,
  ];

  const imageWidth = 320;
  const initialCopies = 3;

  // Initialize images with unique keys to prevent React warnings
  const [images, setImages] = useState(() => {
    const initialImages = Array(initialCopies).fill(imageSet).flat();
    return initialImages.map((img, index) => ({
      src: img,
      id: `initial-${index}`,
      originalIndex: index % imageSet.length,
    }));
  });

  // Center the scroll only on initial mount
  useEffect(() => {
    if (hasCentered.current) return;

    const container = scrollRef.current;
    if (!container) return;

    const centerScroll = () => {
      // Only center if we haven't already and container has content
      if (hasCentered.current || container.children.length === 0) return;

      const middleIdx = Math.floor(container.children.length / 2);
      const middleCard = container.children[middleIdx];

      if (middleCard && middleCard.offsetWidth > 0) {
        const containerCenter = container.offsetWidth / 2;
        const cardCenter = middleCard.offsetLeft + middleCard.offsetWidth / 2;

        // Set scroll position immediately without animation
        container.style.scrollBehavior = "auto";
        container.scrollLeft = cardCenter - containerCenter;

        // Restore smooth scrolling after positioning
        requestAnimationFrame(() => {
          if (container) {
            container.style.scrollBehavior = "smooth";
          }
        });

        hasCentered.current = true;
      }
    };

    // Try to center immediately
    const immediateCenter = () => {
      centerScroll();

      // If immediate centering failed, try again after a short delay
      if (!hasCentered.current) {
        setTimeout(centerScroll, 100);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(immediateCenter);
  }, []); // Empty dependency array - only run once on mount

  // Debounced scroll handler to prevent excessive updates
  const handleScroll = useCallback(() => {
    // Don't handle scroll events during initial centering
    if (!hasCentered.current || isScrolling.current) return;

    isScrolling.current = true;

    requestAnimationFrame(() => {
      const container = scrollRef.current;
      if (!container) {
        isScrolling.current = false;
        return;
      }

      const threshold = 5 * imageWidth;

      // Add images to the right
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - threshold
      ) {
        setImages((prev) => [
          ...prev,
          ...imageSet.map((img, index) => ({
            src: img,
            id: `right-${Date.now()}-${index}`,
            originalIndex: index,
          })),
        ]);
      }

      // Add images to the left
      if (container.scrollLeft <= threshold) {
        const newImages = imageSet.map((img, index) => ({
          src: img,
          id: `left-${Date.now()}-${index}`,
          originalIndex: index,
        }));

        setImages((prev) => [...newImages, ...prev]);

        // Adjust scroll position to maintain visual continuity
        setTimeout(() => {
          if (container) {
            const currentBehavior = container.style.scrollBehavior;
            container.style.scrollBehavior = "auto";
            container.scrollLeft += imageSet.length * imageWidth;
            container.style.scrollBehavior = currentBehavior;
          }
        }, 0);
      }

      isScrolling.current = false;
    });
  }, [imageSet, imageWidth]);

  // Scroll to center a card
  const scrollToCenter = useCallback((dir) => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = Array.from(container.children);
    if (cards.length === 0) return;

    // Find the card closest to the center
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIdx = 0;
    let minDist = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - containerCenter);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });

    // Move left/right
    let newIdx = dir === "left" ? closestIdx - 1 : closestIdx + 1;
    newIdx = Math.max(0, Math.min(newIdx, cards.length - 1));

    const targetCard = cards[newIdx];
    if (targetCard) {
      const cardCenter = targetCard.offsetLeft + targetCard.offsetWidth / 2;
      container.scrollTo({
        left: cardCenter - container.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <section className={styles.widgetLayoutsSection}>
      <div className={styles.header}>
        <h2>Widget Layouts and Templates</h2>
      </div>

      <div className={styles.scrollContainer}>
        <button
          className={`${styles.scrollButton} ${styles.scrollLeft}`}
          onClick={() => scrollToCenter("left")}
          aria-label="Scroll left"
          type="button"
        >
          &#8249;
        </button>

        <div
          className={styles.widgetGrid}
          ref={scrollRef}
          onScroll={handleScroll}
          style={{ scrollBehavior: "smooth" }}
        >
          {images.map((imageObj) => (
            <div key={imageObj.id} className={styles.widgetCard}>
              <Image
                src={imageObj.src}
                alt={`Layout template ${imageObj.originalIndex + 1}`}
                width={300}
                height={200}
                draggable={false}
                priority={false}
                placeholder="blur"
              />
            </div>
          ))}
        </div>

        <button
          className={`${styles.scrollButton} ${styles.scrollRight}`}
          onClick={() => scrollToCenter("right")}
          aria-label="Scroll right"
          type="button"
        >
          &#8250;
        </button>
      </div>
    </section>
  );
};

export default WidgetLayouts;
