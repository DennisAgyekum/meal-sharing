

import React from "react";
import styles from "./AboutPage.module.css";

function AboutPage() {
  return (
    <div className={styles["about-container"]}>
      <header className={styles["header"]}>
        <h1 className={styles["title"]}>About Meal Sharing</h1>
      </header>

      <main className={styles["content"]}>
        <section className={styles["section"]}>
          <h2>Our Mission</h2>
          <p>
            Meal Sharing connects people around the world through delicious, homemade meals.
            We believe in the power of food to bring people together and create unforgettable experiences.
          </p>
        </section>

        <section className={styles["section"]}>
          <h2>How It Works</h2>
          <p>
            Hosts prepare meals and open their homes to guests, offering a unique dining experience
            and a chance to connect with others. Guests can browse meals, make reservations, and
            enjoy the flavors and cultures of the world, right at the host’s table.
          </p>
        </section>

        <section className={styles["section"]}>
          <h2>Our Story</h2>
          <p>
            Meal Sharing started as a passion project among friends who loved cooking and meeting
            new people. What began as a small gathering has grown into a global community of food
            lovers, cultural explorers, and kindred spirits sharing meals together.
          </p>
        </section>
      </main>

      <footer className={styles["footer"]}>
        <p>&copy; 2023 Meal Sharing. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AboutPage;