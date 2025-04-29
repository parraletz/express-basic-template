# Data Validation with Zod

This document explains how data validation is implemented in the project using Zod, a schema validation library for TypeScript.

## Table of Contents

- [Introduction](#introduction)
- [Validation Structure](#validation-structure)
- [Base Schemas](#base-schemas)
- [Route Validation](#route-validation)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)

## Introduction

Zod is a schema validation library that allows us to:

- Define validation schemas declaratively
- Automatically infer TypeScript types
- Validate data at runtime
- Provide descriptive error messages

## Validation Structure

The validation in the project follows this structure:

```
src/
├── schemas/           # Zod schema definitions
├── middlewares/       # Validation middlewares
└── utils/            # Utilities and types
```

### Base Schemas

Base schemas define the structure and validation rules for each entity. For example, for a book:

```typescript
// src/schemas/book.schema.ts
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
```

### Specific Schemas

From base schemas, we create specific schemas for each operation:

```typescript
// For creating a book (all fields are required)
export const createBookSchema = bookSchema

// For updating a book (all fields are optional)
export const updateBookSchema = bookSchema.partial()

// For operations requiring an ID
export const bookIdSchema = z.object({
  id: z.string().uuid('Invalid book ID')
})
```

## Route Validation

The validation middleware is applied to routes to ensure data complies with defined schemas:

```typescript
// src/routes/book.routes.ts
router.post('/', validate(createBookSchema), bookController.createBook)
router.put('/:id', validate(bookIdSchema.merge(updateBookSchema)), bookController.updateBook)
```

### Validation Middleware

The `validate` middleware processes validation and handles errors:

```typescript
// src/middlewares/validation.middleware.ts
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError('Validation error', 'VALIDATION_ERROR', 400, error.errors))
      } else {
        next(error)
      }
    }
  }
}
```

## Error Handling

Validation errors are handled consistently:

```typescript
// src/utils/errors.ts
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}
```

The error response includes:

- Descriptive message
- Error code
- Specific details of the failed validation

## Usage Examples

### 1. Creation Validation

```typescript
// Schema
const createBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  year: z.number().int()
})

// Route
router.post('/', validate(createBookSchema), bookController.createBook)
```

### 2. Update Validation

```typescript
// Schema
const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  year: z.number().int().optional()
})

// Route
router.put('/:id', validate(bookIdSchema.merge(updateBookSchema)), bookController.updateBook)
```

## Best Practices

1. **Reusable Schemas**

   - Create base schemas and extend them as needed
   - Use `.partial()` for update operations
   - Combine schemas using `.merge()`

2. **Descriptive Error Messages**

   - Provide clear and specific error messages
   - Use messages in the application's language
   - Include examples when possible

3. **Early Validation**

   - Validate data as early as possible in the application flow
   - Use validation middleware in routes
   - Validate both input and output data

4. **Strong Typing**

   - Leverage Zod's type inference
   - Export inferred types for use in the application
   - Maintain consistency between validation and types

5. **Documentation**
   - Document schemas and their rules
   - Include usage examples
   - Keep documentation up to date

## Additional Resources

- [Official Zod Documentation](https://zod.dev/)
- [Schema Examples](https://github.com/colinhacks/zod#examples)
- [Migration Guide](https://zod.dev/?id=migration-guide)
