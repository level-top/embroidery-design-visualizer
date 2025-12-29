import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const CATEGORIES = [
  { value: 'bridal', label: 'Bridal' },
  { value: 'casual', label: 'Casual' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'party', label: 'Party' },
  { value: 'kids', label: 'Kids' },
  { value: 'girls', label: 'Girls' },
];

const DRESS_TYPES = [
  { value: 'lehenga', label: 'Lehenga' },
  { value: 'saree', label: 'Saree' },
  { value: 'salwar-kameez', label: 'Salwar Kameez' },
  { value: 'gown', label: 'Gown' },
  { value: 'kurti', label: 'Kurti' },
  { value: 'anarkali', label: 'Anarkali' },
  { value: 'other', label: 'Other' },
];

const ModelsPage = () => {
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    dressType: '',
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch models on component mount
  useEffect(() => {
    fetchModels();
  }, []);

  // Filter models when category or models change
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredModels(models);
    } else {
      setFilteredModels(models.filter(model => model.category === selectedCategory));
    }
  }, [selectedCategory, models]);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/models');
      if (!response.ok) throw new Error('Failed to fetch models');
      const data = await response.json();
      setModels(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching models:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setError(null);
    setSuccess(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: '',
      category: '',
      dressType: '',
      imageFile: null,
    });
    setImagePreview(null);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        imageFile: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleUploadModel = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.category || !formData.dressType || !formData.imageFile) {
      setError('Please fill in all fields and select an image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const uploadData = new FormData();
      uploadData.append('name', formData.name);
      uploadData.append('category', formData.category);
      uploadData.append('dressType', formData.dressType);
      uploadData.append('image', formData.imageFile);

      const response = await fetch('/api/models', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload model');
      }

      const newModel = await response.json();
      setModels(prev => [...prev, newModel]);
      setSuccess('Model uploaded successfully!');
      
      // Close dialog after a short delay
      setTimeout(() => {
        handleCloseDialog();
      }, 1500);
    } catch (err) {
      setError(err.message);
      console.error('Error uploading model:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModel = async (modelId) => {
    if (!window.confirm('Are you sure you want to delete this model?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/models/${modelId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete model');
      }

      setModels(prev => prev.filter(model => model.id !== modelId));
      setSuccess('Model deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting model:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const getCategoryLabel = (value) => {
    const category = CATEGORIES.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  const getDressTypeLabel = (value) => {
    const dressType = DRESS_TYPES.find(type => type.value === value);
    return dressType ? dressType.label : value;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dress Models
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Upload Model
          </Button>
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <FilterIcon sx={{ mr: 1 }} />
            <Chip
              label="All"
              color={selectedCategory === 'all' ? 'primary' : 'default'}
              onClick={() => handleCategoryFilter('all')}
              sx={{ m: 0.5 }}
            />
            {CATEGORIES.map((category) => (
              <Chip
                key={category.value}
                label={category.label}
                color={selectedCategory === category.value ? 'primary' : 'default'}
                onClick={() => handleCategoryFilter(category.value)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Loading Indicator */}
        {loading && !openDialog && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Models Grid */}
        <Grid container spacing={3}>
          {filteredModels.length === 0 && !loading ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No models found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {selectedCategory === 'all'
                    ? 'Upload your first model to get started'
                    : 'No models in this category'}
                </Typography>
              </Box>
            </Grid>
          ) : (
            filteredModels.map((model) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={model.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={model.imageUrl || '/placeholder-dress.jpg'}
                    alt={model.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {model.name}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Chip
                        label={getCategoryLabel(model.category)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={getDressTypeLabel(model.dressType)}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteModel(model.id)}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* Upload Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleUploadModel}>
          <DialogTitle>Upload New Model</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Model Name"
              type="text"
              fullWidth
              required
              value={formData.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                label="Category"
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel>Dress Type</InputLabel>
              <Select
                name="dressType"
                value={formData.dressType}
                onChange={handleInputChange}
                label="Dress Type"
              >
                {DRESS_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
            >
              Select Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {imagePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Image Preview:
                </Typography>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ModelsPage;
