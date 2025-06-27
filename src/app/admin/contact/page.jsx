'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, Mail, Phone, MapPin, Linkedin, Github, Twitter, FileText, Globe, Save, CheckCircle, AlertCircle, Eye } from 'lucide-react'

export default function AdminContact() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: '',
    social: {
      linkedin: '',
      github: ''
    },
    resumeLink: '',
    twitter: '',
    description: ''
  })
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
      return
    }

    fetchContact()
  }, [session, status, router])

  // ESC key handler for closing modals
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (showPreview) {
          setShowPreview(false)
        }
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [showPreview])

  const fetchContact = async () => {
    try {
      const response = await fetch('/api/contact')
      const data = await response.json()
      
      console.log('Loaded contact data:', data) // Debug log
      
      setFormData({
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        social: {
          linkedin: data.social?.linkedin || '',
          github: data.social?.github || ''
        },
        resumeLink: data.resumeLink || '',
        twitter: data.twitter || '',
        description: data.description || ''
      })
    } catch (error) {
      console.error('Error fetching contact:', error)
      setMessage('Error loading contact information')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Handle nested social fields
    if (name === 'linkedin' || name === 'github') {
      setFormData(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [name]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      // Prepare data for submission
      const submitData = {
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        social: {
          linkedin: formData.social.linkedin,
          github: formData.social.github
        },
        resumeLink: formData.resumeLink,
        twitter: formData.twitter,
        description: formData.description
      }

      console.log('Submitting contact data:', submitData) // Debug log

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        setMessage('Contact information updated successfully!')
        
        // Invalidate cache by making a fresh request to the API
        // This ensures portfolio will get updated data immediately
        try {
          await fetch('/api/contact', { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          })
        } catch (cacheError) {
          console.log('Cache invalidation attempted')
        }
        
        // Reload the current data to reflect changes
        await fetchContact()
        
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await response.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving contact:', error)
      setMessage('Error saving contact information')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Contact Information
                  </h1>
                  <p className="text-gray-600">Manage your professional contact details and social links</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
              >
                <Eye className="w-5 h-5" />
                Preview
              </button>
              {message && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  message.includes('Error') || message.includes('error')
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  {message.includes('Error') || message.includes('error') ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Contact Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="City, State/Country"
                />
              </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Social Links & Portfolio</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.social.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Github className="w-4 h-4 text-gray-900" />
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={formData.social.github}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Twitter className="w-4 h-4 text-blue-400" />
                    Twitter/X Profile
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="w-4 h-4 text-green-600" />
                    Resume/CV URL
                  </label>
                  <input
                    type="url"
                    name="resumeLink"
                    value={formData.resumeLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://yourwebsite.com/resume.pdf"
                  />
                </div>
              </div>
            </div>

            {/* Bio/Description Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Professional Bio</h2>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Bio/Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Brief description about yourself, your interests, or what you do..."
                />
                <p className="text-sm text-gray-500">This will be displayed on your portfolio's contact section</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving Changes...' : 'Save Contact Information'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Contact Information Preview
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">How it will appear on your portfolio</h3>
                    <p className="text-gray-600">This is how visitors will see your contact information</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-900 font-medium">{formData.email || 'your.email@example.com'}</span>
                      </div>
                      
                      {formData.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-green-600" />
                          <span className="text-gray-900 font-medium">{formData.phone}</span>
                        </div>
                      )}
                      
                      {formData.location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-red-600" />
                          <span className="text-gray-900 font-medium">{formData.location}</span>
                        </div>
                      )}
                    </div>

                    {formData.description && (
                      <div className="mt-6 p-4 bg-white/70 rounded-xl">
                        <p className="text-gray-700 leading-relaxed">{formData.description}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 mt-6">
                      {formData.social.linkedin && (
                        <a 
                          href={formData.social.linkedin}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </a>
                      )}
                      
                      {formData.social.github && (
                        <a 
                          href={formData.social.github}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      
                      {formData.twitter && (
                        <a 
                          href={formData.twitter}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200"
                        >
                          <Twitter className="w-4 h-4" />
                          Twitter
                        </a>
                      )}
                      
                      {formData.resumeLink && (
                        <a 
                          href={formData.resumeLink}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          <FileText className="w-4 h-4" />
                          Resume
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remove the old Quick Preview Card - it's now in the modal */}
      </div>
    </div>
  )
}
