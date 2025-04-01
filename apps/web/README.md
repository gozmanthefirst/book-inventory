# Books Inventory Frontend

A modern web application for managing books, built with Next.js and Google Books API.

## Features

- Browse book catalog
- Add, edit, and remove books
- Search and filter functionality

## Prerequisites

- Node.js >= v20.11.0
- pnpm >= 8.0.0

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/gozmanthefirst/book-inventory-fe.git
   cd book-inventory-fe
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration. You can access the backend [here](https://github.com/gozmanthefirst/book-inventory-be.git)

4. Start the development server:

   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`

## Future Features

- Dark mode
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
