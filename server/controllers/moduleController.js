const Module = require('../models/Module');
const Project = require('../models/Project');
const logActivity = require('../middleware/Logger'); // Ensure the correct path
const mongoose = require('mongoose');

// Create new module
exports.createModule = async (req, res) => {
  try {
    const { projectId, moduleName, subModuleName, username } = req.body;

    // Validate required fields
    if (!projectId || !moduleName || !subModuleName || !username) {
      return res.status(400).json({ success: false, message: 'ProjectId, module name, submodule name, and username are required' });
    }

    // Validate projectId format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID format' });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Create new module
    const module = await Module.create({ projectId, moduleName, subModuleName });

    // Increment the project's modules count
    await Project.findByIdAndUpdate(projectId, { $inc: { modulesCount: 1 } });

    // Log the activity
    await logActivity('Module', `Created Module: ${moduleName}`, 'Module', username);

    res.status(201).json({ success: true, data: module, message: 'Module created successfully' });
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({ success: false, message: 'Failed to create module', error: error.message });
  }
};

// Get all modules by project ID
exports.getModules = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID format' });
    }

    const modules = await Module.find({ projectId }).sort({ createdAt: -1 });

    res.json({ success: true, data: modules, message: 'Modules fetched successfully' });
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ success: false, message: 'Error fetching modules', error: error.message });
  }
};

// Get a single module by ID
exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    res.json({ success: true, data: module, message: 'Module fetched successfully' });
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({ success: false, message: 'Error fetching module', error: error.message });
  }
};

// Update module
exports.updateModule = async (req, res) => {
  try {
    const { moduleName, subModuleName, username } = req.body;

    const module = await Module.findByIdAndUpdate(
      req.params.id,
      { moduleName, subModuleName, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    // Log the activity
    await logActivity('Module', `Updated Module: ${moduleName}`, 'Module', username);

    res.json({ success: true, data: module, message: 'Module updated successfully' });
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({ success: false, message: 'Error updating module', error: error.message });
  }
};

// Delete module
exports.deleteModule = async (req, res) => {
  try {
    const { username } = req.body;
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    await module.deleteOne();

    // Decrease the project's modules count
    await Project.findByIdAndUpdate(module.projectId, { $inc: { modulesCount: -1 } });

    // Log the activity
    await logActivity('Module', `Deleted Module: ${module.moduleName}`, 'Module', username);

    res.status(201).json({ success: true, message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Error deleting module:', error);
    res.status(500).json({ success: false, message: 'Error deleting module', error: error.message });
  }
};