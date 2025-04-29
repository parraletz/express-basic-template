# Express Basic Template

A modern, well-structured Express.js template with TypeScript, featuring robust validation, logging, and error handling.

## Features

- 🚀 Express.js with TypeScript
- 📝 Zod for schema validation
- 📊 Pino for structured logging
- 🛡️ Error handling middleware
- 📦 Dependency injection
- 🔒 Environment configuration
- 📚 Comprehensive documentation

## Documentation

- [Validation System](docs/validations.md) - Learn how to use Zod for data validation
- [Logging System](docs/logger.md) - Understand the logging implementation with Pino
- [Error Handling](docs/errorhandling.md) - Learn about the error handling system

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- pnpm (v10 or higher)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/express-basic-template.git
cd express-basic-template
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server

```bash
pnpm dev
```

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middlewares/     # Express middlewares
├── routes/          # Route definitions
├── schemas/         # Zod validation schemas
├── services/        # Business logic
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build the application
- `pnpm start` - Start the production server
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev/)
- [Pino](https://getpino.io/)
