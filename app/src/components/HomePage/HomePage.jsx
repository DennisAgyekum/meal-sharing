import React from "react";
import MealsList from "../../frontend/components/MealsList"


function HomePage() {
  return (
    <div>
    <MealsList title={title} description={description} price={price} />
</div>
);
}

export default HomePage;
