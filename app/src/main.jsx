import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TestPage from "./components/TestPage/TestPage.jsx";
import MealsList from "./frontend/components/MealsList.jsx";
import FrontPage from "./frontend/components/FrontPage.jsx";
import AboutPage from "./frontend/components/AboutUs.jsx";
import Reservation from "./frontend/components/reservation.jsx";
import ReviewForm from "./frontend/components/reviewForms.jsx";
import Layout from "./LayOut";
import "./main.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <FrontPage />
      </Layout>
    ),
  },
  {
    path: "/reservations/:id",
    element: (
      <Layout>
        <Reservation/>
      </Layout>
    ),
  },

  {
    path: "/all-meals",
    element: (
      <Layout>
        <MealsList />
      </Layout>
    ),
  },
  {
    path: "/reviews/:id",
    element: (
      <Layout>
        <ReviewForm />
      </Layout>
    ),
  },

  {
    path: "/about-us",
    element: (
      <Layout>
        <AboutPage />
      </Layout>
    ),
  },
  {
    path: "/nested",
    element: (
      <Layout>
        <TestPage />
      </Layout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);