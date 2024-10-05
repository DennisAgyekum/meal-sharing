import express from "express";
import knex from "../database_client.js";

const mealsRouter = express.Router();

// Route to return all meals
mealsRouter.get("/", async (req, res, next) => {
  try {
    const meals = await knex("Meal").select("*");
    res.json(meals);
  } catch (error) {
    next(error);
  }
});

// Route to insert a new meal
mealsRouter.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    await knex("Meal").insert(data);
    res.status(200).json({ message: "created successfully" });
  } catch (error) {
    next(error);
  }
});

// Route to get a meal by ID
mealsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const meal = await knex("Meal").where("id", id);
    if (meal.length === 0) {
      res.status(404).json({ message: "Meal not found" });
    } else {
      res.json(meal);
    }
  } catch (error) {
    next(error);
  }
});

// Route to update a meal by ID
mealsRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedMeal = req.body;
    const result = await knex("Meal").where("id", id).update(updatedMeal);

    if (result) {
      // Check if any rows were updated
      res.status(200).json({ message: "Meal updated successfully" });
    } else {
      res.status(404).json({ message: "Meal not found" });
    }
  } catch (error) {
    next(error);
  }
});

// Route to delete a meal by ID
mealsRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedMeal = await knex("Meal").where("id", id).del();

    if (deletedMeal) {
      // Check if any rows were deleted
      res.status(200).json({ message: "deleted successfully" });
    } else {
      res.status(404).json({ message: "Meal not found" });
    }
  } catch (error) {
    next(error);
  }
});

mealsRouter.get("/", async (request, response, next) => {
  console.log("GET");
  try {
    const query = db("Meal");
    const {
      maxPrice,
      availableReservations,
      title,
      dateAfter,
      dateBefore,
      limit,
      sortKey,
      sortDir,
    } = request.query;

      if (maxPrice !== undefined) {
        if (isNaN(parseFloat(maxPrice))) {
          return response.status(400).json({ error: "maxPrice must be a valid number." });
        }
        query.where("price", "<", maxPrice);
      }
  
      if (availableReservations !== undefined) {
        if (availableReservations !== "true" && availableReservations !== "false") {
          return response.status(400).json({ error: "availableReservations must be either 'true' or 'false'." });
        }
        const available = availableReservations === "true";
        query = query
          .leftJoin("reservation", "Meal.id", "reservation.meal_id")
          .groupBy("Meal.id")
          .select("Meal.id", "Meal.title", "Meal.price", "Meal.max_reservations")
          .having(
            available
              ? "Meal.max_reservations > COUNT(reservation.id)"
              : "Meal.max_reservations <= COUNT(reservation.id)"
          );
      }
  
     if (req.query.title) {
      const title = req.query.title;
      if (typeof title !== "string") {
        return res.status(400).json({ error: "Title must be a string" });
      }
      query = query.where("title", "like", `%${title}%`);
    }
  
      if (dateAfter !== undefined) {
        if (isNaN(Date.parse(dateAfter))) {
          return response.status(400).json({ error: "dateAfter must be a valid date." });
        }
        query.where("when", ">", dateAfter);
      }
  
      if (dateBefore !== undefined) {
        if (isNaN(Date.parse(dateBefore))) {
          return response.status(400).json({ error: "dateBefore must be a valid date." });
        }
        query.where("when", "<", dateBefore);
      }
  
      if (limit !== undefined) {
        if (!Number.isInteger(parseInt(limit)) || parseInt(limit) <= 0) {
          return response.status(400).json({ error: "limit must be a positive integer." });
        }
        query.limit(limit);
      }
  
      if (sortKey !== undefined) {
        if (!["price", "max_reservations"].includes(sortKey)) {
          return response.status(400).json({ error: "sortKey must be either 'price' or 'max_reservations'." });
        }
        if (sortDir !== undefined && !["asc", "desc"].includes(sortDir)) {
          return response.status(400).json({ error: "sortDir must be either 'asc' or 'desc'." });
        }
        query.orderBy(sortKey, sortDir !== undefined ? sortDir : "asc");
      }

    const meals = await query;
    res.json(meals);
  } catch (error) {
    next(error);
  }
});

export default mealsRouter;
