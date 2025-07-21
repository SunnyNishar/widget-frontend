import React from "react";
import styles from "./pageHeader.module.css";

export default function PageHeader() {
  return (
    <div className={styles.headerWrapper}>
      <h2 className={styles.title}>Feedspot Widgets</h2>
      <h3 className={styles.subtitle}>Embed RSS Widget on your Website</h3>
      <div className={styles.columns}>
        <div className={styles.leftColumn}>
          <p>
            Feedspot Widget is a handy widget which lets you embed and display
            latest updates from your favourite sources (Blogs, News Websites,
            Podcasts, Youtube Channels, RSS Feeds, etc) on your website.{" "}
            <a href="https://youtu.be/ea-ybXtsOCc" target="_blank">
              Watch Video
            </a>
          </p>
        </div>
        <div className={styles.rightColumn}>
          <p>
            Step 1 - Get started by adding your favourite websites to your
            account as content source for widget.{" "}
            <a href="https://youtu.be/ClXq7QRCCmw" target="_blank">
              Watch Video
            </a>
          </p>
          <p>
            Step 2 - Customize the look and feel of the widget to match your
            website style.
          </p>
          <p>
            Step 3 - Click on "Save and Get Code" button, copy the embed code
            and paste on your website.
          </p>
          <p>
            Step 4 - Widget updates automatically when new content is available.
          </p>
        </div>
      </div>
    </div>
  );
}
