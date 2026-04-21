import StarRating from './StarRating.jsx'

/**
 * ReviewCard component — displays a single review.
 */
function ReviewCard({ review, index = 0 }) {
  const initial = review.reviewer_name
    ? review.reviewer_name.charAt(0).toUpperCase()
    : 'A'

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  }

  return (
    <div
      className="glass-card review-card"
      style={{ animationDelay: `${index * 0.08}s` }}
      id={`review-${review.id}`}
    >
      <div className="review-card-header">
        <div className="review-card-author">
          <div className="review-card-avatar">{initial}</div>
          <div>
            <div className="review-card-name">{review.reviewer_name || 'Anonymous'}</div>
            <div className="review-card-date">{formatDate(review.created_at)}</div>
          </div>
        </div>
        <StarRating rating={review.rating} readonly size={1} />
      </div>
      <p className="review-card-content">{review.content}</p>
    </div>
  )
}

export default ReviewCard
