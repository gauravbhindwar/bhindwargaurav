'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Award, ExternalLink, Plus, Search, Filter, Grid, List, Star, Calendar, Edit, Trash2, Users, Zap, CheckCircle, Globe } from 'lucide-react'

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
    credentialLink: '',
    pdfFile: '',
    description: '',
    skills: [],
    order: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  // Helper function to parse various date formats
  const parseDate = (dateString) => {
    if (!dateString) return null
    
    // Try different date formats
    const formats = [
      // Standard formats
      dateString,
      // Handle "2 August 2024" format
      dateString.replace(/(\d{1,2})\s+(\w+)\s+(\d{4})/, '$2 $1, $3'),
      // Handle "8 February 2025" format  
      dateString.replace(/(\d{1,2})\s+(\w+)\s+(\d{4})/, '$2 $1, $3')
    ]
    
    for (const format of formats) {
      try {
        const date = new Date(format)
        if (!isNaN(date.getTime())) {
          return date
        }
      } catch (error) {
        continue
      }
    }
    
    return null
  }

  // Helper function to format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    const date = parseDate(dateString)
    return date ? date.toISOString().split('T')[0] : ''
  }

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    const date = parseDate(dateString)
    return date ? date.toLocaleDateString() : dateString
  }

  // Filter certifications based on search
  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cert.description && cert.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (cert.skills && cert.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    return matchesSearch
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

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      date: '',
      credentialId: '',
      credentialLink: '',
      pdfFile: '',
      description: '',
      skills: [],
      order: 0
    })
    setEditingCertification(null)
  }

  const handleEdit = (certification) => {
    setEditingCertification(certification)
    
    setFormData({
      title: certification.title || '',
      issuer: certification.issuer || '',
      date: formatDateForInput(certification.date),
      credentialId: certification.credentialId || '',
      credentialLink: certification.credentialLink || certification.credentialUrl || '',
      pdfFile: certification.pdfFile || '',
      description: certification.description || '',
      skills: certification.skills || [],
      order: certification.order || 0
    })
    setShowForm(true)
  }

  const handleDelete = async (certification) => {
    if (!confirm('Are you sure you want to delete this certification?')) return

    try {
      const response = await fetch('/api/certifications', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: certification._id })
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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                    Certifications Hub
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">Manage your professional certifications and achievements</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex gap-2 bg-white rounded-lg px-3 sm:px-4 py-2 shadow-sm border border-gray-200">
                <div className="text-center">
                  <span className="text-xs sm:text-sm text-gray-500">Total:</span>
                  <span className="ml-1 text-sm sm:text-lg font-semibold text-gray-900">{certifications.length}</span>
                </div>
                <div className="w-px bg-gray-300 mx-2"></div>
                <div className="text-center">
                  <span className="text-xs sm:text-sm text-gray-500">Active:</span>
                  <span className="ml-1 text-sm sm:text-lg font-semibold text-green-600">{certifications.length}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  resetForm()
                  setShowForm(!showForm)
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden xs:inline">Add Certification</span>
                <span className="xs:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
              <div className="flex flex-1 items-center gap-4 w-full">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search certifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>
              
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
            
            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-600">
              <span>
                Showing {filteredCertifications.length} of {certifications.length} certifications
                {searchTerm && ` for "${searchTerm}"`}
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-purple-600 hover:text-purple-800 font-medium text-left sm:text-right"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Popup for Add/Edit Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slide-up">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {editingCertification ? 'Edit Certification' : 'Add New Certification'}
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
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Certification Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., AWS Solutions Architect"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    name="issuer"
                    value={formData.issuer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Amazon Web Services"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    name="credentialId"
                    value={formData.credentialId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Certification ID or number"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Credential Link
                  </label>
                  <input
                    type="url"
                    name="credentialLink"
                    value={formData.credentialLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    PDF Certificate URL
                  </label>
                  <input
                    type="url"
                    name="pdfFile"
                    value={formData.pdfFile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com/certificate.pdf"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Brief description of the certification..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Related Skills
                </label>
                <input
                  type="text"
                  value={formData.skills.join(', ')}
                  onChange={handleSkillsChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="AWS, Cloud Computing, DevOps (comma-separated)"
                />
                <p className="text-sm text-gray-500">Separate skills with commas</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  min="0"
                />
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (editingCertification ? 'Update Certification' : 'Add Certification')}
                </button>
              </div>
            </form>
              </div>
            </div>
          </div>
        )}

        {/* Certifications Display */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          {filteredCertifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                <Award className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No matching certifications' : 'No certifications yet'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? `No certifications match "${searchTerm}". Try adjusting your search.`
                  : 'Start building your certification portfolio by adding your first achievement.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => {
                    resetForm()
                    setShowForm(true)
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Certification
                </button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-6"
            }>
              {filteredCertifications.map((certification, index) => (
                <div
                  key={certification._id || index}
                  className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${
                    viewMode === 'list' ? 'flex items-center p-6' : 'p-6'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
                          <Award className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                            {certification.title}
                          </h4>
                          <p className="text-sm text-gray-600">{certification.issuer}</p>
                        </div>
                      </div>
                      {viewMode === 'grid' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(certification)}
                            className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(certification)}
                            className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {certification.date && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Issued: {formatDateForDisplay(certification.date)}</span>
                        </div>
                      )}
                      
                      {certification.credentialId && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>ID: {certification.credentialId}</span>
                        </div>
                      )}
                      
                      {certification.description && (
                        <p className="text-gray-700 text-sm line-clamp-3">
                          {certification.description}
                        </p>
                      )}
                      
                      {certification.skills && certification.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {certification.skills.slice(0, 3).map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {certification.skills.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              +{certification.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4">
                          {(certification.credentialLink || certification.credentialUrl) && (
                            <a
                              href={certification.credentialLink || certification.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 transition-colors duration-200"
                            >
                              <Globe className="w-4 h-4" />
                              View Credential
                            </a>
                          )}
                          
                          {certification.pdfFile && (
                            <a
                              href={certification.pdfFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-800 transition-colors duration-200"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View PDF
                            </a>
                          )}
                        </div>
                        
                        {viewMode === 'list' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(certification)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(certification)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
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
