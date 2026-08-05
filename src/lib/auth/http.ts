import { ConfigurationError } from "../admin/errors";
import { UnauthorizedError } from "./errors";

export function authErrorResponse(error: unknown): Response {
  if (error instanceof UnauthorizedError) {
    return Response.json({ error: error.message }, { status: 401 });
  }

  if (error instanceof ConfigurationError) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ error: "Authentication could not be completed." }, { status: 500 });
}
