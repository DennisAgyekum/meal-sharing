import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Meal from "./Meal";
import styles from "./FrontPage.module.css";

function HomePage() {
  const [meals, setMeals] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAllMealsWithAvailability = useCallback(async () => {
    try {
      const mealsResponse = await fetch("http://localhost:5001/all-meals");
      if (!mealsResponse.ok) {
        throw new Error(`HTTP error! Status: ${mealsResponse.status}`);
      }
      const mealsData = await mealsResponse.json();
      setMeals(mealsData.slice(0, 2));

      const availabilityData = {};
      for (const meal of mealsData) {
        const availabilityResponse = await fetch(
          `http://localhost:5001/check-availability/${meal.id}`
        );
        if (availabilityResponse.ok) {
          const { availableReservations } = await availabilityResponse.json();
          availabilityData[meal.id] = availableReservations;
        } else {
          availabilityData[meal.id] = 0;
        }
      }
      setAvailability(availabilityData);
    } catch (error) {
      console.error("Failed to load meals or availability:", error);
      setError("Failed to load meals. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllMealsWithAvailability();
  }, [fetchAllMealsWithAvailability]);

  const handleReservationUpdate = async () => {
    await fetchAllMealsWithAvailability();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

 return (
  <div className={styles["home-container"]}>
    <main className={styles["main-content"]}>
      <div className={styles["header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-text"]}>
            <h1 className={styles["title"]}>Welcome to Meal Sharing</h1>
            <p className={styles["subtitle"]}>
              Experience the taste of exceptional meals crafted with care,
              reserve your table today!
            </p>
          </div>
          <img
            src="https://images.squarespace-cdn.com/content/v1/59bc4b7f017db254b3b5b7f7/1535398797696-I6SPYCUJBE0VCHO5UKY9/4938.jpg"
            alt="Meal Sharing"
            className={styles["header-image"]}
          />
        </div>
      </div>
      <div className={styles["meals-preview"]}>
        <h2 className={styles["featured-meals-title"]}>Featured Meals</h2>
        <div className={styles["meals-grid"]}>
          {meals.map((meal, index) => (
            <Meal
              key={index}
              meal={meal}
              showReviewButton={false}
              showReservationButton={false}
              showDeleteButton={false}
              showUpdateButton={false}
              variant="home"
              availableReservations={availability[meal.id] || 0}
              onReservationUpdate={handleReservationUpdate}
            />
          ))}
        </div>
        <button
          className={styles["explore-btn"]}
          onClick={() => navigate("/all-meals")}
        >
          See All Meals
        </button>
      </div>
    </main>
  </div>
);
}
export default HomePage;
