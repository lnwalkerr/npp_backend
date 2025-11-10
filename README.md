# Backend - Node.js API Server

This is the backend API server built with Node.js, Express, and TypeScript.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your configuration:
```bash
# Backend Environment Variables
PORT=3001
MONGODB_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=your_jwt_secret_key_here
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_bucket_name
NODE_ENV=development
```

3. Run the development server:
```bash
npm run start
```

## Available Scripts

- `npm run start` - Start development server with nodemon
- `npm run local` - Run with ts-node directly
- `npm run build` - Compile TypeScript to JavaScript
- `npm run seed:events` - Seed events data
- `npm run seed:videos` - Seed videos data
- `npm run seed:leaders` - Seed leaders data
- `npm run seed:news` - Seed news data

## Structure

- `src/controllers/` - API controllers
- `src/models/` - Mongoose models
- `src/routers/` - Express routes
- `src/middlewares/` - Custom middlewares
- `src/utils/` - Utility functions
- `src/seeders/` - Data seeders
- `uploads/` - File uploads directory

## API Endpoints

The server provides RESTful API endpoints for:
- Admin management
- User authentication
- Events, news, videos, leaders management
- File uploads
- And more...
