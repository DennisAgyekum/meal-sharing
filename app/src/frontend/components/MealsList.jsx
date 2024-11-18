import React, { useEffect, useState } from "react";
import Meal from "./Meal";
import styles from "./MealsList.module.css";

function MealsList() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5001/all-meals/");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
        setError("Failed to load meals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading meals...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h2 className={styles["meals"]}>Meals</h2>
      <div className={styles["meal-container"]}>
        <div className={styles["meals-grid"]}>
          {meals.length > 0 ? (
            meals.map((meal, id) => <Meal key={id} meal={meal} variant="all-meals"  />)
          ) : (
            <p>No meals available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default MealsList;
