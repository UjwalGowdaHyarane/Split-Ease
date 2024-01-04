let meals = [];

const alpha = document.querySelector(".title");

const title = document.querySelector(".meal-name");
const ListOfMeals = document.querySelector(".meal-list");
const mealcard = document.querySelector(".meal-card");
// const icon = document.querySelector(".absolute");

// console.log(ListOfMeals, mealcard);

// MARKING THE MEAL AS FAVOURITE

function renderMeals(meals) {
  ListOfMeals.innerHTML = "";
  for (let meal of meals) {
    // console.log(meal);
    // alpha.innerText = `${meal.strMeal}`;
    // alpha.innerHTML = `${meal.strMeal}`;
    // console.log(alpha);

    const div = document.createElement("div");
    div.className = "meal-card card";
    div.id = `${meal.idMeal}`;
    div.innerHTML = `
    <div class="img-container card">
          <a href='about.html?title=${meal.strMeal}&id=${meal.idMeal}&img=${
      meal.strMealThumb
    }'style='text-decoration:none'><img
            src=${meal.strMealThumb}
            alt=""
            class="meal-thumbnail card"
            id=${meal.idMeal}
          /></a>
        </div>
        <div class="meal-details card" id=${meal.idMeal}>
<h3 class="meal-name card" id=${meal.idMeal}><a href='about.html?title=${
      meal.strMeal
    }&id=${meal.idMeal}&img=${meal.strMealThumb}'style='text-decoration:none'>${
      meal.strMeal
    }</a></h3>
    
    <div id=${meal.idMeal} class="large-font text-center top-20 absolute">
        <ion-icon id=${meal.idMeal} class='icon ' name="heart">
          <div class="red-bg"></div>
        </ion-icon>
      </div>
    
<p class="description">${meal.strInstructions.slice(0, 100)}</p>
</div>`;
    ListOfMeals.append(div);
  }

  // HANDLING CLICKS CLICKS
  function handleclicks(e) {
    const target = e.target;
    console.log(target, target.className, target.id);
    const alpha = document.querySelector(".title");

    // RENDER FAVOURITE MEALS
    if (target.parentElement.className == "favourites") {
      const mealId = target.id;

      const mealTemp = meals.filter((meal) => meal.favourite === "yes");
      // console.log(mealTemp);
      renderMeals(mealTemp);
    }
    // Toggle the like button
    if (target.parentElement.className === "like") {
      const MealId = target.id;
      console.log(MealId);
      MarkAsFavourite(MealId);

      const mealTemp = meals.filter((meal) => meal.idMeal === "53065");
      // console.log(mealTemp);
    }

    if (target.className === "home") {
      console.log(meals);
      const mealTemp = meals.filter((meal) => meal.favourite !== "yes");

      renderMeals(mealTemp);
    }
    if (target.classList.contains("hydrated")) {
      // change the fill to red color indicating favourites
      let id = target.id;
      console.log(document.getElementsByClassName("icon md hydrated"), id);
      target.classList.toggle("active");
      // add to favourite list
      if (target.className === "icon md hydrated active") {
        const MealId = target.id;
        console.log(MealId);
        MarkAsFavourite(MealId);
      } else {
        RemoveFromFavourite(id);
      }
    }
  }
  document.addEventListener("click", handleclicks);
}

// HANDLING KEY PRESSES
function handleKeyPress(e) {
  if (e.target.key === "Enter") {
    fetchMealsList();
  }
}
//Mark the selected meal as favourite and add to favourite list
function MarkAsFavourite(id) {
  for (let meal of meals) {
    if (meal.idMeal === id) {
      meal.favourite = "yes";
      // console.log(meals);
    }
  }
}
// Remove from favourite list
function RemoveFromFavourite(id) {
  for (let meal of meals) {
    if (meal.idMeal === id) {
      meal.favourite = "no";
      // console.log(meals);
    }
  }
}
const inputBar = document.querySelector(".search-input");
inputBar.addEventListener("keydown", fetchMealsList);

// Fetch DATA of Meals
async function fetchMealsList() {
  const inputValue = inputBar.value;
  console.log(inputValue);
  await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`
  )
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (data) {
      meals = data["meals"];
    });
  renderMeals(meals);
}

function InitializeApp() {
  fetchMealsList();
}

InitializeApp();

function GoBack() {
  window.history.back();
}

// async function fetchData() {
//   const name = "Arrabiata";
//   await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
//     .then(function (response) {
//       // console.log(response);
//       return response.json();
//     })
//     .then(function (data) {
//       meals = data["meals"];
//       console.log("information ${meals}");
//     });
//   console.log("information ${meals}");
// }
