import express from "express";
import knex from "../database_client.js";

const reservationRouter = express.Router(); 

// Route to return all reservations
reservationRouter.get("/", async (req, res, next) => {
  try {
    const reservations = await knex("Reservation").select("*");
    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

// Route to add a new reservation
reservationRouter.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    await knex("Reservation").insert(data);
    res.status(200).json({ message: "created successfully" });
  } catch (error) {
    next(error);
  }
});

// Route to get a reservation by ID
reservationRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const reservation = await knex("Reservation").where("id", id);
    if (reservation.length === 0) {
      res.status(404).json({ message: "Reservation not found" });
    } else {
      res.json(reservation);
    }
  } catch (error) {
    next(error);
  }
});

// Route to update a reservation by ID
reservationRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedReservation = req.body;
    const result = await knex("Reservation")
      .where("id", id)
      .update(updatedReservation);

    if (result) {
      res.status(200).json({ message: "Reservation updated successfully" });
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    next(error);
  }
});

// Route to delete a reservation by ID
reservationRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedReservation = await knex("Reservation").where("id", id).del();

    if (deletedReservation) {
      res.status(200).json({ message: "deleted successfully" });
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    next(error);
  }
});

// Route to check if a meal has available reservations
reservationRouter.get("/check-availability/:mealId", async (req, res, next) => {
  try {
    const mealId = req.params.mealId;
    const meal = await knex("Meal").where("id", mealId).first();
    
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    const totalReservations = await knex("Reservation")
      .where("meal_id", mealId)
      .sum("number_of_guests as total");

    const availableReservations = meal.max_reservations - totalReservations[0].total;

    res.json({ availableReservations });
  } catch (error) {
    next(error);
  }
});

export default reservationRouter;
