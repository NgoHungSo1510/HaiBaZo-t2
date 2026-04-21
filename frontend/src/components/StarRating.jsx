import { useState } from 'react'

/**
 * StarRating component — supports both interactive (form) and display-only modes.
 * @param {number} rating - Current rating value
 * @param {function} onRate - Callback when a star is clicked (interactive mode)
 * @param {boolean} readonly - If true, display-only mode
 * @param {number} size - Font size in rem
 */
function StarRating({ rating = 0, onRate, readonly = false, size = 1.25 }) {
  const [hoverRating, setHoverRating] = useState(0)

  const stars = [1, 2, 3, 4, 5]

  const handleClick = (value) => {
    if (!readonly && onRate) {
      onRate(value)
    }
  }

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className={`star-rating ${!readonly ? 'interactive' : ''}`}>
      {stars.map((value) => (
        <span
          key={value}
          className={`star ${value <= displayRating ? 'filled' : ''} ${!readonly ? 'interactive' : ''}`}
          style={{ fontSize: `${size}rem` }}
          onClick={() => handleClick(value)}
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
          role={!readonly ? 'button' : undefined}
          aria-label={`${value} star${value > 1 ? 's' : ''}`}
        >
          {value <= displayRating ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

export default StarRating
