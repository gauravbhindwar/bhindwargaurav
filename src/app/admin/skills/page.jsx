'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Code, BookOpen, Brain, Users, Award, Plus, Search, Filter, Grid, List, Star, Zap, ExternalLink, Edit, Trash2, AlertTriangle } from 'lucide-react'

export default function AdminSkills() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [skills, setSkills] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('skill') // 'skill' or 'course'
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Languages',
    level: 'Intermediate',
    type: 'Free',
    status: 'completed',
    description: '',
    url: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const categories = ['Languages', 'Web Development', 'Data Science & ML', 'Tools & Platforms']
  const courseTypes = ['completed', 'current', 'paused', 'planned']
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

  // Filter skills based on search and category
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (skill.category && skill.category.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  // Filter courses based on search
  const filteredCourses = courses.filter(course => {
    return course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
      return
    }

    fetchData()
  }, [session, status, router])

  // ESC key handler for closing modals
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (showForm) {
          setShowForm(false)
          setEditingItem(null)
          resetForm()
        }
        if (showDeleteModal) {
          setShowDeleteModal(false)
          setItemToDelete(null)
        }
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [showForm, showDeleteModal])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/skills')
      const data = await response.json()
      
      // Extract skills from categories
      const allSkills = []
      if (data.categories) {
        data.categories.forEach(category => {
          category.skills.forEach(skill => {
            allSkills.push({ ...skill, category: category.name })
          })
        })
      }
      setSkills(allSkills)

      // Extract courses from database - all courses should now have real _id fields
      const allCourses = []
      if (data.courses) {
        Object.entries(data.courses).forEach(([type, courseList]) => {
          courseList.forEach((course) => {
            // All courses from API should now be objects with real _id from database
            if (typeof course === 'object' && course._id) {
              allCourses.push({
                ...course,
                type: course.type || type // Use course type directly
              })
            }
            // Skip any string courses as they should not exist after database migration
          })
        })
      }
      setCourses(allCourses)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // All items should now have real MongoDB IDs after database migration
      const method = editingItem ? 'PUT' : 'POST'
      
      // Prepare the payload with proper structure
      let payload
      
      if (formType === 'course') {
        // For courses, send courseType to avoid conflicts with API type
        payload = {
          type: 'course', // API operation identifier
          name: formData.name,
          courseType: formData.type, // Course type (current/completed/paused/planned)
          description: formData.description,
          url: formData.url
        }
      } else {
        // For skills
        payload = {
          type: 'skill',
          name: formData.name,
          category: formData.category,
          level: formData.level
        }
      }
      
      // If editing an existing item, include the ID
      if (editingItem && editingItem._id) {
        payload.id = editingItem._id
      }

      console.log('Submitting payload:', payload) // Debug log
      console.log('Method:', method) // Debug log

      const response = await fetch('/api/skills', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await fetchData()
        resetForm()
        setShowForm(false)
      } else {
        const error = await response.json()
        console.error('API Error:', error) // Debug log
        alert(`Error: ${error.error || 'Unknown error occurred'}`)
      }
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Error saving item')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item, type) => {
    console.log('Editing item:', item, 'Type:', type) // Debug log
    setEditingItem(item)
    setFormType(type)
    
    if (type === 'course') {
      setFormData({
        name: item.name || '',
        category: 'Languages', // Not used for courses
        level: 'Intermediate', // Not used for courses
        type: item.type || 'current',
        status: 'completed', // Not used for courses anymore
        description: item.description || '',
        url: item.url || ''
      })
    } else {
      setFormData({
        name: item.name || '',
        category: item.category || 'Languages',
        level: item.level || 'Intermediate',
        type: 'Free', // Not used for skills
        status: 'completed', // Not used for skills
        description: '',
        url: ''
      })
    }
    setShowForm(true)
  }

  const handleDelete = async (item, type) => {
    setItemToDelete({ item, type })
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    const { item, type } = itemToDelete

    try {
      console.log('Deleting item:', item, 'Type:', type) // Debug log
      
      // All items should now be from the database with real IDs
      if (!item._id) {
        alert(`Cannot delete ${type}: Missing ID`)
        return
      }
      
      // Build URL with query parameters for DELETE request
      const deleteUrl = `/api/skills?type=${encodeURIComponent(type)}&id=${encodeURIComponent(item._id)}`
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        await fetchData()
      } else {
        const error = await response.json()
        console.error('Delete API Error:', error) // Debug log
        alert(`Error: ${error.error || 'Unknown error occurred'}`)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Error deleting item')
    } finally {
      setShowDeleteModal(false)
      setItemToDelete(null)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Languages',
      level: 'Intermediate',
      type: 'Free',
      status: 'completed',
      description: '',
      url: ''
    })
    setEditingItem(null)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                    Skills & Learning Hub
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">Manage your technical skills and course portfolio</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex gap-2 bg-white rounded-lg px-3 sm:px-4 py-2 shadow-sm border border-gray-200">
                <div className="text-center">
                  <span className="text-xs sm:text-sm text-gray-500">Skills:</span>
                  <span className="ml-1 text-sm sm:text-lg font-semibold text-gray-900">{skills.length}</span>
                </div>
                <div className="w-px bg-gray-300 mx-2"></div>
                <div className="text-center">
                  <span className="text-xs sm:text-sm text-gray-500">Courses:</span>
                  <span className="ml-1 text-sm sm:text-lg font-semibold text-gray-900">{courses.length}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFormType('skill')
                    resetForm()
                    if (editingItem) {
                      setEditingItem(null)
                    } else {
                      setShowForm(!showForm)
                    }
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden xs:inline">Add Skill</span>
                  <span className="xs:hidden">Skill</span>
                </button>
                <button
                  onClick={() => {
                    setFormType('course')
                    resetForm()
                    if (editingItem) {
                      setEditingItem(null)
                    } else {
                      setShowForm(!showForm)
                    }
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden xs:inline">Add Course</span>
                  <span className="xs:hidden">Course</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search skills and courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                />
              </div>
              
              {formType === 'skill' && (
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none min-w-[140px] sm:min-w-[160px] text-sm sm:text-base"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-purple-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-purple-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Results Summary */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-600">
            <span>
              Showing {formType === 'skill' ? filteredSkills.length : filteredCourses.length} of {formType === 'skill' ? skills.length : courses.length} {formType}s
              {searchTerm && ` for "${searchTerm}"`}
              {formType === 'skill' && categoryFilter !== 'all' && ` in "${categoryFilter}"`}
            </span>
            {(searchTerm || (formType === 'skill' && categoryFilter !== 'all')) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('all')
                }}
                className="text-purple-600 hover:text-purple-800 font-medium text-left sm:text-right"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Modal Popup for Add/Edit Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 w-full sm:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slide-up">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex-shrink-0">
                    {formType === 'skill' ? <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                  </div>
                  <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">
                    {editingItem ? `Edit ${formType}` : `Add New ${formType.charAt(0).toUpperCase() + formType.slice(1)}`}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0 ml-2"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-120px)]">
            
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50/50 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Basic Information
                </h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    placeholder={`Enter ${formType} name`}
                    required
                  />
                </div>

                {formType === 'skill' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Proficiency Level</label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      >
                        {skillLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Course Type</label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        >
                          {courseTypes.map(type => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                        placeholder="Brief description of the course and what you learned..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Course URL
                      </label>
                      <input
                        type="url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="https://example.com/course"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    resetForm()
                    setShowForm(false)
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 order-1 sm:order-2"
                >
                  {loading ? 'Saving...' : (editingItem ? `Update ${formType.charAt(0).toUpperCase() + formType.slice(1)}` : `Create ${formType.charAt(0).toUpperCase() + formType.slice(1)}`)}
                </button>
              </div>
            </form>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Skills & Courses Display */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <nav className="flex">
              <button
                className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-200 ${
                  formType === 'skill'
                    ? 'border-b-2 border-purple-500 text-purple-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFormType('skill')}
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <Code className="w-4 h-4" />
                  <span>Skills ({skills.length})</span>
                </div>
              </button>
              <button
                className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-200 ${
                  formType === 'course'
                    ? 'border-b-2 border-purple-500 text-purple-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setFormType('course')}
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Courses ({courses.length})</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {formType === 'skill' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    Technical Skills
                    <span className="text-lg font-normal text-gray-500">({filteredSkills.length})</span>
                  </h3>
                </div>

                {filteredSkills.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50"></div>
                      </div>
                      <div className="relative">
                        <Code className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                          {skills.length === 0 ? 'No skills yet' : 'No matching skills'}
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          {skills.length === 0 
                            ? 'Start building your skill portfolio by adding your first technical skill.'
                            : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                          }
                        </p>
                        {skills.length === 0 && (
                          <button
                            onClick={() => {
                              setFormType('skill')
                              resetForm()
                              setShowForm(true)
                            }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                          >
                            <Plus className="w-5 h-5" />
                            Add Your First Skill
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`${viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' 
                    : 'space-y-4'
                  }`}>
                    {filteredSkills.map((skill, index) => (
                      <div
                        key={index}
                        className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1 ${
                          viewMode === 'list' ? 'flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-6' : 'p-4 sm:p-6'
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`${viewMode === 'list' ? 'flex-1 min-w-0' : 'space-y-4'}`}>
                          <div className={`flex ${viewMode === 'list' ? 'flex-col sm:flex-row sm:items-start' : 'items-start'} justify-between gap-3`}>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-200 truncate">
                                  {skill.name}
                                </h4>
                                {skill._id && (skill._id.startsWith('current_') || skill._id.startsWith('completed_')) && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                    Static
                                  </span>
                                )}
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                <span className="font-medium">Category:</span> {skill.category}
                              </p>
                              <div className="mt-2">
                                <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                                  skill.level === 'Expert' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                  skill.level === 'Advanced' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                  skill.level === 'Intermediate' ? 'bg-green-100 text-green-800 border border-green-200' :
                                  'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                }`}>
                                  {skill.level}
                                </span>
                              </div>
                            </div>
                            <div className={`flex items-center gap-2 ${viewMode === 'list' ? 'flex-shrink-0 mt-2 sm:mt-0' : 'ml-2 sm:ml-4'}`}>
                              <button
                                onClick={() => handleEdit(skill, 'skill')}
                                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              >
                                <Edit className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(skill, 'skill')}
                                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    Learning Journey
                    <span className="text-lg font-normal text-gray-500">({filteredCourses.length})</span>
                  </h3>
                </div>

                {filteredCourses.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-50"></div>
                      </div>
                      <div className="relative">
                        <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                          {courses.length === 0 ? 'No courses yet' : 'No matching courses'}
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          {courses.length === 0 
                            ? 'Document your learning journey by adding your first course.'
                            : 'Try adjusting your search terms to find what you\'re looking for.'
                          }
                        </p>
                        {courses.length === 0 && (
                          <button
                            onClick={() => {
                              setFormType('course')
                              resetForm()
                              setShowForm(true)
                            }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                          >
                            <Plus className="w-5 h-5" />
                            Add Your First Course
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {filteredCourses.map((course, index) => (
                      <div
                        key={index}
                        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1 p-4 sm:p-6"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                <h4 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-200 truncate">
                                  {course.name}
                                </h4>
                                {course._id && (course._id.startsWith('current_') || course._id.startsWith('completed_')) && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                    Static
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                                  course.type === 'Certification' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                  course.type === 'Paid' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                  'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}>
                                  {course.type}
                                </span>
                                {course.status && (
                                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                                    course.status === 'current' ? 'bg-green-100 text-green-800 border border-green-200' : 
                                    course.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                    course.status === 'paused' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                    course.status === 'planned' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                                    'bg-gray-100 text-gray-800 border border-gray-200'
                                  }`}>
                                    {course.status === 'current' ? 'In Progress' : 
                                     course.status === 'completed' ? 'Completed' :
                                     course.status === 'paused' ? 'Paused' :
                                     course.status === 'planned' ? 'Planned' :
                                     course.status}
                                  </span>
                                )}
                              </div>
                            </div>
                            {course.description && (
                              <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">
                                {course.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm">
                              {course.url && (
                                <a
                                  href={course.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors duration-200"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  <span className="hidden sm:inline">View Course</span>
                                  <span className="sm:hidden">View</span>
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleEdit(course, 'course')}
                              className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                              <Edit className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(course, 'course')}
                              className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete {itemToDelete.type === 'skill' ? 'Skill' : 'Course'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete the {itemToDelete.type} <span className="font-semibold">"{itemToDelete.item.name || itemToDelete.item.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setItemToDelete(null)
                  }}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
