import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./reservation.module.css";
import Meal from "./Meal";

const Reservation = () => {
  const { id } = useParams(); 
  const [meal, setMeal] = useState(null);
  const [availableReservations, setAvailableReservations] = useState(0);
  const [reservation, setReservation] = useState({
    name: "",
    email: "",
    phonenumber: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(`http://localhost:5001/meals/${id}`);
        if (!response.ok) throw new Error("Failed to fetch meal details");
        const data = await response.json();
        setMeal(data);

        const availabilityResponse = await fetch(
          `http://localhost:5001/check-availability/${id}`
        );
        if (!availabilityResponse.ok) throw new Error("Failed to check availability");
        const { availableReservations } = await availabilityResponse.json();
        setAvailableReservations(availableReservations);

      } catch (error) {
        setError(error.message);
      }
    };

    fetchMeal();
  }, [id]);

  const handleChange = (e) => {
    setReservation({
      ...reservation,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            contact_name: reservation.name,
            contact_email: reservation.email,
            contact_phonenumber: reservation.phonenumber,
            meal_id: id, }),
      });
      if (!response.ok) throw new Error("Failed to make reservation");
      alert("Reservation successful!");
      setReservation({ name: "", email: "", phonenumber: "" });
    } catch (error) {
      setError("Failed to create reservation. Please try again.");
    }
  };

  if (error) return <p>{error}</p>;
  if (!meal) return <p>Loading meal details...</p>;

  return (
<div className={styles.mealDetail}>
      <h2>{meal.title}</h2>
      <p>{meal.description}</p>
      <p>{meal.price}</p>
      {meal.length > 0 ? (
            meal.map((meal, id) => <Meal key={id} meal={meal} showReservationButton={false} variant="reservation" />)
          ) : (
            <p>No meals available</p>
          )}

      {availableReservations > 0 ? (
        <div>
          <h3 className={styles["reservation-text"]}>Make a Reservation</h3>
          <form onSubmit={handleSubmit} className={styles.reservationForm}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={reservation.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={reservation.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Phone Number:
              <input
                type="tel"
                name="phonenumber"
                value={reservation.phonenumber}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit">Reserve</button>
          </form>
        </div>
      ) : (
        <p>No reservations available for this meal.</p>
      )}
    </div>
  );
};

export default Reservation;