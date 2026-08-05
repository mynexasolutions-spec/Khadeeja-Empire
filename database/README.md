# Supabase Setup

The Supabase provider is selected only when all of these server environment variables are present and non-placeholder:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Partial configuration raises a configuration error. Query and schema errors are surfaced as provider errors; they do not switch the application to local mode.

## Manual Setup

1. Create a Supabase project.
2. Open the project SQL Editor.
3. Run `database/schema.sql`.
4. Run `database/seed.sql`.
5. Add the three variables to the server deployment environment. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only and never expose it to browser code.
6. Start the application and verify provider selection through the server logs or admin health checks added by later work. Do not log keys or values.

The repository does not run migrations, seed a remote project, or modify Supabase automatically. Re-run the SQL manually when applying schema changes. The local provider remains available when all Supabase variables are absent.
