const Project = require('../models/Project');
const logActivity = require('../middleware/Logger'); // Ensure correct path

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { projectName, description, username } = req.body;

    if (!projectName) {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    // Check if project with same name exists
    const existingProject = await Project.findOne({ projectName });
    if (existingProject) {
      return res.status(400).json({ success: false, message: 'Project with this name already exists' });
    }

    // Generate unique projectId
    let projectId;
    let isDuplicate = true;
    while (isDuplicate) {
      const count = await Project.countDocuments();
      projectId = `PRJ${String(count + 1).padStart(4, '0')}`;
      const existingProjectId = await Project.findOne({ projectId });
      if (!existingProjectId) {
        isDuplicate = false;
      }
    }

    // Create and save new project
    const project = await Project.create({ projectName, description, projectId });

    // Log activity
    await logActivity('Project', `Created Project: ${projectName}`, 'Project', username);

    res.status(201).json({ success: true, data: project, message: 'Project created successfully' });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: 'Failed to create project', error: error.message });
  }
};

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.json({ success: true, data: projects, message: 'Projects fetched successfully' });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Error fetching projects', error: error.message });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project, message: 'Project fetched successfully' });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, message: 'Error fetching project', error: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { projectName, description, status, username } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { projectName, description, status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Log activity
    await logActivity('Project', `Updated Project: ${projectName}`, 'Project', username);

    res.json({ success: true, data: project, message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: 'Error updating project', error: error.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { username } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.deleteOne();

    // Log activity
    await logActivity('Project', `Deleted Project: ${project.projectName}`, 'Project', username);

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Error deleting project', error: error.message });
  }
};