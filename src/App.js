import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://library-management-backend-ydal.onrender.com/api/books";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    try {
      setError("");
      const res = await axios.get(API_URL);
      setBooks(res.data);
    } catch (err) {
      console.error("GET error:", err);
      setError("Unable to load books.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const book = {
      title,
      author,
      category,
      available,
    };

    try {
      setError("");

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, book);
        setEditingId(null);
      } else {
        await axios.post(API_URL, book);
      }

      setTitle("");
      setAuthor("");
      setCategory("");
      setAvailable(true);

      fetchBooks();
    } catch (err) {
      console.error("POST/PUT error:", err);
      setError("Unable to save book.");
    }
  };

  const deleteBook = async (id) => {
    try {
      setError("");
      await axios.delete(`${API_URL}/${id}`);
      fetchBooks();
    } catch (err) {
      console.error("DELETE error:", err);
      setError("Unable to delete book.");
    }
  };

  const editBook = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setCategory(book.category);
    setAvailable(book.available);
    setEditingId(book.id);
  };

  return (
    <div className="container">
      <h1>Library Management System</h1>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <form className="book-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter author name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={available}
            onChange={() => setAvailable(!available)}
          />
          Available
        </label>

        <button type="submit">
          {editingId ? "Update Book" : "Add Book"}
        </button>
      </form>

      <div className="book-list">
        <h2>Books List</h2>

        {books.length === 0 ? (
          <p className="empty-text">No books available</p>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div className="book-card" key={book.id}>
                <h3>{book.title}</h3>

                <p>
                  <strong>Author:</strong> {book.author}
                </p>

                <p>
                  <strong>Category:</strong> {book.category}
                </p>

                <span
                  className={
                    book.available
                      ? "status available"
                      : "status unavailable"
                  }
                >
                  {book.available ? "Available" : "Not Available"}
                </span>

                <div className="card-buttons">
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => editBook(book)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteBook(book.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
