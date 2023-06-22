import React from 'react';
import { Carousel } from 'react-bootstrap';

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

  render() {

    /* TODO: render all the books in a Carousel */

    return (
      <>
        <h2>My Essential Lifelong Learning &amp; Formation Shelf</h2>

        {this.state.books.length ? (
          <Carousel>
            {this.state.books.map(book => (
              <Carousel.Item key={book._id}>
                <h2>{book.title}</h2>
                <p>{book.description}</p>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <h3>No Books Found :(</h3>
        )}
      </>
    )
  }
}

export default BestBooks;
