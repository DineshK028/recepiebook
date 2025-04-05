// Get DOM elements
const form = document.querySelector('form');
const recipeList = document.querySelector('#recipe-list');
const noRecipes = document.getElementById('no-recipes');
const searchBox = document.getElementById('search-box');

// Define recipes array
let recipes = [];

// Handle form submit
function handleSubmit(event) {
  event.preventDefault();
  
  // Get input values
  const nameInput = document.querySelector('#recipe-name');
  const ingrInput = document.querySelector('#recipe-ingredients');
  const methodInput = document.querySelector('#recipe-method');
  const imageInput = document.querySelector('#recipe-image');
  const videoInput = document.querySelector('#recipe-video');

  const name = nameInput.value.trim();
  const ingredients = ingrInput.value.trim().split(',').map(i => i.trim());
  const method = methodInput.value.trim();
  const videoUrl = videoInput.value.trim();
  
  let imageUrl = '';

  // Convert uploaded image to Base64
  if (imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imageUrl = e.target.result;
      saveRecipe(name, ingredients, method, imageUrl, videoUrl);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    saveRecipe(name, ingredients, method, '', videoUrl);
  }
}

// Save the recipe and update the UI
function saveRecipe(name, ingredients, method, imageUrl, videoUrl) {
  if (name && ingredients.length > 0 && method) {
    const newRecipe = { name, ingredients, method, imageUrl, videoUrl };
    recipes.push(newRecipe);

    // Clear form inputs
    document.querySelector('#recipe-name').value = '';
    document.querySelector('#recipe-ingredients').value = '';
    document.querySelector('#recipe-method').value = '';
    document.querySelector('#recipe-image').value = '';
    document.querySelector('#recipe-video').value = '';

    displayRecipes();
  }
}

// Display recipes
function displayRecipes() {
  recipeList.innerHTML = '';
  recipes.forEach((recipe, index) => {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');

    // Convert YouTube URL into embeddable format
    let videoEmbed = '';
    if (recipe.videoUrl.includes('youtube.com') || recipe.videoUrl.includes('youtu.be')) {
      const videoId = recipe.videoUrl.split('v=')[1]?.split('&')[0] || recipe.videoUrl.split('/').pop();
      videoEmbed = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    }

    recipeDiv.innerHTML = `
      <h3>${recipe.name}</h3>
      <p><strong>Ingredients:</strong></p>
      <ul>${recipe.ingredients.map(ingr => `<li>${ingr}</li>`).join('')}</ul>
      <p><strong>Method:</strong></p>
      <p>${recipe.method}</p>
      ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="Recipe Image">` : ''}
      ${videoEmbed}
      <button class="delete-button" data-index="${index}">Delete</button>
    `;
    
    recipeList.appendChild(recipeDiv);
  });

  noRecipes.style.display = recipes.length > 0 ? 'none' : 'flex';
}

// Handle recipe deletion
function handleDelete(event) {
  if (event.target.classList.contains('delete-button')) {
    const index = event.target.dataset.index;
    recipes.splice(index, 1);
    displayRecipes();
    searchBox.value = '';
  }
}

// Search functionality
function search(query) {
  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(query.toLowerCase())
  );
  recipeList.innerHTML = '';
  filteredRecipes.forEach(recipe => {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');
    
    let videoEmbed = '';
    if (recipe.videoUrl.includes('youtube.com') || recipe.videoUrl.includes('youtu.be')) {
      const videoId = recipe.videoUrl.split('v=')[1]?.split('&')[0] || recipe.videoUrl.split('/').pop();
      videoEmbed = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    }

    recipeDiv.innerHTML = `
      <h3>${recipe.name}</h3>
      <p><strong>Ingredients:</strong></p>
      <ul>${recipe.ingredients.map(ingr => `<li>${ingr}</li>`).join('')}</ul>
      <p><strong>Method:</strong></p>
      <p>${recipe.method}</p>
      ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="Recipe Image">` : ''}
      ${videoEmbed}
      <button class="delete-button" data-index="${recipes.indexOf(recipe)}">Delete</button>
    `;

    recipeList.appendChild(recipeDiv);
  });
}

// Event listeners
form.addEventListener('submit', handleSubmit);
recipeList.addEventListener('click', handleDelete);
searchBox.addEventListener('input', event => search(event.target.value));
