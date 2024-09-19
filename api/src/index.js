import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

//handle no data found
const handleNoData = (req, res, next) => {
  if (req.data && req.data.length === 0) {
    return res.status(404).json({ message: "No meals found" });
  }
  next(); 
};

//handle errors
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
};

// Route to get all future meals
app.get('/future-meals', async (req, res, next) => {
  try {
    const now = new Date();
    const futureMeals = await knex.raw('Meal').where('when', '>', now).select('*');
    if (futureMeals.length === 0) return res.status(404).json({ message: 'No future meals found' });
    res.json(futureMeals);
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

// Route to get all past meals
app.get('/past-meals', async (req, res, next) => {
  try {
    const now = new Date();
    const pastMeals = await knex.raw('Meal').where('when', '<', now).select('*');
    if (pastMeals.length === 0) return res.status(404).json({ message: 'No past meals found' });
    res.json(pastMeals);
  } catch (error) {
    next(error);
  }
});

// Route to get all meals sorted by ID
app.get('/all-meals', async (req, res, next) => {
  try {
    const allMeals = await knex.raw('Meal').orderBy('id').select('*');
    if (allMeals.length === 0) return res.status(404).json({ message: 'No meals found' });
    res.json(allMeals);
  } catch (error) {
    next(error);
  }
});

// Route to get the first meal 
app.get('/first-meal', async (req, res, next) => {
  try {
    const firstMeal = await knex.raw('Meal').orderBy('id', 'asc').first();
    if (!firstMeal) return res.status(404).json({ message: 'No first meal found' });
    res.json(firstMeal);
  } catch (error) {
    next(error);
  }
});

// Route to get the last meal 
app.get('/last-meal', async (req, res, next) => {
  try {
    const lastMeal = await knex.raw('Meal').orderBy('id', 'desc').first();
    if (!lastMeal) return res.status(404).json({ message: 'No last meal found' });
    res.json(lastMeal);
  } catch (error) {
    next(error);
  }
});

// Nested routes (can be replaced with your own sub-router)
apiRouter.use("/nested", nestedRouter);

// Register the API router
app.use("/api", apiRouter);

// Error handler (must be defined after all routes)
app.use(errorHandler);

// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});