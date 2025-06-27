'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FolderOpen, ExternalLink, Github, Eye, Edit, Trash2, Plus, Search, Filter, Grid, List, Star, Calendar, Code, Zap } from 'lucide-react'
import { isValidImageUrl, preloadImage, optimizeImageUrl } from '@/utils/imageOptimization'

export default function AdminProjects() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    image: '',
    tech: [], // Changed from 'technologies' to 'tech' to match the data structure
    features: [], // Added features array
    githubUrl: '',
    liveUrl: '',
    status: 'completed',
    featured: false,
    order: 0
  })
  // For the text input of technologies
  const [technologiesInput, setTechnologiesInput] = useState('')
  // For the text input of features
  const [featuresInput, setFeaturesInput] = useState('')
  const [techInputError, setTechInputError] = useState('')
  const [featuresInputError, setFeaturesInputError] = useState('')
  // Track which project's features are expanded
  const [expandedFeatures, setExpandedFeatures] = useState({})
  // Track image loading states
  const [imageLoadingStates, setImageLoadingStates] = useState({})
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.tech && project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())))
    
    const projectStatus = project.status || 'completed'
    const matchesStatus = statusFilter === 'all' || projectStatus === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const statusOptions = ['completed', 'in-progress', 'planned']
  // Keep technology options as reference for suggestions or validation if needed
  const technologyOptions = ['React', 'Next.js', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Express.js', 'Vue.js', 'Angular', 'PHP', 'Laravel', 'Django', 'Flask', 'Docker', 'AWS', 'Vercel', 'Heroku']

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
      return
    }

    fetchProjects()
  }, [session, status, router])

  // Toggle features expansion for a specific project
  const toggleFeatures = (projectId) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }))
  }

  // Image handling functions
  const validateImageUrl = (url) => {
    return isValidImageUrl(url)
  }

  const handleImageChange = async (e) => {
    const { value } = e.target
    
    // Update form data immediately
    setFormData(prev => ({
      ...prev,
      image: value
    }))

    // Clear preview if empty
    if (!value) {
      setImagePreviewUrl('')
      return
    }

    // Validate URL format
    if (!validateImageUrl(value)) {
      setImagePreviewUrl('')
      return
    }

    // Try to preload the image with optimization
    try {
      const result = await preloadImage(value, { 
        timeout: 8000,
        width: 400, // Optimize for preview size
        quality: 85 
      })
      if (result) {
        setImagePreviewUrl(value)
      }
    } catch (error) {
      console.warn('Image preload failed:', error)
      setImagePreviewUrl('')
    }
  }

  const handleImageLoad = (projectId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [projectId]: false
    }))
  }

  const handleImageLoadStart = (projectId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [projectId]: true
    }))
  }

  const fetchProjects = async () => {
    try {
      setLoading(true)
      
      // Add cache-busting parameter for fresh data after updates
      const timestamp = Date.now()
      const response = await fetch(`/api/projects?_t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.projects && Array.isArray(data.projects)) {
        setProjects(data.projects)
        
        // Pre-initialize image loading states for all projects
        const initialLoadingStates = {}
        data.projects.forEach(project => {
          if (project.image) {
            initialLoadingStates[project.id] = false
          }
        })
        setImageLoadingStates(initialLoadingStates)
      } else {
        console.warn('Invalid projects data received:', data)
        setProjects([])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Don't clear existing projects on error to maintain UI state
      if (projects.length === 0) {
        setProjects([])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Special handling for image input with preloading
    if (name === 'image') {
      handleImageChange(e)
      return
    }
    
    // Special handling for technologies input
    if (name === 'tech') {
      // Always update the input field value
      setTechnologiesInput(value)
      
      try {
        // Process the comma-separated string into an array
        const techArray = value
          .split(',')
          .map(tech => tech.trim())
          .filter(tech => tech !== '')
        
        // Update the formData state with the processed array
        setFormData(prev => ({
          ...prev,
          tech: techArray // Changed from 'technologies' to 'tech'
        }))
        
        // Clear any previous errors if we successfully parsed the input
        setTechInputError('')
      } catch (error) {
        console.error('Error processing technologies input:', error)
        setTechInputError('Could not process technologies. Please check your format.')
      }
    } 
    // Special handling for features input
    else if (name === 'features') {
      // Always update the input field value
      setFeaturesInput(value)
      
      try {
        // Process the newline-separated string into an array
        const featuresArray = value
          .split('\n')
          .map(feature => feature.trim())
          .filter(feature => feature !== '')
        
        // Update the formData state with the processed array
        setFormData(prev => ({
          ...prev,
          features: featuresArray
        }))
        
        // Clear any previous errors if we successfully parsed the input
        setFeaturesInputError('')
      } catch (error) {
        console.error('Error processing features input:', error)
        setFeaturesInputError('Could not process features. Please check your format.')
      }
    } else {
      // Standard handling for other inputs
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate image URL if provided
    if (formData.image && !validateImageUrl(formData.image)) {
      alert('Please enter a valid image URL (jpg, jpeg, png, gif, webp, svg)')
      setLoading(false)
      return
    }

    // No need to validate if technologies is empty - it's optional
    if (technologiesInput.trim() !== '' && formData.tech.length === 0) {
      // Only show error if they typed something but parsing failed
      setTechInputError('Please check your technologies format (comma-separated values)')
      setLoading(false)
      return
    } else {
      setTechInputError('')
    }

    try {
      const method = editingProject ? 'PUT' : 'POST'
      const payload = editingProject 
        ? { ...formData, _id: editingProject._id }
        : formData

      // If updating and image changed, preload the new image
      if (editingProject && formData.image && formData.image !== editingProject.image) {
        try {
          await preloadImage(formData.image, { 
            timeout: 8000,
            width: 400,
            quality: 85 
          })
        } catch (imageError) {
          console.warn('New image failed to preload, but continuing with update:', imageError)
        }
      }

      const response = await fetch('/api/projects', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Project saved successfully:', result)
        
        // Fetch fresh data from server
        await fetchProjects()
        resetForm()
        setShowForm(false)
      } else {
        const error = await response.json()
        console.error('Server error:', error)
        alert(`Error: ${error.error || 'Unknown error occurred'}`)
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error saving project. Please check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (project) => {
    console.log('handleEdit called with project:', project)
    console.log('Project tech field:', project.tech)
    console.log('Project features field:', project.features)
    
    setEditingProject(project)
    
    // Clear any previous error states
    setTechInputError('')
    setFeaturesInputError('')
    
    // Ensure tech and features are arrays, even if not present in the project data
    const technologies = Array.isArray(project.tech) ? project.tech : []
    const features = Array.isArray(project.features) ? project.features : []
    
    // Set image preview if available
    setImagePreviewUrl(project.image || '')
    
    // First set the form data with all project values
    setFormData({
      id: project.id || '',
      title: project.title || '',
      description: project.description || '',
      image: project.image || '',
      tech: technologies, // Changed from 'technologies' to 'tech'
      features: features, // Added features array
      githubUrl: project.github || '', // Note: projects.json uses 'github' not 'githubUrl'
      liveUrl: project.live || '', // Note: projects.json uses 'live' not 'liveUrl'
      status: project.status || 'completed', // Provide default status
      featured: project.preview || false, // Note: projects.json uses 'preview' not 'featured'
      order: project.order || 0
    })
    
    // Explicitly set the technologies input field
    // Convert array to comma-separated string
    const techString = technologies.join(', ')
    setTechnologiesInput(techString)
    
    // Explicitly set the features input field
    // Convert array to newline-separated string
    const featuresString = features.join('\n')
    setFeaturesInput(featuresString)
    
    console.log('Technologies string set to:', techString)
    console.log('Features string set to:', featuresString)
    
    // Show the form after setting all values
    setShowForm(true)
  }

  const handleDelete = async (project) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/projects?id=${project._id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchProjects()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting project')
    }
  }

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      image: '',
      tech: [], // Changed from 'technologies' to 'tech'
      features: [], // Added features array
      githubUrl: '',
      liveUrl: '',
      status: 'completed',
      featured: false,
      order: 0
    })
    setTechnologiesInput('') // Reset technologies input
    setFeaturesInput('') // Reset features input
    setTechInputError('') // Clear any error messages
    setFeaturesInputError('') // Clear any error messages
    setImagePreviewUrl('') // Clear image preview
    setEditingProject(null)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Project Management
                  </h1>
                  <p className="text-gray-600">Build, organize, and showcase your portfolio</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                <span className="text-sm text-gray-500">Total Projects:</span>
                <span className="ml-2 text-lg font-semibold text-gray-900">{projects.length}</span>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  if (editingProject) {
                    setEditingProject(null);
                  } else {
                    setShowForm(!showForm);
                  }
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-[140px]"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="planned">Planned</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredProjects.length} of {projects.length} projects
              {searchTerm && ` for "${searchTerm}"`}
              {statusFilter !== 'all' && ` with status "${statusFilter}"`}
            </span>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Modal Popup for Add/Edit Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-up">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {editingProject ? 'Edit Project' : 'Create New Project'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="bg-gray-50/50 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Project ID *</label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="unique-project-id"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Project Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Amazing Project Name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Brief description that captures the essence of your project..."
                    required
                  />
                </div>
              </div>

              {/* Media & Status Section */}
              <div className="bg-gray-50/50 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Media & Status
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Preview Image</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className={`w-full border rounded-xl px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        formData.image && !validateImageUrl(formData.image) 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="https://example.com/project-image.png"
                    />
                    {formData.image && !validateImageUrl(formData.image) && (
                      <p className="text-sm text-red-600">Please enter a valid image URL (jpg, jpeg, png, gif, webp, svg)</p>
                    )}
                    {imagePreviewUrl && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
                          <img
                            src={optimizeImageUrl(imagePreviewUrl, { width: 300, height: 150, quality: 90 })}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onLoad={() => console.log('Preview image loaded')}
                            onError={() => {
                              console.log('Preview image failed to load')
                              setImagePreviewUrl('')
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Project Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Links Section */}
              <div className="bg-gray-50/50 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Project Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      GitHub Repository
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </label>
                    <input
                      type="url"
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://your-awesome-project.com"
                    />
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="bg-gray-50/50 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Display Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Display Order</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Featured Project
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Technologies Section */}
              <div className="bg-gray-50/50 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Technologies Used
                </h3>

                <div className="space-y-4">
                  <textarea
                    name="tech"
                    value={technologiesInput}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full border ${techInputError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'} rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none`}
                    placeholder="React, Next.js, Tailwind CSS, Node.js, MongoDB"
                  />
                  {techInputError ? (
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{techInputError}</p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Enter technologies separated by commas</p>
                      {formData.tech.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tech.map((tech, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Features Section */}
              <div className="bg-gray-50/50 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Key Features
                </h3>

                <div className="space-y-4">
                  <textarea
                    name="features"
                    value={featuresInput}
                    onChange={handleInputChange}
                    rows={8}
                    className={`w-full border ${featuresInputError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'} rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none`}
                    placeholder="Responsive design optimized for all devices&#10;Real-time data synchronization&#10;Advanced search and filtering&#10;User authentication and authorization&#10;Interactive dashboard with analytics"
                  />
                  {featuresInputError ? (
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{featuresInputError}</p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Enter each feature on a separate line</p>
                      {formData.features.length > 0 && (
                        <div className="bg-white rounded-lg p-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Features Preview:</p>
                          <ul className="space-y-2">
                            {formData.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <Zap className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    resetForm()
                    setShowForm(false)
                  }}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                </button>
              </div>
            </form>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Projects Display */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                Your Projects
                <span className="text-lg font-normal text-gray-500">({filteredProjects.length})</span>
              </h3>
            </div>
          </div>

          <div className="p-8">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-50"></div>
                  </div>
                  <div className="relative">
                    <FolderOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      {projects.length === 0 ? 'No projects yet' : 'No matching projects'}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {projects.length === 0 
                        ? 'Start building your portfolio by creating your first project.'
                        : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                      }
                    </p>
                    {projects.length === 0 && (
                      <button
                        onClick={() => {
                          resetForm();
                          setShowForm(true);
                        }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        <Plus className="w-5 h-5" />
                        Create Your First Project
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${viewMode === 'grid' 
                ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' 
                : 'space-y-6'
              }`}>
                {filteredProjects.map((project, index) => (
                  <div
                    key={project._id}
                    className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 ${
                      viewMode === 'list' ? 'flex gap-6 p-6' : 'overflow-hidden'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        {/* Project Image */}
                        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          {project.image ? (
                            <>
                              {/* Loading indicator */}
                              {imageLoadingStates[project.id] && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                              )}
                              <img
                                src={optimizeImageUrl(project.image, { width: 400, height: 300, quality: 85 })}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                                onLoadStart={() => handleImageLoadStart(project.id)}
                                onLoad={() => handleImageLoad(project.id)}
                                onError={(e) => {
                                  console.warn(`Failed to load image for project ${project.id}:`, project.image)
                                  e.target.style.display = 'none'
                                  handleImageLoad(project.id)
                                }}
                                style={{
                                  imageRendering: 'auto',
                                  imageRendering: '-webkit-optimize-contrast',
                                }}
                              />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Code className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                          {project.preview && (
                            <div className="absolute top-4 left-4">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                <Star className="w-3 h-3" />
                                Featured
                              </span>
                            </div>
                          )}
                          <div className="absolute top-4 right-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              (project.status || 'completed') === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                              (project.status || 'completed') === 'in-progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                              {(project.status || 'completed') === 'in-progress' ? 'In Progress' : (project.status || 'completed').charAt(0).toUpperCase() + (project.status || 'completed').slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* Project Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                              {project.title}
                            </h4>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {project.description}
                            </p>

                            {/* Technologies */}
                            {project.tech && project.tech.length > 0 && (
                              <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                  {project.tech.slice(0, 4).map((tech, techIndex) => (
                                    <span
                                      key={techIndex}
                                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                  {project.tech.length > 4 && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                      +{project.tech.length - 4} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Key Features Preview */}
                            {project.features && project.features.length > 0 && (
                              <div className="mb-4">
                                <div className="space-y-1">
                                  {project.features.slice(0, 2).map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-start gap-2 text-sm text-gray-600">
                                      <Zap className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                                      <span className="line-clamp-1">{feature}</span>
                                    </div>
                                  ))}
                                  {project.features.length > 2 && (
                                    <p className="text-xs text-gray-500 ml-5">
                                      +{project.features.length - 2} more features
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                              {project.github && (
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                                >
                                  <Github className="w-4 h-4" />
                                  <span className="hidden sm:inline">Code</span>
                                </a>
                              )}
                              {project.live && project.live !== '#' && (
                                <a
                                  href={project.live}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm transition-colors duration-200"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  <span className="hidden sm:inline">Demo</span>
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(project)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(project)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* List View */
                      <>
                        {/* Project Image - List View */}
                        <div className="relative w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                          {project.image ? (
                            <>
                              {/* Loading indicator - List View */}
                              {imageLoadingStates[project.id] && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                </div>
                              )}
                              <img
                                src={optimizeImageUrl(project.image, { width: 150, height: 150, quality: 85 })}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                                onLoadStart={() => handleImageLoadStart(project.id)}
                                onLoad={() => handleImageLoad(project.id)}
                                onError={(e) => {
                                  console.warn(`Failed to load image for project ${project.id}:`, project.image)
                                  e.target.style.display = 'none'
                                  handleImageLoad(project.id)
                                }}
                                style={{
                                  imageRendering: 'auto',
                                  imageRendering: '-webkit-optimize-contrast',
                                }}
                              />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Code className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Project Content - List View */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                {project.title}
                              </h4>
                              {project.preview && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                  <Star className="w-3 h-3" />
                                  Featured
                                </span>
                              )}
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                (project.status || 'completed') === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                                (project.status || 'completed') === 'in-progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}>
                                {(project.status || 'completed') === 'in-progress' ? 'In Progress' : (project.status || 'completed').charAt(0).toUpperCase() + (project.status || 'completed').slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(project)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(project)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Technologies - List View */}
                          {project.tech && project.tech.length > 0 && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1">
                                {project.tech.slice(0, 6).map((tech, techIndex) => (
                                  <span
                                    key={techIndex}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {project.tech.length > 6 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                    +{project.tech.length - 6}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Features - List View */}
                          {project.features && project.features.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-medium text-gray-900">Key Features:</h5>
                                {project.features.length > 3 && (
                                  <button
                                    onClick={() => toggleFeatures(project.id || project._id)}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                  >
                                    {expandedFeatures[project.id || project._id] ? 'Show Less' : `View All ${project.features.length}`}
                                  </button>
                                )}
                              </div>
                              <div className="space-y-1">
                                {(expandedFeatures[project.id || project._id] ? project.features : project.features.slice(0, 3)).map((feature, featureIndex) => (
                                  <div key={featureIndex} className="flex items-start gap-2 text-sm text-gray-600">
                                    <Zap className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Links - List View */}
                          <div className="flex items-center gap-4 text-sm">
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                              >
                                <Github className="w-4 h-4" />
                                GitHub
                              </a>
                            )}
                            {project.live && project.live !== '#' && (
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
