import React from 'react';
import axios from 'axios';
import { Carousel, Button, Container, Image } from 'react-bootstrap';
import ErrorAlert from './ErrorAlert';
import BookFormModal from './BookFormModal';

class BestBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [
        {
          title: 'test',
          description: 'test description',
          status: 'life-changing'
        },
        {
          title: 'test',
          description: 'test description',
          status: 'life-changing'
        }
      ]
    }
  }

  /* TODO: Make a GET request to your API to fetch all the books from the database  */
  componentDidMount() {
    fetch(process.env.REACT_APP_SERVER_URL + '/books')
    .then(res => res.json())
    .then(json => {
      console.log(json);
      this.setState({
        books: json
      });
    })
    .catch(err => {
      console.error(err);
    });
  }
  
  createBook = async (newBook) => {
    try {
      const config = {
        method: "post",
        baseURL: process.env.REACT_APP_SERVER_URL,
        url: "/books/",
        // axios sends "data" in the request.body
        data: newBook,
      };

      const bookResults = await axios(config);

      const updatedBooks = [...this.state.books, bookResults.data];
      this.setState({ books: updatedBooks });

    } catch (error) {
      console.error("Error in BestBooks createBook: ", error);
      this.setState({
        errorMessage: `Status Code ${error.response.status}: ${error.response.data}`,
      });
    }
  };


  deleteBook = async (bookToBeDeleted) => {
    try {
      // const proceed = window.confirm(`Do you want to delete ${bookToBeDeleted.title}?`)

      // if (proceed) {
        const config = {
          method: "delete",
          baseURL: process.env.REACT_APP_SERVER_URL,
          url: `/books/${bookToBeDeleted._id}`,
        };

        await axios(config);

        let newBooks = this.state.books.filter((book) => book._id !== bookToBeDeleted._id);
        this.setState({ books: newBooks });
      // }

    } catch (error) {
      console.error("Error in BestBooks deleteBook: ", error);
      this.setState({
        errorMessage: `Status Code ${error.response.status}: ${error.response.data}`,
      });
    }
  };

  closeBookFormModal = () => this.setState({ showForm: false });
  closeError = () => this.setState({ errorMessage: "" });

  render() {
    /* TODO: render all the books in a Carousel */
    return (
      <>
        <h2 className="text-center">
          My Essential Lifelong Learning &amp; Formation Shelf
        </h2>

        <Button
          id="addBookButton"
          className="btn-lg"
          onClick={() => this.setState({ showForm: true })}
        >
          Add a Book!
        </Button>

        {this.state.showForm && (
          <BookFormModal
            show={this.state.showForm}
            handleClose={this.closeBookFormModal}
            createBook={this.createBook}
          />
        )}

        <Container>
          {this.state.books.length ? (
            <Carousel id="carousel">
              {this.state.books.map((book, idx) => (
                <Carousel.Item key={book._id || idx}>
                  <Image
                    className="w-100"
                    id="carousel-image"
                    src="https://placehold.co/600x400"
                    alt={book.title}
                  />
                  <Carousel.Caption id="carousel-text-box">
                    <h2 className="carousel-text">{book.title}</h2>
                    <p className="carousel-text">{book.description}</p>
                    <p className="carousel-text">Status: {book.status}</p>
                    <Button variant="danger" onClick={() => this.deleteBook(book)}>
                      Delete
                    </Button>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : this.state.errorMessage.length ? (
            <ErrorAlert
              closeError={this.closeError}
              errorMessage={this.state.errorMessage}
            />
          ) : (
            // only render this if there are no books saved in the DB
            <h3 className="text-center">No Books Found :(</h3>
          )}
        </Container>
      </>
    );
  }
}

export default BestBooks;
