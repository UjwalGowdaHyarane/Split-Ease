const MealName = document.querySelector(".title");
const Recepie = document.querySelector(".recepie");
const ImgContainer = document.querySelector(".mealImageContainer");
const ListOfIngredients = document.querySelector(".ListOfIngredients");

console.log(new URLSearchParams(window.location.search));
const url = new URLSearchParams(window.location.search);
const mealName = url.get("title");
console.log(mealName);

async function fetchMealInfo() {
  await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
  )
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (data) {
      meals = data["meals"];
    });
  showMealInfo(meals[0]);
}

fetchMealInfo();

function showMealInfo(meal) {
  // displaying image of selected meal
  console.log(meal);
  const div = document.createElement("div");
  div.className = "mealImage";
  div.innerHTML = `<img
  src=${meal.strMealThumb}
  alt=""
  class="mealImage"
/>`;
  console.log(div.innerHTML);
  ImgContainer.append(div);

  // Displaying recepie and name of the meal selected
  MealName.textContent = meal.strMeal.toUpperCase();
  Recepie.textContent = meal.strInstructions;

  // ingredients
  for (let i = 0; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      const span = document.createElement("span");
      span.class = "ingredient";
      span.innerHTML = `${meal[`strIngredient${i}`]}--${
        meal[`strMeasure${i}`]
      }`;
      ListOfIngredients.append(span);
    }
  }
}
