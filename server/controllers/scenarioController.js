const Scenario = require('../models/Scenario');
const Module = require('../models/Module');
const mongoose = require('mongoose');

exports.createScenario = async (req, res) => {
  try {
    console.log('Creating scenario with data:', req.body);
    
    const { moduleId, scenarioName, description, priority, status } = req.body;

    // Validate moduleId
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid module ID format'
      });
    }

    // Check if module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: `Module not found with id: ${moduleId}`
      });
    }

    const scenario = new Scenario({
      moduleId,
      scenarioName,
      description,
      priority,
      status
    });

    const savedScenario = await scenario.save();
    
    // Update module's scenarios count
    await Module.findByIdAndUpdate(moduleId, {
      $inc: { scenariosCount: 1 }
    });

    console.log('Scenario created successfully:', savedScenario);

    res.status(201).json({
      success: true,
      data: savedScenario
    });
  } catch (error) {
    console.error('Error in createScenario:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create scenario',
      error: error.message
    });
  }
};

exports.getScenarios = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const scenarios = await Scenario.find({ moduleId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: scenarios
    });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scenarios',
      error: error.message
    });
  }
};

exports.getScenarioById = async (req, res) => {
  try {
    const scenario = await Scenario.findById(req.params.id);
    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }

    res.json({
      success: true,
      data: scenario
    });
  } catch (error) {
    console.error('Error fetching scenario:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scenario',
      error: error.message
    });
  }
};

exports.updateScenario = async (req, res) => {
  try {
    const { scenarioName, description, priority, status } = req.body;
    const scenario = await Scenario.findByIdAndUpdate(
      req.params.id,
      {
        scenarioName,
        description,
        priority,
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }

    res.json({
      success: true,
      data: scenario
    });
  } catch (error) {
    console.error('Error updating scenario:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating scenario',
      error: error.message
    });
  }
};

exports.deleteScenario = async (req, res) => {
  try {
    const scenario = await Scenario.findById(req.params.id);
    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }

    const moduleId = scenario.moduleId;

    await scenario.remove();

    // Update module's scenarios count
    await Module.findByIdAndUpdate(moduleId, {
      $inc: { scenariosCount: -1 }
    });

    res.json({
      success: true,
      message: 'Scenario deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scenario:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting scenario',
      error: error.message
    });
  }
}; 