import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Spinner,
  Alert,
  Button,
  Card,
  Row,
  Col,
} from "react-bootstrap";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/books/${id}`);
        setBook(response.data);
      } catch (err) {
        setError("Failed to fetch book details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  return (
    <Container className="mt-5">
      <Button
        variant="dark"
        onClick={() => navigate("/")}
        className="mb-4"
        style={{ display: "inline-block" }}
      >
        &larr; Back to Home
      </Button>

      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center mt-4">
          {error}
        </Alert>
      )}

      {book && (
        <Card className="shadow border-0">
          <Row noGutters>
            <Col md={8} className="p-4">
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  <h2>{book.title}</h2>
                </Card.Title>
                <Card.Text>
                  <strong>Author:</strong> {book.author}
                </Card.Text>
                <Card.Text>
                  <strong>Publication Year:</strong> {book.publication_year}
                </Card.Text>
                <Card.Text>
                  <strong>Genre:</strong> {book.genre}
                </Card.Text>
                <Card.Text>
                  <strong>Description:</strong> {book.description}
                </Card.Text>
              </Card.Body>
            </Col>
          </Row>
          <Card.Footer className="text-center text-muted">
            Explore more books and find your next read!
          </Card.Footer>
        </Card>
      )}
    </Container>
  );
};

export default BookDetails;
