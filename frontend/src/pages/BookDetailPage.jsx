import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient.js'
import StarRating from '../components/StarRating.jsx'
import ReviewForm from '../components/ReviewForm.jsx'
import ReviewCard from '../components/ReviewCard.jsx'

/**
 * BookDetailPage — shows full book info with reviews.
 */
function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const fetchBook = async () => {
    try {
      const res = await axiosClient.get(`/books/${id}`)
      setBook(res.data)
    } catch (err) {
      console.error('Error fetching book:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBook()
  }, [id])

  const handleReviewCreated = (newReview) => {
    setBook((prev) => {
      const updatedReviews = [newReview, ...prev.reviews]
      const reviewCount = updatedReviews.length
      const avgRating = Math.round(
        (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10
      ) / 10
      return {
        ...prev,
        reviews: updatedReviews,
        review_count: reviewCount,
        avg_rating: avgRating,
      }
    })
    showToast('Review submitted successfully! ✨', 'success')
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return ''
    }
  }

  if (loading) {
    return (
      <div className="detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading book details...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="detail-container">
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <p className="empty-state-text">Book not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-container">
      {/* Back Button */}
      <button
        className="btn btn-ghost back-btn"
        onClick={() => navigate('/')}
        id="back-to-home"
      >
        ← Back to Home
      </button>

      {/* Book Header */}
      <div className="detail-header">
        {/* Cover */}
        {book.cover_url ? (
          <img
            className="detail-cover"
            src={book.cover_url}
            alt={`Cover of ${book.title}`}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className="detail-cover-placeholder"
          style={{ display: book.cover_url ? 'none' : 'flex' }}
        >
          📚
        </div>

        {/* Info */}
        <div className="detail-info">
          <h1 className="detail-title">{book.title}</h1>
          <p className="detail-author">
            <span>✍️</span> {book.author}
          </p>

          {/* Rating Block */}
          <div className="detail-meta">
            <div className="detail-rating-value">
              {book.avg_rating > 0 ? book.avg_rating.toFixed(1) : '—'}
            </div>
            <div className="detail-rating-info">
              <div className="detail-rating-stars">
                <StarRating rating={Math.round(book.avg_rating)} readonly size={1.1} />
              </div>
              <div className="detail-review-count">
                {book.review_count} review{book.review_count !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <p className="detail-description">{book.description}</p>
          )}

          <div className="detail-date">
            📅 Added on {formatDate(book.created_at)}
          </div>
        </div>
      </div>

      {/* Review Section */}
      <section className="review-section">
        {/* Review Form */}
        <ReviewForm bookId={book.id} onReviewCreated={handleReviewCreated} />

        {/* Reviews List */}
        <div className="section-title">
          <span className="icon">💬</span>
          Reviews
          {book.reviews.length > 0 && (
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              ({book.reviews.length})
            </span>
          )}
        </div>

        {book.reviews.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 20px' }}>
            <div className="empty-state-icon">💭</div>
            <p className="empty-state-text">No reviews yet</p>
            <p className="empty-state-sub">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="review-list">
            {book.reviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default BookDetailPage
