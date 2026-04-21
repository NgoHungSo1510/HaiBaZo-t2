import { useState } from 'react'
import axiosClient from '../api/axiosClient.js'

/**
 * BookForm component — form to create a new book.
 * Collapsible with toggle button.
 */
function BookForm({ onBookCreated }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    cover_url: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.author.trim()) return

    setLoading(true)
    try {
      const payload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim() || null,
        cover_url: formData.cover_url.trim() || null,
      }
      const res = await axiosClient.post('/books/', payload)
      setFormData({ title: '', author: '', description: '', cover_url: '' })
      setIsOpen(false)
      if (onBookCreated) onBookCreated(res.data)
    } catch (err) {
      console.error('Error creating book:', err)
      alert('Failed to create book. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-book-section">
      <button
        className="btn btn-primary create-book-toggle"
        onClick={() => setIsOpen(!isOpen)}
        id="toggle-book-form"
      >
        {isOpen ? '✕  Close Form' : '📖  Add New Book'}
      </button>

      {isOpen && (
        <form className="glass-card create-book-form" onSubmit={handleSubmit}>
          <div className="section-title">
            <span className="icon">📝</span> Add a New Book
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="book-title">Title *</label>
              <input
                className="form-input"
                id="book-title"
                name="title"
                type="text"
                placeholder="Enter book title..."
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="book-author">Author *</label>
              <input
                className="form-input"
                id="book-author"
                name="author"
                type="text"
                placeholder="Enter author name..."
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="book-description">Description</label>
            <textarea
              className="form-textarea"
              id="book-description"
              name="description"
              placeholder="Write a brief description of the book..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="book-cover-url">Cover Image URL</label>
            <input
              className="form-input"
              id="book-cover-url"
              name="cover_url"
              type="url"
              placeholder="https://example.com/cover.jpg"
              value={formData.cover_url}
              onChange={handleChange}
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading || !formData.title.trim() || !formData.author.trim()}
            id="submit-book"
          >
            {loading ? (
              <>
                <span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span>
                Creating...
              </>
            ) : (
              '✨  Create Book'
            )}
          </button>
        </form>
      )}
    </div>
  )
}

export default BookForm
