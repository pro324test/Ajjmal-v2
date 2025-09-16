# Ajjmal-v2

Full-stack application with NextJS frontend and NestJS backend.

## Project Structure

- `Ecme - NextJs Tailwind Admin Template/` - Frontend admin dashboard built with NextJS and Tailwind CSS
- `backend/` - NestJS API backend with Prisma ORM

## Backend API

The backend is a NestJS application with Prisma ORM integration. To get started:

```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

The API will be available at `http://localhost:3000`

## Frontend

The frontend is a NextJS admin template with Tailwind CSS. See the respective directories for setup instructions.

## Development

1. Start the backend API:
   ```bash
   cd backend
   npm run start:dev
   ```

2. Start the frontend (see frontend documentation for specific commands)

3. The backend API will be available at `http://localhost:3000`
   - Users API: `http://localhost:3000/users`