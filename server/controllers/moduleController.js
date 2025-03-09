const Module = require('../models/Module');
const Project = require('../models/Project');
const mongoose = require('mongoose');

exports.createModule = async (req, res) => {
  try {
    const { projectId, moduleName, subModuleName } = req.body;

    // Validate required fields
    if (!projectId || !moduleName || !subModuleName) {
      return res.status(400).json({
        success: false,
        message: 'ProjectId, module name and submodule name are required'
      });
    }

    // Validate projectId format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Create new module
    const module = new Module({
      projectId,
      moduleName,
      subModuleName
    });

    const savedModule = await module.save();

    // Update project's modules count
    await Project.findByIdAndUpdate(projectId, {
      $inc: { modulesCount: 1 }
    });

    res.status(201).json({
      success: true,
      data: savedModule
    });
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create module',
      error: error.message
    });
  }
};

exports.getModules = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    const modules = await Module.find({ projectId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: modules
    });
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching modules',
      error: error.message
    });
  }
}; 