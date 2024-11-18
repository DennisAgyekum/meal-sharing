import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import FoodLogo from "../../../public/images/FoodLogo.jpg";


function NavBar() {

  return (
    <nav className={styles.navbar}>
      <img src={FoodLogo} alt="Meal Sharing Logo" className={styles.logo} />
      <div className={styles.title}>Meal Sharing</div>
      <ul className={styles.navLinks}>
        <li key="home">
          <Link to="/">Home</Link>
        </li>
        <li key="meals">
          <Link to="/all-meals">Meals</Link>
        </li>
        <li key="about">
          <Link to="/about-us">About Us</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;

