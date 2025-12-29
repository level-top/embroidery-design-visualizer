import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fabric } from 'fabric';
import { toast } from 'react-toastify';
import {
  FaUndo,
  FaTrash,
  FaSave,
  FaDownload,
  FaPlus,
  FaImage,
  FaTshirt,
} from 'react-icons/fa';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  getDesigns,
  getModels,
} from '../services/api';

const EditorPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  // Canvas reference
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  
  // State management
  const [canvas, setCanvas] = useState(null);
  const [projects, setProjects] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [models, setModels] = useState([]);
  const [canvasHistory, setCanvasHistory] = useState([]);
  
  // Project metadata state
  const [projectName, setProjectName] = useState('New Project');
  const [projectStatus, setProjectStatus] = useState('draft');
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const fabricCanvas = new fabric.Canvas('canvas', {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
      });

      fabricCanvas.on('selection:created', handleObjectSelection);
      fabricCanvas.on('selection:updated', handleObjectSelection);
      fabricCanvas.on('selection:cleared', () => setSelectedObject(null));
      fabricCanvas.on('object:modified', saveCanvasState);

      fabricCanvasRef.current = fabricCanvas;
      setCanvas(fabricCanvas);
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  // Load project data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchDesigns(),
          fetchModels(),
          loadProject(),
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load editor data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  // Load project
  const loadProject = async () => {
    if (!projectId || projectId === 'new') {
      setProjectName('New Project');
      setProjectStatus('draft');
      return;
    }

    try {
      const project = await getProjectById(projectId);
      setProjectName(project.name || 'Untitled Project');
      setProjectStatus(project.status || 'draft');
      
      if (project.canvasData && fabricCanvasRef.current) {
        fabricCanvasRef.current.loadFromJSON(project.canvasData, () => {
          fabricCanvasRef.current.renderAll();
          saveCanvasState();
        });
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
    }
  };

  // Fetch designs from API
  const fetchDesigns = async () => {
    try {
      const designsData = await getDesigns();
      setDesigns(designsData);
    } catch (error) {
      console.error('Error fetching designs:', error);
      toast.error('Failed to load designs');
    }
  };

  // Fetch models from API
  const fetchModels = async () => {
    try {
      const modelsData = await getModels();
      setModels(modelsData);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to load models');
    }
  };

  // Handle object selection on canvas
  const handleObjectSelection = (e) => {
    const selected = e.selected?.[0];
    setSelectedObject(selected || null);
  };

  // Save canvas state for undo functionality
  const saveCanvasState = () => {
    if (!fabricCanvasRef.current) return;
    
    const json = JSON.stringify(fabricCanvasRef.current.toJSON());
    setCanvasHistory((prev) => [...prev.slice(-19), json]);
  };

  // Load model onto canvas
  const loadModelOnCanvas = (model) => {
    if (!fabricCanvasRef.current) return;

    fabric.Image.fromURL(
      model.imageUrl || model.image,
      (img) => {
        img.set({
          left: 100,
          top: 100,
          selectable: true,
          hasControls: true,
        });

        img.scaleToWidth(400);
        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.setActiveObject(img);
        fabricCanvasRef.current.renderAll();
        saveCanvasState();
        
        setSelectedModel(model);
        toast.success(`Model "${model.name}" added to canvas`);
      },
      { crossOrigin: 'anonymous' }
    );
  };

  // Add design to canvas
  const addDesignToCanvas = (design) => {
    if (!fabricCanvasRef.current) return;

    fabric.Image.fromURL(
      design.imageUrl || design.image,
      (img) => {
        img.set({
          left: 300,
          top: 200,
          selectable: true,
          hasControls: true,
        });

        img.scaleToWidth(200);
        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.setActiveObject(img);
        fabricCanvasRef.current.renderAll();
        saveCanvasState();
        
        toast.success(`Design "${design.name}" added to canvas`);
      },
      { crossOrigin: 'anonymous' }
    );
  };

  // Delete selected object
  const deleteSelectedObject = () => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      fabricCanvasRef.current.renderAll();
      saveCanvasState();
      setSelectedObject(null);
      toast.success('Object deleted');
    } else {
      toast.warning('No object selected');
    }
  };

  // Undo functionality
  const undoLastAction = () => {
    if (canvasHistory.length <= 1) {
      toast.warning('Nothing to undo');
      return;
    }

    const newHistory = [...canvasHistory];
    newHistory.pop(); // Remove current state
    const previousState = newHistory[newHistory.length - 1];

    if (previousState && fabricCanvasRef.current) {
      fabricCanvasRef.current.loadFromJSON(previousState, () => {
        fabricCanvasRef.current.renderAll();
        setCanvasHistory(newHistory);
        toast.success('Undo successful');
      });
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return;

    if (window.confirm('Are you sure you want to clear the entire canvas?')) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = '#ffffff';
      fabricCanvasRef.current.renderAll();
      saveCanvasState();
      setSelectedObject(null);
      setSelectedModel(null);
      toast.success('Canvas cleared');
    }
  };

  // Save project
  const saveProject = async () => {
    if (!fabricCanvasRef.current) return;

    try {
      setSaving(true);
      const canvasData = fabricCanvasRef.current.toJSON();

      const projectData = {
        name: projectName,
        status: projectStatus,
        canvasData: canvasData,
        updatedAt: new Date().toISOString(),
      };

      if (projectId && projectId !== 'new') {
        await updateProject(projectId, projectData);
        toast.success('Project saved successfully');
      } else {
        const newProject = await createProject(projectData);
        toast.success('Project created successfully');
        navigate(`/editor/${newProject.id}`, { replace: true });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  // Download canvas as image
  const downloadImage = () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });

    const link = document.createElement('a');
    link.download = `${projectName.replace(/\s+/g, '_')}_${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Image downloaded successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Toolbar */}
      <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold w-64"
            placeholder="Project Name"
          />
          
          <select
            value={projectStatus}
            onChange={(e) => setProjectStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={undoLastAction}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            title="Undo"
          >
            <FaUndo />
            <span>Undo</span>
          </button>

          <button
            onClick={clearCanvas}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            title="Clear Canvas"
          >
            <FaTrash />
            <span>Clear</span>
          </button>

          <button
            onClick={downloadImage}
            className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            title="Download Image"
          >
            <FaDownload />
            <span>Download</span>
          </button>

          <button
            onClick={saveProject}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            title="Save Project"
          >
            <FaSave />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Designs and Models */}
        <div className="w-64 bg-white shadow-lg overflow-y-auto">
          {/* Designs Section */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <FaImage className="mr-2 text-purple-600" />
              Designs
            </h3>
            <div className="space-y-2">
              {designs.length > 0 ? (
                designs.map((design) => (
                  <div
                    key={design.id}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors"
                    onClick={() => addDesignToCanvas(design)}
                  >
                    {design.imageUrl && (
                      <img
                        src={design.imageUrl}
                        alt={design.name}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                    )}
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {design.name}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No designs available</p>
              )}
            </div>
          </div>

          {/* Models Section */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <FaTshirt className="mr-2 text-blue-600" />
              Models
            </h3>
            <div className="space-y-2">
              {models.length > 0 ? (
                models.map((model) => (
                  <div
                    key={model.id}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onClick={() => loadModelOnCanvas(model)}
                  >
                    {model.imageUrl && (
                      <img
                        src={model.imageUrl}
                        alt={model.name}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                    )}
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {model.name}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No models available</p>
              )}
            </div>
          </div>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-gray-50">
          <div className="bg-white shadow-xl rounded-lg p-4">
            <canvas id="canvas" ref={canvasRef} />
          </div>
        </div>

        {/* Right Sidebar - Project Details and Selected Object Info */}
        <div className="w-72 bg-white shadow-lg overflow-y-auto">
          {/* Project Details */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Project Details
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">Name:</span>
                <p className="text-gray-800">{projectName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <p className="text-gray-800 capitalize">{projectStatus}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Canvas Size:</span>
                <p className="text-gray-800">800 x 600 px</p>
              </div>
            </div>
          </div>

          {/* Selected Model Info */}
          {selectedModel && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Current Model
              </h3>
              <div className="space-y-2">
                {selectedModel.imageUrl && (
                  <img
                    src={selectedModel.imageUrl}
                    alt={selectedModel.name}
                    className="w-full h-32 object-cover rounded"
                  />
                )}
                <p className="text-sm font-medium text-gray-700">
                  {selectedModel.name}
                </p>
                {selectedModel.description && (
                  <p className="text-xs text-gray-600">
                    {selectedModel.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Selected Object Info */}
          {selectedObject && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Selected Object
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Type:</span>
                  <p className="text-gray-800 capitalize">{selectedObject.type}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Position:</span>
                  <p className="text-gray-800">
                    X: {Math.round(selectedObject.left)}, Y: {Math.round(selectedObject.top)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Size:</span>
                  <p className="text-gray-800">
                    W: {Math.round(selectedObject.width * selectedObject.scaleX)}, 
                    H: {Math.round(selectedObject.height * selectedObject.scaleY)}
                  </p>
                </div>
                <button
                  onClick={deleteSelectedObject}
                  className="w-full mt-3 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaTrash />
                  <span>Delete Object</span>
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Instructions
            </h3>
            <ul className="text-xs text-gray-600 space-y-2">
              <li>• Click on designs or models to add them to the canvas</li>
              <li>• Drag objects to reposition them</li>
              <li>• Use corner handles to resize objects</li>
              <li>• Select an object and click Delete to remove it</li>
              <li>• Use Undo to revert the last action</li>
              <li>• Save your project regularly</li>
              <li>• Download the final design as PNG</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
