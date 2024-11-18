import React from "react";
import styles from "./footer.module.css";

function Footer() {
  return (
    <div className={styles.footerContainer}>
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Meal Sharing. All rights reserved.</p>
      <ul className={styles.footerLinks}>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/contact">Contact Us</a></li>
      </ul>
    </footer>
    </div>
  );
}

export default Footer;