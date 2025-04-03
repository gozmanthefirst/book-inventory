# Book Inventory

A comprehensive book management system with a modern web frontend and API backend.

## Project Overview

This monorepo contains a complete book inventory solution that allows users to manage their book collection with a user-friendly interface and robust backend.

- **Frontend**: Next.js application with Google Books API integration
- **Backend**: Hono-based API server

## Features

- Browse and search your book catalog
- Add, edit, and remove books from your collection
- Search and filter functionality
- Integration with Google Books API for book data

## Prerequisites

- Node.js >= v20.11.0
- pnpm >= 9.0.0

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/gozmanthefirst/book-inventory.git
   cd book-inventory
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
    # For frontend
    cp apps/web/.env.example apps/web/.env

    # For backend
    cp apps/api/.env.example apps/api/.env
   ```

4. Start the development server:

   ```bash
    # Start both frontend and backend
    pnpm dev

    # Or start individually
    pnpm dev --filter=web
    pnpm dev --filter=api
   ```

The frontend application will be available at `http://localhost:3000` and the API at `http://localhost:8000`.

## Future Features

- Dark mode
- Google OAuth authentication
- Form for adding books not found via search
- Popular genres visualization
- Reading trends analysis

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
