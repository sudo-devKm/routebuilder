# Node.js TypeScript Route Builder

A robust and scalable Node.js REST API boilerplate built with TypeScript, Express, and MongoDB. Features a custom route builder pattern for rapid API development with built-in CRUD operations.

## 🚀 Features

- **TypeScript** - Type-safe development with full TypeScript support
- **Custom Route Builder** - Abstract base class for automatic CRUD route generation
- **Express 5** - Latest Express framework with improved performance
- **MongoDB & Mongoose** - NoSQL database with ODM for data modeling
- **Security** - Helmet, CORS, HPP protection, and security best practices
- **Validation** - Schema validation with Zod
- **Error Handling** - Centralized error handling middleware
- **Environment Configuration** - Type-safe environment variables with Envalid
- **Code Quality** - ESLint, Prettier, and Husky for code consistency
- **Development Tools** - Hot-reload with Nodemon, path aliases with tsc-alias
- **Logging** - Request logging with Morgan
- **Docker Support** - Docker Compose setup with MongoDB

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker & Docker Compose** (for containerized MongoDB)
- **Git**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd node-typescript-routebuilder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Application
NODE_ENV=development
PORT=5000

# Database
DB_URI=mongodb://admin:admin@localhost:27020/appDb?authSource=admin

# MongoDB Credentials (for Docker Compose)
MONGO_USERNAME=admin
MONGO_PASSWORD=admin
MONGO_DATABASE=appDb
```

**Important:** Add `.env` to your `.gitignore` file to avoid committing sensitive data.

## 🐳 Running with Docker

### Start MongoDB Container

```bash
docker-compose up -d
```

This will start a MongoDB container with:

- Port: `27020` (mapped to `27017` internally)
- Health checks enabled
- Resource limits configured
- Persistent volumes for data storage

### Stop MongoDB Container

```bash
docker-compose down
```

### Stop and Remove Volumes

```bash
docker-compose down -v
```

## 🚀 Running the Application

### Development Mode (with hot-reload)

```bash
npm run dev
```

The server will start on `http://localhost:5000` with automatic restart on file changes.

### Production Build

```bash
# Build the project
npm run build

# Start the production server
npm start
```

### Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Build and start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically

## 📁 Project Structure

```
├── src/
│   ├── app.ts                      # Express app configuration
│   ├── index.ts                    # Application entry point
│   ├── @types/                     # Custom TypeScript declarations
│   │   └── global/
│   ├── config/                     # Configuration files
│   │   └── index.ts                # Environment variables
│   ├── database/                   # Database connection
│   │   └── dbConnect.ts
│   ├── exceptions/                 # Custom exception classes
│   │   └── http.exception.ts
│   ├── interfaces/                 # TypeScript interfaces
│   │   └── route.interface.ts
│   ├── lib/
│   │   └── route-builder/          # Custom Route Builder Library
│   │       ├── base.route.ts       # Abstract base route class
│   │       ├── generator.ts        # CRUD generator
│   │       ├── constants/
│   │       ├── interfaces/
│   │       └── types/
│   ├── middlewares/                # Express middlewares
│   │   └── errorHandler.ts
│   ├── models/                     # Mongoose models
│   │   └── post.entity.ts
│   ├── routes/                     # API routes
│   │   ├── index.ts
│   │   └── posts/
│   │       └── posts.route.ts
│   └── types/                      # Type definitions
├── docker-compose.yml              # Docker configuration
├── tsconfig.json                   # TypeScript configuration
├── nodemon.json                    # Nodemon configuration
└── package.json                    # Dependencies and scripts
```

## 🏗️ Route Builder Pattern

The custom Route Builder provides automatic CRUD operations for your entities:

### Creating a New Route

1. **Define your Mongoose Model** (e.g., `post.entity.ts`)

```typescript
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true },
);

export const PostModel = mongoose.model('Post', postSchema);
```

2. **Create a Route Class** (e.g., `posts.route.ts`)

```typescript
import { Base } from '@/lib/route-builder/base.route';
import { PostModel } from '@/models/post.entity';

class PostsRoute extends Base<typeof PostModel> {
  constructor() {
    super({
      path: '/posts',
      model: PostModel,
    });
  }
}

export default new PostsRoute();
```

3. **Register the Route** in `routes/index.ts`

```typescript
import PostsRoute from './posts/posts.route';

export default [PostsRoute];
```

### Auto-Generated Endpoints

The Route Builder automatically creates the following endpoints:

- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create new post
- `PATCH /posts/:id` - Update post (partial)
- `PUT /posts/:id` - Replace post (full)
- `DELETE /posts/:id` - Delete post

### Customization

You can override default behavior using lifecycle hooks:

```typescript
class PostsRoute extends Base<typeof PostModel> {
  protected beforePost = async (req, res, next) => {
    // Custom validation or logic before creating a post
    next();
  };

  protected afterGet = async (req, res, next) => {
    // Custom logic after fetching a post
    next();
  };
}
```

## 🔒 Security Features

- **Helmet** - Sets security-related HTTP headers
- **CORS** - Cross-Origin Resource Sharing enabled
- **HPP** - HTTP Parameter Pollution protection
- **Compression** - Response compression
- **Cookie Parser** - Secure cookie parsing

## 🧪 Testing

```bash
# Run tests (add your test framework)
npm test
```

## 📝 API Documentation

Once the server is running, you can test the API using tools like:

- **Postman**
- **Insomnia**
- **cURL**
- **Thunder Client** (VS Code Extension)

### Example Request

```bash
# Create a new post
curl -X POST http://localhost:5000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Post","content":"Hello World","author":"John Doe"}'

# Get all posts
curl http://localhost:5000/posts

# Get post by ID
curl http://localhost:5000/posts/:id
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

Keyur Machhi

## 🙏 Acknowledgments

- Express.js community
- TypeScript team
- All contributors who help improve this project

---

**Happy Coding! 🎉**
