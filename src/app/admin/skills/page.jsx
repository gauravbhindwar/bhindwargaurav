'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Code, BookOpen } from 'lucide-react'

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
    description: '',
    url: ''
  })

  const categories = ['Languages', 'Web Development', 'Data Science & ML', 'Tools & Platforms']
  const courseTypes = ['Free', 'Paid', 'Certification']
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
      return
    }

    fetchData()
  }, [session, status, router])

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

      // Extract courses
      const allCourses = []
      if (data.courses) {
        Object.entries(data.courses).forEach(([type, courseList]) => {
          courseList.forEach(courseName => {
            // If courseName is a string, convert it to an object with a name property
            if (typeof courseName === 'string') {
              allCourses.push({ 
                name: courseName,
                type,
                description: '',
                url: ''
              })
            } else {
              // If it's already an object, just add the type
              allCourses.push({ ...courseName, type })
            }
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
      const method = editingItem ? 'PUT' : 'POST'
      const payload = editingItem 
        ? { type: formType, id: editingItem._id, ...formData }
        : { type: formType, ...formData }

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
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Error saving item')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item, type) => {
    setEditingItem(item)
    setFormType(type)
    setFormData({
      name: item.name,
      category: item.category || 'Languages',
      level: item.level || 'Intermediate',
      type: item.type || 'Free',
      description: item.description || '',
      url: item.url || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (item, type) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return

    try {
      const response = await fetch(`/api/skills?type=${type}&id=${item._id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Error deleting item')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Languages',
      level: 'Intermediate',
      type: 'Free',
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
    <div className="space-y-6 pb-8">
      {/* Header with Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Skills & Courses</h2>
            <p className="text-gray-600 mt-1">Add, edit, and delete your skills and courses</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setFormType('skill')
                resetForm()
                if (editingItem) {
                  // If we're in edit mode, ensure form stays open but resets
                  setEditingItem(null)
                } else {
                  // Toggle form visibility if not in edit mode
                  setShowForm(!showForm)
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Skill
            </button>
            <button
              onClick={() => {
                setFormType('course')
                resetForm()
                if (editingItem) {
                  // If we're in edit mode, ensure form stays open but resets
                  setEditingItem(null)
                } else {
                  // Toggle form visibility if not in edit mode
                  setShowForm(!showForm)
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Course
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingItem ? `Edit ${formType}` : `Add New ${formType}`}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                placeholder="Enter name"
                required
              />
            </div>

            {formType === 'skill' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Level</label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                    >
                      {skillLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                  >
                    {courseTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL</label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                  />
                </div>
              </>
            )}

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
                {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills & Courses Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                formType === 'skill'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setFormType('skill')}
            >
              Skills ({skills.length})
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                formType === 'course'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setFormType('course')}
            >
              Courses ({courses.length})
            </button>
          </nav>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {formType === 'skill' ? (
            <div className="space-y-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Skills ({skills.length})
              </h3>
              {skills.length === 0 ? (
                <p className="text-gray-500">No skills found. Add your first skill!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{skill.name}</h4>
                          <p className="text-sm text-gray-600">Category: {skill.category}</p>
                          <p className="text-sm text-gray-600">Level: {skill.level}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(skill, 'skill')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(skill, 'skill')}
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
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Courses ({courses.length})
              </h3>
              {courses.length === 0 ? (
                <p className="text-gray-500">No courses found. Add your first course!</p>
              ) : (
                <div className="space-y-4">
                  {courses.map((course, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="text-lg font-medium text-gray-900">{course.name}</h4>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.type === 'current' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {course.type === 'current' ? 'Current' : 'Completed'}
                            </span>
                          </div>
                          {course.description && (
                            <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                          )}
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            {course.url && (
                              <a
                                href={course.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View Course
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(course, 'course')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(course, 'course')}
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
          )}
        </div>
      </div>
    </div>
  )
}
