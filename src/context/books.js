import axios from "axios";
const { createContext, useState, useCallback } = require("react");

const BooksContext = createContext();

function Provider({ children }) {
  const [books, setBooks] = useState([]);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchBooks = useCallback(async () => {
    const response = await axios.get(`${baseUrl}/books`);
    setBooks(response.data);
  }, [baseUrl]);

  const editBookById = async (id, newTitle) => {
    const response = await axios.put(`${baseUrl}/books/${id}`, {
      title: newTitle,
    });

    const updatedBooks = books.map((book) => {
      if (book.id === id) {
        return { ...book, ...response.data };
      } else {
        return book;
      }
    });
    setBooks(updatedBooks);
  };

  const deleteBookById = async (id) => {
    await axios.delete(`${baseUrl}/books/${id}`);
    const updatedBooks = books.filter((book) => book.id !== id);
    setBooks(updatedBooks);
  };

  const createBook = async (title) => {
    const response = await axios.post(`${baseUrl}/books`, { title });
    const updatedBooks = [...books, response.data];
    setBooks(updatedBooks);
  };

  const valueToShare = {
    books,
    fetchBooks,
    editBookById,
    deleteBookById,
    createBook,
  };

  return <BooksContext.Provider value={valueToShare}>{children}</BooksContext.Provider>;
}

export { Provider };
export default BooksContext;
