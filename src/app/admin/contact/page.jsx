'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

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

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
      return
    }

    fetchContact()
  }, [session, status, router])

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
              <h1 className="text-3xl font-bold text-gray-900">Manage Contact Information</h1>
              <p className="text-gray-600 mt-1">Update your contact details and social links</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="admin-btn-secondary"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {/* Success/Error Message */}
        {message && (
          <div className={`admin-card p-4 mb-8 ${
            message.includes('Error') 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            <p className="font-medium">{message}</p>
          </div>
        )}

        {/* Contact Form */}
        <div className="admin-card p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Contact Information
          </h2>
          
          <form onSubmit={handleSubmit} className="admin-form-section">
            {/* Basic Contact Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="admin-form-grid">
                <div>
                  <label className="admin-form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="admin-form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div>
                <label className="admin-form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="admin-form-input"
                  placeholder="City, State/Country"
                />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
              <div className="admin-form-grid">
                <div>
                  <label className="admin-form-label">LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.social.linkedin}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <label className="admin-form-label">GitHub Profile</label>
                  <input
                    type="url"
                    name="github"
                    value={formData.social.github}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
              
              <div className="admin-form-grid">
                <div>
                  <label className="admin-form-label">Twitter/X Profile</label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
                <div>
                  <label className="admin-form-label">Resume/CV URL</label>
                  <input
                    type="url"
                    name="resumeLink"
                    value={formData.resumeLink}
                    onChange={handleInputChange}
                    className="admin-form-input"
                    placeholder="https://yourwebsite.com/resume.pdf"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="admin-form-label">Bio/Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="admin-form-textarea"
                placeholder="Brief description about yourself, your interests, or what you do..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={saving}
                className="admin-btn-primary"
              >
                {saving ? 'Saving...' : 'Update Contact Information'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
