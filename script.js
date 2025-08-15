document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://foodiefeedapi.onrender.com';

    // Get elements from the DOM
    const recipeGrid = document.getElementById('recipeGrid');
    const recipeDetailModal = document.getElementById('recipeDetailModal');
    const recipeDetailContent = document.getElementById('recipeDetailContent');
    const addEditRecipeModal = document.getElementById('addEditRecipeModal');
    const recipeForm = document.getElementById('recipeForm');
    const modalTitle = document.getElementById('modalTitle');
    const currentRecipeImage = document.getElementById('currentRecipeImage');
    const btnAddRecipe = document.getElementById('btnAddRecipe');
    const closeAddEditModal = document.getElementById('closeAddEditModal');
    const cancelAddEdit = document.getElementById('cancelAddEdit');
    const addIngredientBtn = document.getElementById('addIngredientBtn');
    const ingredientsList = document.getElementById('ingredientsList');
    const addStepBtn = document.getElementById('addStepBtn');
    const stepsList = document.getElementById('stepsList');

    let allRecipes = [];
    let currentEditingRecipeId = null;

    // --- UTILITY FUNCTIONS ---
    // const createStarRating = (rating) => {
    //     let stars = '';
    //     for (let i = 1; i <= 5; i++) {
    //         stars += `<span class="star ${i <= rating ? 'filled' : ''}">★</span>`;
    //     }
    //     return `<div class="star-rating">${stars}</div>`;
    // };

    // --- RENDER & DISPLAY FUNCTIONS ---
    const renderRecipes = (recipes) => {
        recipeGrid.innerHTML = '';
        recipes.forEach(r => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300';
            recipeCard.innerHTML = `
                <img src="${r.imageUrl}" alt="${r.title}" class="w-full h-48 object-cover">
                <div class="p-5">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${r.title}</h3>
                    <p class="text-gray-600 mb-3">Time: ${r.cookingTime} mins</p>
                    
                </div>
            `;
            recipeCard.addEventListener('click', () => showRecipeDetail(r._id));
            recipeGrid.appendChild(recipeCard);
        });
    };

    const showRecipeDetail = async (recipeId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}`);
            if (!res.ok) throw new Error('Recipe not found');
            const r = await res.json();

            recipeDetailContent.innerHTML = `
                <div class="flex justify-between items-start">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">${r.title}</h2>
                    <div class="flex items-center">
                        <button id="editRecipeBtn" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full font-semibold shadow-md mr-3 text-sm">Edit</button>
                        <button id="closeDetailModal" class="text-gray-500 hover:text-gray-700 text-3xl leading-none">&times;</button>
                    </div>
                </div>
                <img src="${r.imageUrl}" alt="${r.title}" class="w-full h-64 object-cover rounded-lg mb-4">
                <div class="flex items-center justify-between text-gray-600 mb-6">
                    <span><strong>Category:</strong> ${r.category}</span>
                    <span><strong>Cooking Time:</strong> ${r.cookingTime} mins</span>
                    
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="text-xl font-semibold mb-3">Ingredients</h4>
                        <ul class="list-disc list-inside bg-orange-50 p-4 rounded-lg">
                            ${r.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-xl font-semibold mb-3">Steps</h4>
                        <ol class="list-decimal list-inside space-y-2">
                            ${r.steps.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            `;
            recipeDetailModal.classList.remove('hidden');
            document.getElementById('closeDetailModal').addEventListener('click', () => recipeDetailModal.classList.add('hidden'));
            document.getElementById('editRecipeBtn').addEventListener('click', () => openEditModal(r));
        } catch (error) {
            console.error('Failed to fetch recipe details:', error);
            alert('Could not load recipe details.');
        }
    };
    
    // --- HELPER FUNCTIONS for ADD/EDIT MODAL ---
    const addIngredientInput = (value = '') => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'ingredient-input w-full px-4 py-2 border-2 border-gray-200 rounded-lg';
        input.placeholder = 'Enter an ingredient';
        input.value = value;
        ingredientsList.appendChild(input);
    };

    const addStepInput = (value = '') => {
        const textarea = document.createElement('textarea');
        textarea.className = 'step-input w-full px-4 py-2 border-2 border-gray-200 rounded-lg';
        textarea.rows = 2;
        textarea.placeholder = 'Describe a step';
        textarea.value = value;
        stepsList.appendChild(textarea);
    };

    const openEditModal = (recipe) => {
        recipeDetailModal.classList.add('hidden');
        currentEditingRecipeId = recipe._id;
        modalTitle.textContent = 'Edit Your Recipe';

        document.getElementById('recipeTitle').value = recipe.title;
        document.getElementById('recipeCategory').value = recipe.category;
        document.getElementById('cookingTime').value = recipe.cookingTime;

        currentRecipeImage.src = `${recipe.imageUrl}`;
        currentRecipeImage.classList.remove('hidden');

        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ingredient => addIngredientInput(ingredient));
        if (recipe.ingredients.length === 0) addIngredientInput(); // Add one if empty

        stepsList.innerHTML = '';
        recipe.steps.forEach(step => addStepInput(step));
        if (recipe.steps.length === 0) addStepInput(); // Add one if empty

        addEditRecipeModal.classList.remove('hidden');
    };

    // --- FETCH & INITIAL LOAD ---
    const fetchAllRecipes = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/recipes`);
            if (!res.ok) throw new Error('Network response was not ok');
            allRecipes = await res.json();
            renderRecipes(allRecipes);
        } catch (error) {
            console.error("Failed to fetch recipes:", error);
            recipeGrid.innerHTML = '<p class="text-center text-red-500">Failed to load recipes. Is the backend server running?</p>';
        }
    };

    // --- EVENT LISTENERS ---
    btnAddRecipe.addEventListener('click', () => {
        currentEditingRecipeId = null;
        modalTitle.textContent = 'Share Your Recipe';
        recipeForm.reset();
        currentRecipeImage.classList.add('hidden');
        ingredientsList.innerHTML = '';
        stepsList.innerHTML = '';
        addIngredientInput();
        addStepInput();
        addEditRecipeModal.classList.remove('hidden');
    });

    closeAddEditModal.addEventListener('click', () => addEditRecipeModal.classList.add('hidden'));
    cancelAddEdit.addEventListener('click', () => addEditRecipeModal.classList.add('hidden'));

    addIngredientBtn.addEventListener('click', () => addIngredientInput());
    addStepBtn.addEventListener('click', () => addStepInput());

    recipeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', document.getElementById('recipeTitle').value);
        formData.append('category', document.getElementById('recipeCategory').value);
        formData.append('cookingTime', document.getElementById('cookingTime').value);
        
        const imageInput = document.getElementById('recipeImage');
        if (imageInput.files[0]) {
            formData.append('recipeImage', imageInput.files[0]);
        }

        document.querySelectorAll('.ingredient-input').forEach(input => {
            if (input.value) formData.append('ingredients', input.value.trim());
        });

        document.querySelectorAll('.step-input').forEach(textarea => {
            if (textarea.value) formData.append('steps', textarea.value.trim());
        });

        const isEditing = currentEditingRecipeId !== null;
        const url = isEditing ? `${API_BASE_URL}/api/recipes/${currentEditingRecipeId}` : `${API_BASE_URL}/api/recipes`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, { method, body: formData });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} recipe`);
            }

            addEditRecipeModal.classList.add('hidden');
            await fetchAllRecipes(); 
            if (isEditing) {
                await showRecipeDetail(currentEditingRecipeId);
            }

        } catch (error) {
            console.error('Form submission error:', error);
            alert('Error: ' + error.message);
        }
    });
    
    // Category Filtering
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active')?.classList.remove('active', 'bg-orange-500', 'text-white');
            document.querySelector('.filter-btn.active')?.classList.add('bg-white', 'hover:bg-orange-100', 'text-gray-700', 'border-2', 'border-orange-200');
            
            btn.classList.add('active', 'bg-orange-500', 'text-white');
            btn.classList.remove('bg-white', 'hover:bg-orange-100', 'text-gray-700', 'border-2', 'border-orange-200');

            const category = btn.getAttribute('data-cat');
            const filteredRecipes = category === 'all' ? allRecipes : allRecipes.filter(r => r.category === category);
            renderRecipes(filteredRecipes);
        });
    });
    
    // --- INITIALIZATION ---
    fetchAllRecipes();
});