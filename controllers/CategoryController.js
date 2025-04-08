const Category = require("../models/CategoryModel");
const mongoose = require("mongoose");

const getCategories = async (req, res) => {
  try {
    
    const category = await Category.find().sort({createdAt: -1});
    if (!category) {
      return res.status(404).json({ message: "Categories not found" });
    }
    
    return res.status(200).json(category);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
const getPaginatedCategories = async (req, res) => {
  try {
    let {page, limit = 10} = req.query;
    page = parseInt(page);
    limit = parseInt(limit);


    const category = await Category.find().sort({createdAt: -1}).skip((page - 1) * limit).limit(limit);
    if (!category) {
      return res.status(404).json({ message: "Categories not found" });
    }
    const count = await Category.countDocuments();
    const totalPages = Math.ceil(count / limit);
    return res.status(200).json({category, count, totalPages});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const addCategory = async (req, res) => {
  console.log("Received Data:", req.body);
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ message: "Form data not found" });
  }

  try {
    const categories = await Category.create({ category });

    if (!categories) {
      return res.status(500).json({ message: "Category not created" });
    }

    return res
      .status(201)
      .json({ message: "Category created successfully", categories });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const PatchCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, specification } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    if (!category && !specification) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const updateCategory = await Category.findByIdAndUpdate(
      id,
      { $set: { category, specification } },
      { new: true, runValidators: true }
    );

    if (!updateCategory)
      return res.status(404).json({ message: "Category is not updated" });
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addCategory, getCategories, getPaginatedCategories, PatchCategory, deleteCategory };
