import { Router } from 'express'
import { BookController } from '../controllers/book.controller'

const router = Router()
const bookController = new BookController()

// Book routes
router.get('/', bookController.getAllBooks)
router.get('/:id', bookController.getBookById)
router.post('/', bookController.createBook)
router.put('/:id', bookController.updateBook)
router.delete('/:id', bookController.deleteBook)

export default router
