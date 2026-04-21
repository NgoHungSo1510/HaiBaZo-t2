import { useNavigate } from 'react-router-dom'
import StarRating from './StarRating.jsx'

/**
 * BookCard component — displays a book summary in a grid card.
 * Entire card is clickable, navigates to book detail page.
 */
function BookCard({ book, index = 0 }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/books/${book.id}`)
  }

  return (
    <div
      className="glass-card book-card"
      onClick={handleClick}
      style={{ animationDelay: `${index * 0.08}s` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      id={`book-card-${book.id}`}
    >
      {/* Cover Image */}
      {book.cover_url ? (
        <img
          className="book-card-cover"
          src={book.cover_url}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        className="book-card-cover-placeholder"
        style={{ display: book.cover_url ? 'none' : 'flex' }}
      >
        📚
      </div>

      {/* Card Body */}
      <div className="book-card-body">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">
          <span>✍️</span> {book.author}
        </p>

        {/* Footer */}
        <div className="book-card-footer">
          <div className="book-card-rating">
            <StarRating rating={Math.round(book.avg_rating)} readonly size={0.9} />
            <span>{book.avg_rating > 0 ? book.avg_rating.toFixed(1) : '—'}</span>
          </div>
          <div className="book-card-reviews">
            💬 {book.review_count} review{book.review_count !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookCard
