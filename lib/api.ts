/**
 * lib/api.ts
 *
 * Industry-standard API utilities for Next.js route handlers.
 *
 * Provides:
 *   - ApiError       — structured error class for consistent error responses
 *   - requireAuth()  — session guard returning typed { userId, email }
 *   - requireAdmin() — like requireAuth() but also checks for admin email
 *   - ok()           — typed success response helper
 *   - withHandler()  — wraps a handler with try/catch, converts ApiError → JSON
 *   - parseBody()    — parse + Zod-validate a request body in one call
 *
 * Usage in a route file:
 *
 *   export const GET = withHandler(async () => {
 *     const { userId } = await requireAuth();
 *     const trades = await prisma.trade.findMany({ where: { userId } });
 *     return ok({ trades });
 *   });
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, ADMIN_EMAIL } from "@/lib/auth";
import { ZodSchema } from "zod";

// ─── Error Codes ──────────────────────────────────────────────────────────────

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_ERROR"
  | "SERVICE_UNAVAILABLE";

// ─── ApiError ─────────────────────────────────────────────────────────────────

/**
 * Throw this anywhere inside a withHandler-wrapped route to return a
 * structured JSON error response with the correct HTTP status.
 */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: ErrorCode = "INTERNAL_ERROR"
  ) {
    super(message);
    this.name = "ApiError";
  }

  // Convenience constructors matching common HTTP errors
  static unauthorized(msg = "Authentication required.") {
    return new ApiError(401, msg, "UNAUTHORIZED");
  }

  static forbidden(msg = "You do not have permission to perform this action.") {
    return new ApiError(403, msg, "FORBIDDEN");
  }

  static notFound(msg = "Resource not found.") {
    return new ApiError(404, msg, "NOT_FOUND");
  }

  static badRequest(msg: string) {
    return new ApiError(400, msg, "BAD_REQUEST");
  }

  static conflict(msg: string) {
    return new ApiError(409, msg, "CONFLICT");
  }

  static tooManyRequests(msg = "Too many requests. Please try again later.") {
    return new ApiError(429, msg, "TOO_MANY_REQUESTS");
  }
}

// ─── Typed Session ────────────────────────────────────────────────────────────

export interface AuthContext {
  userId: string;
  email: string;
}

/**
 * Retrieves the current session and returns { userId, email }.
 * Throws ApiError(401) if the user is not authenticated.
 */
export async function requireAuth(): Promise<AuthContext> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw ApiError.unauthorized();
  }

  const user = session.user as { id?: string; email?: string | null };

  if (!user.id) {
    throw ApiError.unauthorized("Session is missing user ID. Please sign in again.");
  }

  return {
    userId: user.id,
    email: user.email ?? "",
  };
}

/**
 * Like requireAuth(), but also verifies the user is the admin.
 * Throws ApiError(403) if the user is not an admin.
 */
export async function requireAdmin(): Promise<AuthContext> {
  const ctx = await requireAuth();

  if (ctx.email !== ADMIN_EMAIL) {
    throw ApiError.forbidden("Admin privileges required.");
  }

  return ctx;
}

// ─── Response Helpers ─────────────────────────────────────────────────────────

/**
 * Returns a 200 JSON response. Pass your data payload directly.
 *
 * @example
 *   return ok({ trades, activeAccount });
 *   return ok({ message: "Updated successfully." });
 */
export function ok<T extends Record<string, unknown>>(
  data: T,
  status = 200
): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * Returns a 201 Created JSON response.
 */
export function created<T extends Record<string, unknown>>(data: T): NextResponse {
  return ok(data, 201);
}

/**
 * Parses the request body as JSON and validates it against a Zod schema.
 * Throws ApiError(400) with the first validation error message on failure.
 *
 * @example
 *   const { email, password } = await parseBody(req, registerSchema);
 */
export async function parseBody<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw ApiError.badRequest("Request body is missing or not valid JSON.");
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const firstError = result.error.issues[0];
    throw ApiError.badRequest(firstError?.message ?? "Invalid request data.");
  }
  return result.data;
}

// ─── withHandler ─────────────────────────────────────────────────────────────

type RouteHandler = (req: NextRequest) => Promise<NextResponse>;

/**
 * Wraps a Next.js route handler with:
 *   1. Global try/catch — no more per-handler try/catch boilerplate
 *   2. ApiError → structured JSON error response
 *   3. Unknown errors → 500 with a safe generic message (stack never exposed)
 *
 * @example
 *   export const GET = withHandler(async (req) => {
 *     const { userId } = await requireAuth();
 *     return ok({ data: await fetchSomething(userId) });
 *   });
 */
export function withHandler(fn: RouteHandler): RouteHandler {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await fn(req);
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(
          { error: err.message, code: err.code },
          { status: err.statusCode }
        );
      }

      // Unknown error — log server-side, never expose stack to client
      console.error(`[API Error] ${req.method} ${req.nextUrl.pathname}:`, err);
      return NextResponse.json(
        { error: "An unexpected error occurred. Please try again." },
        { status: 500 }
      );
    }
  };
}
