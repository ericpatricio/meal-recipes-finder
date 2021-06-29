// DOM varialbles
const form = document.querySelector('#submit');
const search = document.querySelector('#search');
const randomBtn = document.querySelector('#random');

const headingEL = document.querySelector('#result-heading');
const mealsEl = document.querySelector('#meals');
const singleMealEl = document.querySelector('#single-meal');


// Event listeners
form.addEventListener('submit', getMeal);
mealsEl.addEventListener('click', showMeal);
randomBtn.addEventListener('click', getRandomMeal);


// Functions

// Search meal function from API
function getMeal(e) {
  // Prevent submit default behavior
  e.preventDefault();
  
  const term = search.value;

  if(term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);

        if(data.meals === null) {
          headingEL.innerHTML = `<h2>Sorry we can't find any recipes for: "${term}", please try again.</h2>`
        } else {
          headingEL.innerHTML = `<h2>Search result for: "${term}"</h2>`

          mealsEl.innerHTML = data.meals
            .map(meal => 
              `
              <div class="meal" data-mealID="${meal.idMeal}">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" >
                  <h3>${meal.strMeal}</h3>
                </div>
              </div>
              `
          ).join('')
        }
      })

    search.value = '';
  } else {
    headingEL.innerHTML = `<h3>"Here is a random meal picked for you"</h3>`
    mealsEl.style.margin = '0px';    
    getRandomMeal();
  }
}

// Show meal on click
function showMeal(e) {
  const meal = e.target.parentElement;
  console.log(meal);

  if(meal.classList.contains('meal')) {
    const mealID = meal.getAttribute('data-mealid');
    getMealByID(mealID);
  } else {
    return false;
  }
}

// Get meal by ID 
function getMealByID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    })
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for(let i = 1; i < 20; i++) {
    if(meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      )
    } else {
      break;
    }
  }

  // console.log(ingredients);

  singleMealEl.innerHTML = 
  `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="main">      
      <h2>Ingredients</h2>
      <ul>          
        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
      <h2>Preparation</h2>
      <p>${meal.strInstructions}</p>
    </div>
  </div>
  `
} 

// Let get a random meal
function getRandomMeal() {
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const meal = data.meals[0];
      headingEL.innerHTML = `<h3>"Here is a random meal picked for you"</h3>`;
      mealsEl.style.margin = '0px';
      singleMealEl.style.marginTop = '0px';

      addMealToDOM(meal);      
    })
}
























