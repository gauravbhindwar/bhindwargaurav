'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminCertifications() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCertification, setEditingCertification] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    skills: [],
    order: 0
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
      return
    }

    fetchCertifications()
  }, [session, status, router])

  const fetchCertifications = async () => {
    try {
      const response = await fetch('/api/certifications')
      const data = await response.json()
      setCertifications(data.certifications || [])
    } catch (error) {
      console.error('Error fetching certifications:', error)
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

  const handleSkillsChange = (e) => {
    const value = e.target.value
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill)
    setFormData(prev => ({
      ...prev,
      skills
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = '/api/certifications'
      const method = editingCertification ? 'PUT' : 'POST'
      const payload = editingCertification 
        ? { id: editingCertification._id, ...formData }
        : formData
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await fetchCertifications()
        resetForm()
        setShowForm(false)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving certification:', error)
      alert('Error saving certification')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (certification) => {
    setEditingCertification(certification)
    setFormData({
      title: certification.title,
      issuer: certification.issuer,
      date: certification.date || '',
      credentialId: certification.credentialId || '',
      credentialUrl: certification.credentialUrl || '',
      description: certification.description || '',
      skills: certification.skills || [],
      order: certification.order || 0
    })
    setShowForm(true)
  }

  const handleDelete = async (certificationId) => {
    if (!confirm('Are you sure you want to delete this certification?')) return

    try {
      const response = await fetch(`/api/certifications?id=${certificationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchCertifications()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting certification:', error)
      alert('Error deleting certification')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      date: '',
      credentialId: '',
      credentialUrl: '',
      description: '',
      skills: [],
      order: 0
    })
    setEditingCertification(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Certifications</h1>
              <p className="text-gray-600">Add, edit, and delete your certifications</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {showForm ? 'Cancel' : 'Add Certification'}
              </button>
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Add/Edit Form */}
          {showForm && (
            <div className="admin-card p-8 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {editingCertification ? 'Edit Certification' : 'Add New Certification'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Issuer *</label>
                    <input
                      type="text"
                      name="issuer"
                      value={formData.issuer}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Obtained</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Credential ID</label>
                    <input
                      type="text"
                      name="credentialId"
                      value={formData.credentialId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Credential URL</label>
                    <input
                      type="url"
                      name="credentialUrl"
                      value={formData.credentialUrl}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                    placeholder="Brief description of the certification..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.skills.join(', ')}
                    onChange={handleSkillsChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
                    placeholder="React, JavaScript, Node.js"
                  />
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
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingCertification ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Certifications List */}
          <div className="admin-card">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Certifications ({certifications.length})
              </h3>
              {certifications.length === 0 ? (
                <p className="text-gray-500">No certifications found. Add your first certification!</p>
              ) : (
                <div className="space-y-4">
                  {certifications.map((certification) => (
                    <div key={certification._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{certification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Issuer:</span> {certification.issuer}
                          </p>
                          {certification.date && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Date:</span> {formatDate(certification.date)}
                            </p>
                          )}
                          {certification.credentialId && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Credential ID:</span> {certification.credentialId}
                            </p>
                          )}
                          {certification.description && (
                            <p className="text-sm text-gray-600 mt-2">{certification.description}</p>
                          )}
                          {certification.skills && certification.skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {certification.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Order: {certification.order}</span>
                            {certification.credentialUrl && (
                              <a
                                href={certification.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                              >
                                View Credential
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(certification)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(certification._id)}
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
      </main>
    </div>
  )
}
