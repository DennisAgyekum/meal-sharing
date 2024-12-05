import React, { useEffect, useState, useCallback } from "react";
import Meal from "./Meal";
import styles from "./MealsList.module.css";

function MealsList() {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [availability, setAvailability] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchMealsWithAvailability = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5001/all-meals/");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMeals(data);
      setFilteredMeals(data);


      const availabilityPromises = data.map(async (meal) => {
        const availabilityResponse = await fetch(
          `http://localhost:5001/check-availability/${meal.id}`
        );
        if (availabilityResponse.ok) {
          const { availableReservations } = await availabilityResponse.json();
          return { id: meal.id, availableReservations };
        }
        return { id: meal.id, availableReservations: meal.maxReservations };
      });

      const availabilityResults = await Promise.all(availabilityPromises);
      const availabilityData = availabilityResults.reduce((acc, { id, availableReservations }) => {
        acc[id] = availableReservations;
        return acc;
      }, {});

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


  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? meals.filter(
          (meal) =>
            meal.title.toLowerCase().includes(query) ||
            meal.description.toLowerCase().includes(query)
        )
      : meals;
    setFilteredMeals(filtered);
  };


  useEffect(() => {
    const sortedMeals = [...filteredMeals].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (typeof fieldA === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else if (typeof fieldA === "number") {
        return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      return 0;
    });
    setFilteredMeals(sortedMeals);
  }, [sortField, sortDirection]);

  if (loading) {
    return <p>Loading meals...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h2 className={styles["meals"]}>Meals</h2>
      <div className={styles.controlsContainer}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or description..."
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            Search
          </button>
        </div>
        <div className={styles.sortContainer}>
          <label htmlFor="sortField"></label>
          <select
            id="sortField"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="title">Title</option>
            <option value="price">Price</option>
          </select>
          <label htmlFor="sortDirection"></label>
          <select
            id="sortDirection"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <div className={styles["meal-container"]}>
        <div className={styles["meals-grid"]}>
          {filteredMeals.length > 0 ? (
            filteredMeals.map((meal) => (
              <Meal
                key={meal.id}
                meal={meal}
                image={meal.image_url}
                availableReservations={availability[meal.id] || 0}
                variant="all-meals"
                isDisabled={availability[meal.id] <= 0}
                onReservationSuccess={fetchMealsWithAvailability}
                showDeleteButton={false}
                showUpdateButton={false}
              />
            ))
          ) : (
            <p>No meals match your search or sorting criteria.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default MealsList;