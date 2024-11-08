import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./meal.module.css";

const Meal = ({ meal, showReservationButton = true, showReviewButton = true, variant = "default" }) => {
  const navigate = useNavigate();

  const imagePath = meal?.title
    ? `/public/images/${meal.title.toLowerCase().replace(/ /g, "_")}.jpg`
    : "";

  return (
    <div className={`${styles["meal-card"]} ${styles[`meal-card--${variant}`]}`}>
      {meal?.title && (
        <>
          <img src={imagePath} alt={meal.title} className={styles["meal-image"]} />
          <h3 className={styles["meal-title"]}>{meal.title}</h3>
          <p className={styles["meal-description"]}>{meal.description}</p>
          <p className={styles["meal-price"]}>{`Price: $${meal.price}`}</p>
        </>
      )}
      <div  className={styles["meal-btn"]}>
      {showReservationButton && meal?.id && (
        <button 
        className={styles["res-btn"]}
          onClick={() => navigate(`/reservations/${meal.id}`)}
        >
          Add a Reservation
        </button>
      )}
      {showReviewButton && meal?.id && (
        <button
        className={styles["res-btn"]}
          onClick={() => navigate(`/reviews/${meal.id}`)}
        >
          Leave a Review
        </button>
      )}
      </div>
    </div>
  );
};

export default Meal;