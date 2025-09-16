<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Ajjmal-v2 Backend API

A NestJS backend API with Prisma ORM integration for the Ajjmal-v2 project.

## Description

This is the backend API for the Ajjmal-v2 project, built with:
- **NestJS** - A progressive Node.js framework for building efficient and scalable server-side applications
- **Prisma** - Next-generation ORM for TypeScript & Node.js
- **SQLite** - Lightweight database for development (can be easily switched to PostgreSQL/MySQL)

## Features

- RESTful API with CRUD operations
- Database integration with Prisma ORM
- User management endpoints
- **Authentication & Authorization** - JWT-based authentication with role-based access control
- **Password Security** - Bcrypt hashing for secure password storage
- **Multi-role Support** - Users can have multiple roles (CUSTOMER, VENDOR, DELIVERY_PERSON, SYSTEM_STAFF)
- TypeScript support
- Hot reload in development
- Built-in validation and error handling

## API Endpoints

### Authentication
- `POST /auth/login` - Login with email/phone and password
- `POST /auth/register` - Register a new user
- `POST /auth/validate-credential` - Validate user credentials (for NextAuth.js integration)
- `GET /auth/profile` - Get authenticated user profile (requires JWT token)

### Users
- `GET /users` - Get all users
- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user by ID
- `DELETE /users/:id` - Delete user by ID

### Example User Object
```json
{
  "id": 1,
  "email": "user@example.com",
  "phoneNumber": "+1234567890",
  "fullName": "John Doe",
  "roles": ["CUSTOMER"],
  "createdAt": "2025-09-16T15:41:24.353Z",
  "updatedAt": "2025-09-16T15:41:24.353Z"
}
```

### Example Authentication Request/Response
```json
// POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "phoneNumber": "+1234567890",
    "fullName": "John Doe",
    "roles": ["CUSTOMER"]
  }
}
```

## Project setup

```bash
$ npm install
```

## Environment Setup

Create a `.env` file in the backend directory:

```env
# Database URL for development (SQLite)
DATABASE_URL="file:./dev.db"

# JWT Secret (change in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

## Database setup

```bash
# Generate Prisma client
$ npx prisma generate

# Run database migrations
$ npx prisma migrate dev

# Seed the database with test users
$ npm run seed

# View database in Prisma Studio (optional)
$ npx prisma studio
```

## Test Users for Login

After seeding, you can use these credentials to test login functionality:

- **Email:** `admin-01@ecme.com` / **Password:** `123Qwe` (Customer - matches frontend demo)
- **Email:** `admin@ecme.com` / **Password:** `123Qwe` (System Admin)
- **Email:** `vendor@ecme.com` / **Password:** `123Qwe` (Vendor)
- **Email:** `delivery@ecme.com` / **Password:** `123Qwe` (Delivery Person)
- **Email:** `multi@ecme.com` / **Password:** `123Qwe` (Customer + Vendor)

See [SEEDING.md](./SEEDING.md) for complete details.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
