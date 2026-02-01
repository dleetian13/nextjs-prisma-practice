TIP: The fifth (schema) and the sixth (migration) is the most important part!

First, create a Postgresql database. Remember that Postgresql is case-sensitive.

```bash
sudo systemctl start postgresql
psql -U <role or username>

# Drop database
DROP DATABASE IF EXISTS <database_name>
CREATE DATABASE <database_name>

# Connect to the database
\c <database_name>
```

Second, install prisma for dev `pnpm add -D prisma @types/pg` and the client `pnpm add @prisma/client @prisma/adapter-pg pg`
- `prisma`. CLI for generating and managing your database schema.
- `@prisma/client`. Runtime client you use in your code to query the database.

Third, initialize Prisma `pnpm prisma init --db --output ../app/generated/prisma`. This creates `prisma/schema.prisma` which is your database schema file. It also creates `.env` where you must update the "DATABASE_URL." The `--db` flag for database-first-setup, which scans your existing database and creates schema. `--output` changes the location of the generated Prisma folder once we `prisma generate` or `prisma migrate dev`.

```env
```
DATABASE_URL="postgresql://username:password@localhost:5432/database?schema=public"
- `?schema=public` is the default schema.

Fourth, edit `schema.prisma` datasource.

```prisma
datasource db {
  provider = "posgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

Fifth, add a model in the schema.

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

Sixth, after every update of the schema, run migrate (only works in SQL databases). `prisma migrate dev --name init` generates tables in the PostgreSQL database and also generates the Prisma Client. Then `pnpm prisma generate`. Check the database visually using `pnpm prisma studio`.

```bash
pnpm prisma migrate dev --name init
```

Seventh, use Prisma in Next.js.
`lib/prisma.ts`
```ts
import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

Example snippet (This is so wrong in so many levels, it doesn't utilize nextjs functions):

```ts
import type { NextApiRequest, NextApiResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    const {name, email} = req.body;
    const user = await prisma.user.create({ data: {name, email}});
    res.status(201).json(user);
  } else {
    res.status(405).end();
  }
}
```

****

Granting access to local database `psql -U postgres -h localhost -d postgres
` then execute:
```bash
-- Give schema usage and creation rights
GRANT USAGE, CREATE ON SCHEMA public TO <username>;

-- Give full access to existing tables and sequences
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO <username>;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO <username>;

-- Ensure future tables and sequences automatically grant privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO <username>;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO <username>;
```
