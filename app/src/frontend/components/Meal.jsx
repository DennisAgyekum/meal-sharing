import React from "react";
import styles from "./meal.module.css";

const Meal = ({ meal }) => {

  const imagePath = `/public/images/${meal.title.toLowerCase().replace(/ /g, "_")}.jpg`;

  return (
   
    <div className={styles["meal-card"]}>
      <img src={imagePath} alt={meal.title} className={styles["meal-image"]} />
      <h2 className={styles["meal-id"]}></h2>
      <h3 className={styles["meal-title"]}>{meal.title}</h3>
      <p className={styles["meal-description"]}>{meal.description}</p>
      <p className={styles["meal-price"]}>{`Price: $${meal.price}`}</p>
      <button className={styles["meal-btn"]}>Add a reservation</button>
    </div>
 

  );
};

export default Meal;