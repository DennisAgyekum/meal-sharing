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
    const query = db("Meals");
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
    console.log(`maxPrice = ${maxPrice}`);
    console.log(`title = ${title}`);
    console.log(`limit = ${limit}`);
    console.log(`dateafter = ${dateAfter}`);
    console.log(`datebefore = ${dateBefore}`);
    console.log(`availableReservation = ${availableReservations}`);

    if (maxPrice !== undefined) {
      query.where("price", "<", maxPrice);
    }
    if (availableReservations !== undefined) {
      if (availableReservations === "true") {
        query
          .leftJoin("reservation", "meal.id", "=", "reservation.meal_id")
          .select("meal.id", "meal.max_reservations", "meal.title")
          .sum("reservation.number_of_guests as sum_of_guests")
          .groupBy("meal.id", "meal.max_reservations", "meal.title")
          .having("sum_of_guests", "<", knex.ref("meal.max_reservations"));
      } else {
        query
          .leftJoin("reservation", "meal.id", "=", "reservation.meal_id")
          .select("meal.id", "meal.max_reservations", "meal.title")
          .sum("reservation.number_of_guests as sum_of_guests")
          .groupBy("meal.id", "meal.max_reservations", "meal.title")
          .having("sum_of_guests", ">=", knex.ref("meal.max_reservations"));
      }
    }
    if (title !== undefined) {
      query.where("title", "like", `%${title}%`);
    }

    if (dateAfter !== undefined) {
      query.where("when", ">", dateAfter);
    }
    if (dateBefore !== undefined) {
      query.where("when", "<", dateBefore);
    }
    if (limit !== undefined) {
      query.limit(limit);
    }
    if (sortKey !== undefined) {
      if (sortKey == "price") {
        query.orderBy("price", sortDir !== undefined ? sortDir : "asc");
      }
      if (sortKey == "max_reservations") {
        query.orderBy(
          "max_reservations",
          sortDir !== undefined ? sortDir : "asc"
        );
      }
    }

    const meals = await query;
    res.json(meals);
  } catch (error) {
    next(error);
  }
});

export default mealsRouter;
