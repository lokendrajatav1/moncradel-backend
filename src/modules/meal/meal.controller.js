const mealService = require('./meal.service');

// @desc    Add a new meal
// @route   POST /api/meals
// @access  Private (Admin/Doctor)
const addMeal = async (req, res) => {
  try {
    const mealData = {
      ...req.body,
      ingredients: typeof req.body.ingredients === 'string' ? JSON.parse(req.body.ingredients) : req.body.ingredients,
      price: Number(req.body.price),
      discountedPrice: req.body.discountedPrice ? Number(req.body.discountedPrice) : 0
    };

    if (req.body.inStock === 'undefined') {
      delete mealData.inStock;
    } else if (req.body.inStock !== undefined) {
      mealData.inStock = req.body.inStock === 'true';
    }

    if (req.body.nutritionalInfo && typeof req.body.nutritionalInfo === 'string') {
        mealData.nutritionalInfo = JSON.parse(req.body.nutritionalInfo);
    }

    const meal = await mealService.addMeal(mealData, req.files);
    res.status(201).json({ success: true, data: meal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all meals
// @route   GET /api/meals
// @access  Private
const getMeals = async (req, res) => {
  try {
    const result = await mealService.getAllMeals(req.query);
    res.status(200).json({ 
      success: true, 
      count: result.count, 
      data: result.meals,
      pagination: {
        page: result.page,
        pages: result.pages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single meal by ID
// @route   GET /api/meals/:id
// @access  Public
const getMealById = async (req, res) => {
  try {
    const meal = await mealService.getMealById(req.params.id);
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });
    res.status(200).json({ success: true, data: meal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update meal
// @route   PUT /api/meals/:id
// @access  Public (temporarily)
const updateMeal = async (req, res) => {
  try {
    const mealData = {
      ...req.body,
      ingredients: typeof req.body.ingredients === 'string' ? JSON.parse(req.body.ingredients) : req.body.ingredients,
      price: req.body.price ? Number(req.body.price) : undefined,
      discountedPrice: req.body.discountedPrice !== undefined ? Number(req.body.discountedPrice) : undefined
    };

    if (req.body.inStock === 'undefined') {
      delete mealData.inStock;
    } else if (req.body.inStock !== undefined) {
      mealData.inStock = req.body.inStock === 'true';
    }

    if (req.body.nutritionalInfo && typeof req.body.nutritionalInfo === 'string') {
        mealData.nutritionalInfo = JSON.parse(req.body.nutritionalInfo);
    }

    const meal = await mealService.updateMeal(req.params.id, mealData, req.files);
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });
    
    res.status(200).json({ success: true, data: meal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete meal
// @route   DELETE /api/meals/:id
// @access  Public (temporarily)
const deleteMeal = async (req, res) => {
  try {
    const meal = await mealService.deleteMeal(req.params.id);
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });
    
    res.status(200).json({ success: true, message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dynamic meal filters
// @route   GET /api/meals/filters
// @access  Public
const getMealFilters = async (req, res) => {
  try {
    const filters = await mealService.getMealFilters();
    res.status(200).json({ success: true, data: filters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addMeal,
  getMeals,
  getMealFilters,
  getMealById,
  updateMeal,
  deleteMeal
};
