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
    const meal = await knex("Meal").select("*").where("id", id);
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

export default mealsRouter;
