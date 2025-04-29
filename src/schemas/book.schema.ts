import { z } from 'zod'

// Base book schema
export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  author: z.string().min(1, 'Author is required').max(100, 'Author name is too long'),
  year: z
    .number()
    .int()
    .min(1800, 'Year must be after 1800')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  isbn: z.string().regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/, 'Invalid ISBN format')
})

// Schema for creating a new book
export const createBookSchema = bookSchema

// Schema for updating a book
export const updateBookSchema = bookSchema.partial()

// Schema for book ID
export const bookIdSchema = z.object({
  id: z.string().uuid('Invalid book ID')
})
