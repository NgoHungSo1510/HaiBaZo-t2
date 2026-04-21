import { useState, useEffect } from 'react'
import axiosClient from '../api/axiosClient.js'
import BookCard from '../components/BookCard.jsx'
import BookForm from '../components/BookForm.jsx'

/**
 * HomePage — main page showing the book list and create form.
 */
function HomePage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const fetchBooks = async () => {
    try {
      const res = await axiosClient.get('/books/')
      setBooks(res.data)
    } catch (err) {
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleBookCreated = (newBook) => {
    setBooks((prev) => [newBook, ...prev])
    showToast('Book created successfully! 🎉', 'success')
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-logo">📚</div>
        <h1 className="app-title">Book Review Hub</h1>
        <p className="app-subtitle">Discover, review, and share your favorite books</p>
      </header>

      {/* Create Book Form */}
      <BookForm onBookCreated={handleBookCreated} />

      {/* Book List */}
      <section>
        <div className="section-title">
          <span className="icon">📖</span>
          All Books
          {books.length > 0 && (
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              ({books.length})
            </span>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <p className="empty-state-text">No books yet</p>
            <p className="empty-state-sub">Be the first to add a book!</p>
          </div>
        ) : (
          <div className="book-grid">
            {books.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
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

export default HomePage
