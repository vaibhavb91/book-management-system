import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Container,
  Spinner,
  Alert,
  Button,
  Modal,
  Pagination,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const Book = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/books");
        setBooks(response.data || []);
      } catch (err) {
        setError("Failed to fetch books data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [deleteSuccess]);

  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortBooks = (column) => {
    const sortedBooks = [...filteredBooks];
    sortedBooks.sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });
    setBooks(sortedBooks);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (id) => {
    setDeleteBookId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/books/${deleteBookId}`);
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== deleteBookId)
      );
      setDeleteMessage("Book deleted successfully.");
      setDeleteSuccess(true);
      setShowDeleteModal(false);

      setTimeout(() => {
        setDeleteMessage("");
      }, 1500);
    } catch (err) {
      setDeleteMessage("Failed to delete the book. Please try again later.");
      setDeleteSuccess(false);

      setTimeout(() => {
        setDeleteMessage("");
      }, 1500);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  return (
    <Container className="mt-4">
      <div className="d-flex align-items-center justify-content-center mb-4">
        <h3 className="mb-0">
          <i className="fas fa-book me-3 text-primary"></i>
        </h3>
        <h2 className=" font-weight-bold text-muted mb-0">
          Book Management System
        </h2>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-50"
        />
        <Link to="/add-book">
          <Button variant="primary">Add New Book</Button>
        </Link>
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {deleteMessage && (
        <Alert
          variant={deleteSuccess ? "success" : "danger"}
          className="text-center mt-3"
        >
          {deleteMessage}
        </Alert>
      )}

      {!loading && !error && (
        <>
          <Table striped bordered hover responsive className="text-center">
            <thead>
              <tr>
                <th>#</th>
                <th onClick={() => sortBooks("title")}>Title</th>
                <th onClick={() => sortBooks("author")}>Author</th>
                <th>Publication Year</th>
                <th>Genre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.length > 0 ? (
                currentBooks.map((book, index) => (
                  <tr key={book.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.publication_year}</td>
                    <td>{book.genre}</td>
                    <td>
                      <Link
                        to={`/book/${book.id}`}
                        className="btn btn-info btn-sm me-2"
                        title="View"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link
                        to={`/edit-book/${book.id}`}
                        className="btn btn-warning btn-sm me-2"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        className="me-2"
                        title="Delete"
                        onClick={() => handleDeleteClick(book.id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No books available</td>
                </tr>
              )}
            </tbody>
          </Table>

          <Pagination>
            {[...Array(Math.ceil(filteredBooks.length / itemsPerPage))].map(
              (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              )
            )}
          </Pagination>
        </>
      )}

      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this book?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Book;
