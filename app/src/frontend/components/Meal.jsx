import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./meal.module.css";

const Meal = ({
  meal,
  showReservationButton = true,
  showReviewButton = true,
  showDeleteButton = true, 
  showUpdateButton = true, 
  variant = "default",
  availableReservations,
  onMealDeleted,
}) => {
  const navigate = useNavigate();

  const isReservationDisabled = availableReservations <= 0;

  const handleDeleteMeal = async () => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      try {
        const response = await fetch(`http://localhost:5001/meals/${meal.id}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          alert("Meal deleted successfully!");
          if (onMealDeleted) {
            onMealDeleted(meal.id);
          }
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Failed to delete the meal.");
        }
      } catch (error) {
        alert("An error occurred while deleting the meal.");
      }
    }
  };

  const handleUpdateMeal = () => {
    navigate(`/update-meal/${meal.id}`);
  };


  return (
    <div className={`${styles["meal-card"]} ${styles[`meal-card--${variant}`]}`}>
      {meal?.title && (
        <>
          {meal.image_url && <img src={meal.image_url} alt={meal.title} className={styles.mealImage} />}
          <h3 className={styles["meal-title"]}>{meal.title}</h3>
          <p className={styles["meal-description"]}>{meal.description}</p>
          <p className={styles["meal-price"]}>{`Price: kr.${meal.price}`}</p>
          <p className={styles["meal-guest"]}>
            {`Available spots: ${availableReservations ?? meal.max_reservation}`}
          </p>
        </>
      )}
      <div className={styles["meal-btn"]}>
        {showReservationButton && meal?.id && (
          <button
            className={styles["res-btn"]}
            onClick={() => navigate(`/reservations/${meal.id}`)}
            disabled={isReservationDisabled}
            title={isReservationDisabled ? "No spots available for reservation" : "Click to reserve"}
          >
            {isReservationDisabled ? "Fully Booked" : "Make a Reservation"}
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
         {showUpdateButton && meal?.id && (
          <button className={styles["res-btn"]} onClick={handleUpdateMeal}>
            Update Meal
          </button>
        )}
        {showDeleteButton && meal?.id && (
           <button className={`${styles["res-btn"]} ${styles["delete-btn"]}`} onClick={handleDeleteMeal}>
           Delete Meal
         </button>
        )}
       
      </div>
    </div>
  );
};

export default Meal;