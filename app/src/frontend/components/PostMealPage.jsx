import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostMealPage.module.css";

const PostMealPage = () => {
  const [formData, setFormData] = useState({
    image_url: "",
    title: "",
    description: "",
    location: "",
    when: "",
    max_reservations: "",
    price: "",
    created_date: new Date().toISOString().split("T")[0],
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Meal successfully created!");
        setFormData({
          image_url: "",
          title: "",
          description: "",
          location: "",
          when: "",
          max_reservations: "",
          price: "",
          created_date: new Date().toISOString().split("T")[0],
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to create the meal.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <h1 className={styles.note}>
      This is supposed to be a different app for the restaurant
    </h1>
    <div className={styles.buttonGroup}>
      <button
        className={`${styles.button} ${styles.manageButton}`}
        onClick={() => navigate("/manage-meals")}
      >
        Manage Meals
      </button>
      <button
        className={`${styles.button} ${styles.reservationsButton}`}
        onClick={() => navigate("/view-reservations")}
      >
        View Reservations
      </button>
    </div>
    <div className={styles.container}>
      <h2 className={styles.heading}>Create a New Meal</h2>
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Image URL:
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="Enter the image URL"
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
          />
        </label>

        <label className={styles.label}>
          Location:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Date:
          <input
            type="date"
            name="when"
            value={formData.when}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Maximum Reservations:
          <input
            type="number"
            name="max_reservations"
            value={formData.max_reservations}
            onChange={handleChange}
            min="1"
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className={styles.input}
          />
        </label>

        <button type="submit" className={styles.button}>
          Create Meal
        </button>
      </form>
    </div>
    </>
  );
};

export default PostMealPage;
