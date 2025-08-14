const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import the file system module
const {
 createRecipe,
 getAllRecipes,
 getRecipeById,
 updateRecipe // Import the new controller
} = require('../controllers/recipeController');

// Configure Multer for file storage (same as before)
const storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, 'backend/uploads/');
 },
 filename: function (req, file, cb) {
   cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
 }
});

const upload = multer({ storage: storage });

// Define routes
router.post('/', upload.single('recipeImage'), createRecipe);
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', upload.single('recipeImage'), updateRecipe); // New update route

module.exports = router;