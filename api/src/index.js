
import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";
import reservationRouter from "./routers/reservations.js";
import mealsRouter from "./routers/meals.js";
import reviewRouter from "./routers/review.js";



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/reservation", reservationRouter);
app.use("/meals", mealsRouter);
app.use("/reviews", reviewRouter);

const apiRouter = express.Router();

//handle no data found
const handleNoData = (req, res, next) => {
  if (req.data && req.data.length === 0) {
    return res.status(404).json({ message: "No meals found" });
  }
  next();
};

//handle errors
const errorHandler = (err, _req, res, _next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
};

// Route to get all future meals
app.get("/future-meals", async (_req, res, next) => {
  try {
    const now = new Date();
    const futureMeals = await knex("Meal").select("*").where("when", ">", now);
    res.json(futureMeals);
  } catch (error) {
    next(error);
  }
});

// Route to get all past meals
app.get("/past-meals", async (_req, res, next) => {
  try {
    const now = new Date();
    const pastMeals = await knex("Meal").select("*").where("when", "<", now);
    res.json(pastMeals);
  } catch (error) {
    next(error);
  }
});

// Route to get all meals sorted by ID
app.get("/all-meals", async (_req, res, next) => {
  try {
    const allMeals = await knex("Meal").select("*").orderBy("id");
    res.json(allMeals);
  } catch (error) {
    next(error);
  }
});


//manage meals

app.get("/manage-meals", async (_req, res, next) => {
  try {
    const allMeals = await knex("Meal").select("*").orderBy("id");
    res.json(allMeals);
  } catch (error) {
    next(error);
  }
});


app.get('/meals/:id', async (req, res, next) => {
  try {
    const mealId = req.params.id;
    const meal = await knex('Meal').where({ id: mealId }).first();
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.json(meal);
  } catch (error) {
    next(error);
  }
});

  
// Route to get the first meal
app.get("/first-meal", async (_req, res, next) => {
  try {
    const firstMeal = await knex("Meal").orderBy("id", "asc").first();
    if (!firstMeal) {
      return res.status(404).json({ message: "No first meal found" });
    }
    res.json(firstMeal);
  } catch (error) {
    next(error);
  }
});

// Route to get the last meal
app.get("/last-meal", async (_req, res, next) => {
  try {
    const lastMeal = await knex("Meal").orderBy("id", "desc").first();
    if (!lastMeal) {
      return res.status(404).json({ message: "No last meal found" });
    }
    res.json(lastMeal);
  } catch (error) {
    next(error);
  }
});


app.get("/check-availability/:mealId", async (req, res, next) => {
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


app.post("/reservation", async (req, res) => {
  try {
    const { meal_id, number_of_guests } = req.body;

    const meal = await knex("Meal").where({ id: meal_id }).first();
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    const { max_reservation } = meal;

    const currentReservations = await knex("Reservation")
      .where({ meal_id })
      .sum("number_of_guests as total_reserved");

    const totalReserved = currentReservations[0].total_reserved || 0;
    const availableSpots = max_reservation - totalReserved;
    if (number_of_guests > availableSpots) {
      return res.status(400).json({
        message: `Only ${availableSpots} spots left for this meal. Please adjust the number of guests.`,
      });
    }

    const { phonenumber, name, contact_email } = req.body;
    const newReservation = {
      number_of_guests,
      meal_id,
      phonenumber,
      name,
      contact_email,
      created_date
    };

    const insertedReservation = await knex("Reservation").insert(newReservation).returning("*");
    res.status(201).json(insertedReservation);
  } catch (error) {
    next(error);
  }
});


app.post("/reviews/post", async (req, res) => {
  const { title, description, stars, meal_id, created_date } = req.body;
  try {
    await knex("Review").insert({
      title,
      description,
      stars,
      meal_id,
      created_date,
    });
    res.status(201).json({ message: "Review submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit review" });
  }
});


// Route to add a new meal
app.post("/meals", async (req, res, next) => {
  try {
    const { title, description, location, when, max_reservations, price, image_url } = req.body;

    if (!title || !when || !price) {
      return res.status(400).json({ error: "Title, when, and price are required fields." });
    }

    const newMeal = {
      title,
      description: description || null, 
      location: location || null,     
      when,
      max_reservations: max_reservations || null, 
      price,
      image_url: image_url || null,
      created_date,
    };

    const insertedMeal = await knex("Meal").insert(newMeal).returning("*");

    res.status(201).json(insertedMeal);
  } catch (error) {
    next(error);
  }
});


// Update a meal
app.put("/meals/:id", async (req, res) => {
  try {
    const { title, description, image_url, location, when, max_reservations, price } = req.body;
    if (!title || !when || !price) {
      return res.status(400).json({ error: "Title, date, and price are required." });
    }
    const updates = {
      title,
      description,
      image_url,
      location,
      when,
      max_reservations: max_reservations ? Number(max_reservations) : null,
      price: price ? Number(price) : null,
    };
    for (const key in updates) {
      if (updates[key] === undefined || updates[key] === null) {
        delete updates[key];
      }
    }
    const updatedRows = await knex("Meal")
      .where({ id: req.params.id })
      .update(updates);

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Meal not found." });
    }

    res.json({ message: "Meal updated successfully!" });
  } catch (err) {
    console.error("Error updating meal:", err);
    res.status(500).json({ error: "Failed to update meal." });
  }
});


// Delete a meal
app.delete("/meals/:id", async (req, res, next) => {
  try {
    const mealId = parseInt(req.params.id, 10);

    if (isNaN(mealId)) {
      return res.status(400).json({ message: "Invalid meal ID" });
    }

    const meal = await knex("Meal").where({ id: mealId }).first();
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    await knex("Meal").where({ id: mealId }).del();

    res.status(204).send(); 
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ message: "Cannot delete meal; it is referenced elsewhere." });
    }
    next(error);
  }
});


// Route to fetch reservations
app.get("/view-reservations", async (req, res) => {
  const { sort = "asc" } = req.query; // Default to ascending order
  try {
    const reservations = await knex("Reservation")
      .join("Meal", "Reservation.meal_id", "Meal.id")
      .select(
        "Reservation.id",
        "Reservation.number_of_guests",
        "Reservation.contact_name",
        "Reservation.contact_email",
        "Reservation.contact_phonenumber",
        "Reservation.created_date",
        "Meal.title as meal_title",
        "Reservation.meal_id"
      )
      .orderBy("Reservation.meal_id", sort); // Apply sort order from query

    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Failed to fetch reservations." });
  }
});



// Nested routes (can be replaced with your own sub-router)
apiRouter.use("/nested", nestedRouter);

// Register the API router
app.use("/api", apiRouter);

// Error handler (must be defined after all routes)
app.use(errorHandler);

// Start the server
app.listen(process.env.PORT || 5001, () => {
  console.log(`Server running on port ${process.env.PORT || 5001}`);
});
