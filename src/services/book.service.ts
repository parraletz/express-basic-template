import { Book } from '../types/book'

// Dummy data
const books: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    isbn: '978-0743273565'
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    isbn: '978-0451524935'
  }
]

export class BookService {
  async getAllBooks(): Promise<Book[]> {
    return books
  }

  async getBookById(id: string): Promise<Book | undefined> {
    return books.find((book) => book.id === id)
  }

  async createBook(book: Omit<Book, 'id'>): Promise<Book> {
    const newBook: Book = {
      ...book,
      id: (books.length + 1).toString()
    }
    books.push(newBook)
    return newBook
  }

  async updateBook(id: string, book: Partial<Book>): Promise<Book | undefined> {
    const index = books.findIndex((b) => b.id === id)
    if (index === -1) return undefined

    books[index] = { ...books[index], ...book }
    return books[index]
  }

  async deleteBook(id: string): Promise<boolean> {
    const index = books.findIndex((book) => book.id === id)
    if (index === -1) return false

    books.splice(index, 1)
    return true
  }
}
