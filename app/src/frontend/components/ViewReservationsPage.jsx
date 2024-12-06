import React, { useEffect, useState } from "react";
import styles from "./ViewReservationsPage.module.css";

const ViewReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:5001/view-reservations");
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  const sortByMealId = () => {
    const sortedReservations = [...reservations].sort((a, b) => {
      return sortOrder === "asc" ? a.meal_id - b.meal_id : b.meal_id - a.meal_id;
    });
    setReservations(sortedReservations);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Reservations</h1>
      <button onClick={sortByMealId}>
        Sort by Meal ID ({sortOrder === "asc" ? "Ascending" : "Descending"})
      </button>
      {reservations.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Meal ID</th>
              <th>Guest Name</th>
              <th>Number of Guests</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.id}</td>
                <td>{reservation.meal_id}</td>
                <td>{reservation.contact_name || "Anonymous"}</td>
                <td>{reservation.number_of_guests}</td>
                <td>{new Date().toISOString().split("T")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noReservations}>No reservations found.</p>
      )}
    </div>
  );
};

export default ViewReservationsPage;