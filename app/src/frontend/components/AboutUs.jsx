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
            Meal Sharing connects people through delicious, homemade meals
            crafted by our restaurant. We believe in the power of food to bring
            people together and create unforgettable experiences.
          </p>
        </section>

        <section className={styles["section"]}>
          <h2>How It Works</h2>
          <p>
            Our restaurant prepares fresh, flavorful meals inspired by global
            cuisines and offers them in a warm, inviting setting. Guests can
            browse our menu, make reservations, and enjoy the essence of
            different cultures and flavors—all brought to life by our dedicated
            chefs and team.
          </p>
        </section>

        <section className={styles["section"]}>
          <h2>Our Story</h2>
          <p>
            Meal Sharing began as a simple idea: to unite people over food. What
            started as a small, community-focused dining concept has grown into
            a welcoming restaurant that celebrates culinary diversity, cultural
            exchange, and meaningful connections around the table.
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
