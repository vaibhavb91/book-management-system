import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: "",
    author: "",
    publication_year: "",
    genre: "",
    description: "",
  });
  const [error, setError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/books/${id}`);
        setBook(response.data);
      } catch (err) {
        setError({ global: "Failed to fetch book details." });
      }
    };
    fetchBook();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError({});

    const titleRegex = /^[A-Za-z\s]+$/;
    const authorRegex = /^[A-Za-z\s]+$/;

    const publicationYearRegex = /^[1-9]\d{3}$/;

    const errors = {};

    // Validate fields
    if (!book.title || !titleRegex.test(book.title)) {
      errors.title = "Please enter a valid title (letters and spaces only).";
    }
    if (!book.author || !authorRegex.test(book.author)) {
      errors.author = "Please enter a valid author (letters and spaces only).";
    }
    if (
      !book.publication_year ||
      !publicationYearRegex.test(book.publication_year)
    ) {
      errors.publication_year =
        "Please enter a valid 4-digit publication year.";
    }
    if (!book.genre) {
      errors.genre = "Please enter at least one genre.";
    }
    if (!book.description) {
      errors.description = "Please enter a description.";
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/books/${id}`, book);
      setSuccessMessage("Book updated successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError({ global: "Failed to update book." });
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Edit Book</h2>

      {error.global && <Alert variant="danger">{error.global}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <div>
            {error.title && (
              <small className="text-danger">{error.title}</small>
            )}
          </div>
          <Form.Control
            type="text"
            placeholder="Enter book title"
            value={book.title}
            onChange={(e) => setBook({ ...book, title: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <div>
            {error.author && (
              <small className="text-danger">{error.author}</small>
            )}
          </div>
          <Form.Control
            type="text"
            placeholder="Enter author name"
            value={book.author}
            onChange={(e) => setBook({ ...book, author: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPublicationYear">
          <Form.Label>Publication Year (e.g. 1998)</Form.Label>
          <div>
            {error.publication_year && (
              <small className="text-danger">{error.publication_year}</small>
            )}
          </div>
          <Form.Control
            placeholder="Enter publication year"
            value={book.publication_year}
            onChange={(e) =>
              setBook({ ...book, publication_year: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGenre">
          <Form.Label>Genre</Form.Label>
          <div>
            {error.genre && (
              <small className="text-danger">{error.genre}</small>
            )}
          </div>
          <Form.Control
            type="text"
            placeholder="Enter genres"
            value={book.genre}
            onChange={(e) => setBook({ ...book, genre: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <div>
            {error.description && (
              <small className="text-danger">{error.description}</small>
            )}
          </div>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter book description"
            value={book.description}
            onChange={(e) => setBook({ ...book, description: e.target.value })}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Book
        </Button>
        <Button variant="danger" className="m-4" onClick={() => navigate("/")}>
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default EditBook;
