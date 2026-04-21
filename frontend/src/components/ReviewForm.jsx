import { useState } from 'react'
import axiosClient from '../api/axiosClient.js'
import StarRating from './StarRating.jsx'

/**
 * ReviewForm component — form to submit a review for a specific book.
 */
function ReviewForm({ bookId, onReviewCreated }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    reviewer_name: '',
    rating: 0,
    content: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRating = (value) => {
    setFormData((prev) => ({ ...prev, rating: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.rating === 0 || !formData.content.trim()) return

    setLoading(true)
    try {
      const payload = {
        reviewer_name: formData.reviewer_name.trim() || 'Anonymous',
        rating: formData.rating,
        content: formData.content.trim(),
      }
      const res = await axiosClient.post(`/books/${bookId}/reviews`, payload)
      setFormData({ reviewer_name: '', rating: 0, content: '' })
      if (onReviewCreated) onReviewCreated(res.data)
    } catch (err) {
      console.error('Error creating review:', err)
      alert('Failed to submit review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="glass-card review-form-card" onSubmit={handleSubmit}>
      <div className="section-title">
        <span className="icon">✏️</span> Write a Review
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="reviewer-name">Your Name</label>
          <input
            className="form-input"
            id="reviewer-name"
            name="reviewer_name"
            type="text"
            placeholder="Anonymous"
            value={formData.reviewer_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Rating *</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <StarRating rating={formData.rating} onRate={handleRating} size={1.6} />
            {formData.rating > 0 && (
              <span className="star-rating-label">{formData.rating}/5</span>
            )}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="review-content">Your Review *</label>
        <textarea
          className="form-textarea"
          id="review-content"
          name="content"
          placeholder="Share your thoughts about this book..."
          value={formData.content}
          onChange={handleChange}
          required
          rows={4}
        />
      </div>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={loading || formData.rating === 0 || !formData.content.trim()}
        id="submit-review"
      >
        {loading ? (
          <>
            <span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span>
            Submitting...
          </>
        ) : (
          '📤  Submit Review'
        )}
      </button>
    </form>
  )
}

export default ReviewForm
