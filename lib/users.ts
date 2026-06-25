// lib/users.ts
// In-memory user store — for demo/prototype only.
// Replace with a real database (Prisma, MongoDB, etc.) in production.

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // plaintext for demo; hash with bcrypt in production
  createdAt: string;
}

// Pre-seeded demo account
const seedUsers: User[] = [
  {
    id: "1",
    name: "Demo Trader",
    email: "admin@capitracapital.com",
    password: "123456",
    createdAt: new Date().toISOString(),
  },
];

// Module-level singleton
const usersStore: Map<string, User> = new Map(
  seedUsers.map((u) => [u.email.toLowerCase(), u])
);

export function findUserByEmail(email: string): User | undefined {
  return usersStore.get(email.toLowerCase());
}

export function createUser(name: string, email: string, password: string): User {
  const user: User = {
    id: String(Date.now()),
    name,
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  };
  usersStore.set(user.email, user);
  return user;
}

export function verifyCredentials(email: string, password: string): User | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  if (user.password !== password) return null;
  return user;
}
