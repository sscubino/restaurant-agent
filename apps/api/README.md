# Restaurant API

This is a NestJS API using PostgreSQL and TypeORM.

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your database configuration and JWT secret.

3. Start the application:

```bash
# Development
pnpm run start:dev

# Production
pnpm run build
pnpm run start:prod
```

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=resto_api

# JWT Configuration
JWT_SECRET=your-very-secure-secret-key-change-this-in-production

# Application
NODE_ENV=development
PORT=3000
```

## Creating the First Super User

Since user creation requires super user privileges, you'll need to manually create the first super user in the database:

```sql
INSERT INTO users (id, first_name, last_name, email, password, is_super_user, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Admin',
  'User',
  'admin@example.com',
  '$2b$10$hash_of_your_password', -- Use bcrypt to hash 'password123'
  true,
  NOW(),
  NOW()
);
```

Or use a database seeder/migration to create the initial admin user.

## Guards

### JwtAuthGuard

Protects routes requiring authentication. Validates JWT token and attaches user to request.

### SuperUserGuard

Protects routes requiring super user privileges. Must be used with JwtAuthGuard.

Usage:

```typescript
@UseGuards(JwtAuthGuard, SuperUserGuard)
@Get('admin-only')
adminOnly() {
  return 'Only super users can access this';
}
```
