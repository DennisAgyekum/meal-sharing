
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./reviewForm.module.css";

const ReviewForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [review, setReview] = useState({
    title: "",
    description: "",
    stars: 1,
  });

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };
  const formattedDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/reviews/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...review, 
          meal_id: id, 
          created_date: formattedDate
        }),
      });
      if (!response.ok) throw new Error("Failed to submit review");
      alert("Review submitted successfully!");
      navigate(`/all-meals`);
    } catch (error) {
      alert("Error submitting review. Please try again.");
    }

  };

  return (
    <div className={styles.reviewFormContainer}>
      <h2 className={styles["review-text"]}>Leave a Review</h2>
      <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={review.title}
            onChange={handleReviewChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={review.description}
            onChange={handleReviewChange}
            required
          ></textarea>
        </label>
        <label>
          Stars (1-5):
          <input
            type="number"
            name="stars"
            value={review.stars}
            onChange={handleReviewChange}
            min="1"
            max="5"
            required
          />
        </label>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;