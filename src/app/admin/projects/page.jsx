'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FolderOpen, ExternalLink, Github, Eye, Edit, Trash2 } from 'lucide-react'

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

  const statusOptions = ['completed', 'in-progress', 'planned']
  const technologyOptions = ['React', 'Next.js', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Express.js', 'Vue.js', 'Angular', 'PHP', 'Laravel', 'Django', 'Flask', 'Docker', 'AWS', 'Vercel', 'Heroku']

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

  const handleTechnologyChange = (technology) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.includes(technology)
        ? prev.technologies.filter(tech => tech !== technology)
        : [...prev.technologies, technology]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = editingProject ? 'PUT' : 'POST'
      const payload = editingProject 
        ? { ...formData, _id: editingProject._id }
        : formData

      const response = await fetch('/api/projects', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
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
      id: project.id || '',
      title: project.title || '',
      description: project.description || '',
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
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Projects</h2>
            <p className="text-gray-600 mt-1">Add, edit, and delete your portfolio projects</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Project
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project ID</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                  placeholder="unique-project-id"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                  placeholder="Project Title"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Short Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                placeholder="Brief description for project cards"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Long Description</label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                placeholder="Detailed description with features, challenges, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                  placeholder="https://example.com/image.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Live URL</label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                  placeholder="https://your-project.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Featured Project</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Technologies</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {technologyOptions.map(tech => (
                  <label key={tech} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.technologies.includes(tech)}
                      onChange={() => handleTechnologyChange(tech)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{tech}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingProject ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Projects ({projects.length})
          </h3>
        </div>
        <div className="p-6">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first project.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900">{project.title}</h4>
                        {project.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {project.technologies.map((tech, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-600 hover:text-gray-900"
                          >
                            <Github className="w-4 h-4 mr-1" />
                            GitHub
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-6">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
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
  )
}
