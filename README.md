# FakeShop API

A RESTful API for managing fake shop products. This application integrates with the external [FakeStore API](https://fakestoreapi.com) and adds local storage capabilities for products.

## Features

- Fetch products from external FakeStore API
- Store products locally in PostgreSQL database
- Create new products
- Update product stock
- Delete local products
- Swagger API documentation

## Tech Stack

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript
- [PostgreSQL](https://www.postgresql.org/) - Open source relational database
- [Swagger](https://swagger.io/) - API documentation
- [Docker](https://www.docker.com/) - Containerization

## Prerequisites

- Node.js 20.x or later
- PostgreSQL 16.x (or Docker for containerized setup)
- Git

## Installation

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/savg92/fakeshop-api
   cd fakeshop-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

4. Start the application:
   ```bash
   npm run start:dev
   ```

### Docker Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fakeshop-api
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   The Docker Compose file already contains environment settings for the database.

3. Start the containers:
   ```bash
   docker-compose up
   ```

## API Documentation

Once the application is running, Swagger API documentation is available at:
```
http://localhost:3000/api
```

## API Endpoints

### Health Check
- `GET /` - Check API health status

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get a specific product
- `POST /products` - Create a new product
- `PUT /products/:id/stock` - Update product stock
- `DELETE /products/:id` - Delete a product

## Development

### Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start the application in watch mode
- `npm run start:debug` - Start the application in debug mode
- `npm run start:prod` - Start the production build
- `npm run lint` - Lint the code
<!-- - `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests -->

### Project Structure

```
fakeshop-api/
├── src/
│   ├── common/              # Common utilities, DTOs, filters, interceptors
│   ├── config/              # Application configuration
│   ├── external/            # External API integrations
│   │   └── fakestore/       # FakeStore API integration
│   ├── products/            # Products module
│   └── main.ts              # Application entry point
├── test/                    # Test files
└── ...config files
```

## Database Schema

### Products Table

| Column      | Type          | Description                       |
|-------------|---------------|-----------------------------------|
| id          | integer       | Primary key                       |
| title       | varchar       | Product title                     |
| price       | decimal(10,2) | Product price                     |
| description | text          | Product description               |
| category    | varchar       | Product category                  |
| image       | varchar       | Product image URL                 |
| stock       | integer       | Product stock quantity            |
| isLocal     | boolean       | Flag for local or external product|
| createdAt   | timestamp     | Creation timestamp                |
| updatedAt   | timestamp     | Last update timestamp             |

<!-- ## License

[MIT](LICENSE) -->