import express from "express";
import knex from "../database_client.js";

const reviewRouter = express.Router();

//route to return all Reviews
reviewRouter.get("/", async (req, res, next) => {
  try {
    const allReviews = await knex("review").select();
    res.json(allReviews);
  } catch (error) {
    next(error);
  }
});

// router to get a review for a specific meal
reviewRouter.get("/meal/:meal_id", async (req, res, next) => {
  const { meal_id } = req.params;
  try {
    const reviews = await knex("review").where({ meal_id });

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this meal." });
    }

    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

//route to add a new Review
reviewRouter.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const data = req.body;
    await knex("review").insert(data);
    res.status(200).json({ message: "created successfully" });
  } catch (error) {
    next(error);
  }
});

//route to get reviews by id
reviewRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await knex("review").where("id", id).first();
    if (!result) {
      res.status(404).json({ message: "id not found" });
    } else {
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});

//route to updates Reviews by id
reviewRouter.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedReview = req.body;
    const result = await knex("review").where("id", id).update(updatedReview);

    if (result) {
      res.status(200).json({ message: "Review updated successfully" });
       res.json(result);
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    next(error);
  }
});

//route to deletes a Review by id
reviewRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedReview = await knex("review").where("id", id).del();
    if (deletedReview) {
      res.status(200).json({ message: "deleted successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
