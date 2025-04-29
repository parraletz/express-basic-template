import { Router } from 'express'
import { BookController } from '../controllers/book.controller'
import { validate } from '../middlewares/validation.middleware'
import { bookIdSchema, createBookSchema, updateBookSchema } from '../schemas/book.schema'

const router = Router()
const bookController = new BookController()

// Book routes
router.get('/', bookController.getAllBooks)

router.get('/:id', validate(bookIdSchema), bookController.getBookById)

router.post('/', validate(createBookSchema), bookController.createBook)

router.put('/:id', validate(bookIdSchema.merge(updateBookSchema)), bookController.updateBook)

router.delete('/:id', validate(bookIdSchema), bookController.deleteBook)

export default router
