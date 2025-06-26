'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminProjects() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    longDescription: '',
    image: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    status: 'completed',
    featured: false,
    order: 0
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
      return
    }

    fetchProjects()
  }, [session, status, router])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleTechnologiesChange = (e) => {
    const value = e.target.value
    const technologies = value.split(',').map(tech => tech.trim()).filter(tech => tech)
    setFormData(prev => ({
      ...prev,
      technologies
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = '/api/projects'
      const method = editingProject ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchProjects()
        resetForm()
        setShowForm(false)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error saving project')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      id: project.id,
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || '',
      image: project.image || '',
      technologies: project.technologies || [],
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      status: project.status || 'completed',
      featured: project.featured || false,
      order: project.order || 0
    })
    setShowForm(true)
  }

  const handleDelete = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
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
      longDescription: '',
      image: '',
      technologies: [],
      githubUrl: '',
      liveUrl: '',
      status: 'completed',
      featured: false,
      order: 0
    })
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="admin-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Projects</h1>
              <p className="text-gray-600 mt-1">Add, edit, and delete your portfolio projects</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="admin-btn-primary"
              >
                {showForm ? 'Cancel' : 'Add Project'}
              </button>
              <Link
                href="/admin/dashboard"
                className="admin-btn-secondary"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="px-4 py-6 sm:px-0">
          {/* Add/Edit Form */}
          {showForm && (
            <div className="admin-card p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <form onSubmit={handleSubmit} className="admin-form-section">
                <div className="admin-form-grid">
                  <div>
                    <label className="admin-form-label">Project ID</label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      disabled={editingProject}
                      className="admin-form-input"
                      placeholder="e.g., project-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="Enter project title"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="admin-form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="admin-form-textarea"
                    placeholder="Brief description of the project"
                    required
                  />
                </div>

                <div>
                  <label className="admin-form-label">Long Description</label>
                  <textarea
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="admin-form-textarea"
                    placeholder="Detailed description of the project"
                  />
                </div>

                <div className="admin-form-grid">
                  <div>
                    <label className="admin-form-label">Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Technologies (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.technologies.join(', ')}
                      onChange={handleTechnologiesChange}
                      className="admin-form-input"
                      placeholder="React, Node.js, MongoDB, TypeScript"
                    />
                  </div>
                </div>

                <div className="admin-form-grid">
                  <div>
                    <label className="admin-form-label">GitHub URL</label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Live URL</label>
                    <input
                      type="url"
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="https://project-demo.com"
                    />
                  </div>
                </div>

                <div className="admin-form-grid-3">
                  <div>
                    <label className="admin-form-label">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="admin-form-select"
                    >
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="planned">Planned</option>
                    </select>
                  </div>
                  <div>
                    <label className="admin-form-label">Order</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="admin-form-input"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center pt-8">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="admin-form-checkbox"
                    />
                    <label className="ml-3 text-sm font-medium text-gray-700">Featured Project</label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm()
                      setShowForm(false)
                    }}
                    className="admin-btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="admin-btn-primary"
                  >
                    {loading ? 'Saving...' : (editingProject ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Projects List */}
          <div className="admin-card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Projects ({projects.length})
              </h3>
              {projects.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No projects found. Add your first project!</p>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {project.technologies?.map((tech, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
                            <span className="flex items-center">
                              <span className="font-medium">Status:</span>
                              <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {project.status}
                              </span>
                            </span>
                            <span><span className="font-medium">Order:</span> {project.order}</span>
                            {project.featured && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-3 ml-6">
                          <button
                            onClick={() => handleEdit(project)}
                            className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
