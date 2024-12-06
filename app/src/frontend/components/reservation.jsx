import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./reservation.module.css";
import Meal from "./Meal";

const Reservation = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [availableReservations, setAvailableReservations] = useState(0);
  const [reservation, setReservation] = useState({
    contact_name: "",
    contact_email: "",
    contact_phonenumber: "",
    number_of_guests: 1,
    created_date: new Date().toISOString().split("T")[0],
  
  });
  const [error, setError] = useState(null);

  const fetchAvailability = async () => {
    try {
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

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(`http://localhost:5001/meals/${id}`);
        if (!response.ok) throw new Error("Failed to fetch meal details");
        const data = await response.json();
        setMeal(data);

      
        await fetchAvailability();
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
    if (reservation.number_of_guests > availableReservations) {
      setError(`Only ${availableReservations} spots are available. Please adjust your guest count.`);
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_name: reservation.contact_name,
          contact_email: reservation.contact_email,
          contact_phonenumber: reservation.contact_phonenumber,
          number_of_guests: reservation.number_of_guests,
          meal_id: id,
          created_date: reservation.created_date,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      alert("Reservation successful!");
      setReservation({ contact_name: "", contact_email: "",  contact_phonenumber: "", number_of_guests: 1, created_date: ""
       });

  
      await fetchAvailability();
    } catch (error) {
      setError(error.message || "Failed to create reservation. Please try again.");
    }
  };

  if (error) return <p>{error}</p>;
  if (!meal) return <p>Loading meal details...</p>;

  return (
    <div className={styles.mealDetail}>
      <div className={styles.mealCard}>
    <h2>{meal.title}</h2>
    <p>{meal.description}</p>
    <p>{meal.price}</p>
    {Array.isArray(meal) && meal.length > 0 ? (
      meal.map((m, id) => (
        <Meal
          key={id}
          meal={m}
          showDeleteButton = {false}  
          showUpdateButton = {false}
          showReservationButton={false}
          variant="reservation"
          availableReservations={availableReservations} 
        />
      ))
    ) : (
      <p>No meals available</p>
    )}
</div>
      {availableReservations > 0 ? (
        <div>
          <h3 className={styles["reservation-text"]}>Make a Reservation</h3>
          <form onSubmit={handleSubmit} className={styles.reservationForm}>
            <label>
              Name:
              <input
                type="text"
                name="contact_name"
                value={reservation.contact_name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="contact_email"
                value={reservation.contact_email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Phone Number:
              <input
                type="tel"
                name="contact_phonenumber"
                value={reservation. contact_phonenumber}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Number of Guests:
              <input
                type="number"
                name="number_of_guests"
                value={reservation.number_of_guests}
                onChange={handleChange}
                min="1"
                max={availableReservations} 
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