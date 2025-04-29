import { Request, Response } from 'express'
import { asyncHandler } from '../middlewares/error.middleware'
import { BookService } from '../services/book.service'

const bookService = new BookService()

export class BookController {
  getAllBooks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const books = await bookService.getAllBooks()
    res.json(books)
  })

  getBookById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const book = await bookService.getBookById(id)

    if (!book) {
      res.status(404).json({ error: 'Book not found' })
      return
    }

    res.json(book)
  })

  createBook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const book = await bookService.createBook(req.body)
    res.status(201).json(book)
  })

  updateBook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const book = await bookService.updateBook(id, req.body)

    if (!book) {
      res.status(404).json({ error: 'Book not found' })
      return
    }

    res.json(book)
  })

  deleteBook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const success = await bookService.deleteBook(id)

    if (!success) {
      res.status(404).json({ error: 'Book not found' })
      return
    }

    res.status(204).send()
  })
}
