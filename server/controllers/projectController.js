const Project = require('../models/Project');

// Create new project
exports.createProject = async (req, res) => {
  try {
    console.log('Creating project with data:', req.body);
    
    const { projectName, description } = req.body;

    // Validate required fields
    if (!projectName) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }

    // Check if project with same name exists
    const existingProject = await Project.findOne({ projectName });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'Project with this name already exists'
      });
    }

    // Create new project
    const project = new Project({
      projectName,
      description
    });

    const savedProject = await project.save();
    console.log('Project created successfully:', savedProject);

    res.status(201).json({
      success: true,
      data: savedProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

// Get single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { projectName, description, status } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        projectName,
        description,
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.remove();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
}; 