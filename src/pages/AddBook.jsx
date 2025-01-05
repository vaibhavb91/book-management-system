import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [authorError, setAuthorError] = useState("");
  const [publicationYearError, setPublicationYearError] = useState("");
  const [genreError, setGenreError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [lastId, setLastId] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/books").then((response) => {
      const books = response.data;
      if (books.length > 0) {
        const lastBook = books[books.length - 1];
        setLastId(parseInt(lastBook.id, 10));
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTitleError("");
    setAuthorError("");
    setPublicationYearError("");
    setGenreError("");
    setDescriptionError("");

    let isValid = true;

    const titleRegex = /^[A-Za-z\s]+$/;
    if (!title || !titleRegex.test(title)) {
      setTitleError("Please enter a valid title (letters and spaces only).");
      isValid = false;
    }

    const authorRegex = /^[A-Za-z\s]+$/;
    if (!author || !authorRegex.test(author)) {
      setAuthorError("Please enter a valid author (letters and spaces only).");
      isValid = false;
    }

    const publicationYearRegex = /^[1-9]\d{3}$/;
    if (!publicationYear || !publicationYearRegex.test(publicationYear)) {
      setPublicationYearError("Please enter a valid 4-digit publication year.");
      isValid = false;
    }

    if (!genre) {
      setGenreError("Please enter at least one genre.");
      isValid = false;
    }

    if (!description) {
      setDescriptionError("Please enter a description.");
      isValid = false;
    }

    if (!isValid) return;

    const newBook = {
      id: (lastId + 1).toString(),
      title,
      author,
      publication_year: publicationYear,
      genre: genre,
      description,
    };

    try {
      await axios.post("http://localhost:5000/books", newBook);
      setSuccessMessage("Book added successfully!");
      setLastId(lastId + 1);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setTitleError("Failed to add book. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Add New Book</h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <div>
            {titleError && <small className="text-danger">{titleError}</small>}
          </div>
          <Form.Control
            type="text"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <div>
            {authorError && (
              <small className="text-danger">{authorError}</small>
            )}
          </div>
          <Form.Control
            type="text"
            placeholder="Enter author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPublicationYear">
          <Form.Label>Publication Year (e.g. 1998)</Form.Label>
          <div>
            {publicationYearError && (
              <small className="text-danger">{publicationYearError}</small>
            )}
          </div>
          <Form.Control
            placeholder="Enter publication year"
            value={publicationYear}
            onChange={(e) => setPublicationYear(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGenre">
          <Form.Label>Genre</Form.Label>
          <div>
            {genreError && <small className="text-danger">{genreError}</small>}
          </div>
          <Form.Control
            type="text"
            placeholder="Enter genres "
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <div>
            {descriptionError && (
              <small className="text-danger">{descriptionError}</small>
            )}
          </div>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter book description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Book
        </Button>
        <Button variant="danger" className="m-4" onClick={() => navigate("/")}>
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default AddBook;
