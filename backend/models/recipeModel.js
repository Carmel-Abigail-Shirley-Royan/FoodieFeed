const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['dessert', 'main-course', 'snacks']
  },
  cookingTime: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  steps: {
    type: [String],
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Recipe', recipeSchema);