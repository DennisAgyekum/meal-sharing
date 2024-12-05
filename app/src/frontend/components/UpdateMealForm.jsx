import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PostMealPage.module.css";

const UpdateMealForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState({
    title: "",
    description: "",
    image_url: "",
    location: "",
    when: "",
    max_reservations: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(""); 

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(`http://localhost:5001/meals/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch meal details.");
        }
        const data = await response.json();
        setMeal(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeal((prevMeal) => ({
      ...prevMeal,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      title: meal.title,
      description: meal.description,
      image_url: meal.image_url,
      location: meal.location,
      when: meal.when,
      max_reservations: meal.max_reservations,
      price: meal.price
    };
  
    try {
      const response = await fetch(`http://localhost:5001/meals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update the meal.");
      }
  
      alert("Meal updated successfully!");
      navigate("/manage-meals");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const formattedDate = meal.when && !isNaN(Date.parse(meal.when))
    ? new Date(meal.when).toISOString().split("T")[0]
    : "";

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Update Meal</h2>
      {formError && <p className={styles.error}>{formError}</p>}
      <form onSubmit={handleFormSubmit} className={styles.form}>  
      <label className={styles.label}>
          Image URL:
          <input
            type="url"
            name="image_url"
            value={meal.image_url || ""}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Title:
          <input
            type="text"
            name="title"
            value={meal.title}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.label}>
          Description:
          <textarea
            name="description"
            value={meal.description}
            onChange={handleInputChange}
            className={styles.textarea}
          />
        </label>
     
        <label className={styles.label}>
          Location:
          <input
            type="text"
            name="location"
            value={meal.location || ""}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          When:
          <input
            type="date"
            name="when"
            value={formattedDate}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.label}>
          Max Reservations:
          <input
            type="number"
            name="max_reservations"
            value={meal.max_reservations || ""}
            onChange={handleInputChange}
            min="1"
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Price:
          <input
            type="number"
            step="0.01"
            name="price"
            value={meal.price || ""}
            onChange={handleInputChange}
            min="0"
            className={styles.input}
            required
          />
        </label>
        <button type="submit" className={styles.button}>
          Update Meal
        </button>
      </form>
    </div>
  );
};

export default UpdateMealForm;