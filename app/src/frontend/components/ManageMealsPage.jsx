import React, { useEffect, useState, useCallback } from "react";
import Meal from "./Meal";
import styles from "./MealsList.module.css";

function MealsList() {
  const [meals, setMeals] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMealsWithAvailability = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5001/manage-meals/");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMeals(data);

      const availabilityData = {};
      for (const meal of data) {
        const availabilityResponse = await fetch(`http://localhost:5001/check-availability/${meal.id}`);
        if (availabilityResponse.ok) {
          const { availableReservations } = await availabilityResponse.json();
          availabilityData[meal.id] = availableReservations <= 0 ? 0 : availableReservations;
        } else {
          availabilityData[meal.id] = meal.maxReservations;
        }
      }
      setAvailability(availabilityData);
    } catch (error) {
      console.error("Failed to fetch meals or availability:", error);
      setError("Failed to load meals. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMealsWithAvailability();
  }, [fetchMealsWithAvailability]);

  const handleMealDeleted = (deletedMealId) => {
    setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== deletedMealId));
  };

  if (loading) {
    return <p>Loading meals...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles["meals-grid"]}>
      {meals.length > 0 ? (
        meals.map((meal) => (
          <Meal
            key={meal.id}
            meal={meal}
            availableReservations={availability[meal.id] || 0}
            showDeleteButton={true}
            onMealDeleted={handleMealDeleted}
            showUpdateButton = {true}
            showReviewButton = {false}
            showReservationButton = {false}
          />
        ))
      ) : (
        <p>No meals available.</p>
      )}
    </div>
  );
}

export default MealsList;


