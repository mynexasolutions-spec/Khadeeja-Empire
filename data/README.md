# Local Admin Data

When Supabase is not fully configured, the server-only local provider stores its data at:

```text
<project-root>/.data/khadeeja-admin.json
```

The file is initialized from the current Khadeeja Empire content modules when it does not exist. Writes use a temporary file followed by an atomic rename, and the `.data/` directory is ignored by Git. It is outside `public/` and is never a storefront asset.

Delete the file only when intentionally resetting local development data. Invalid JSON is reported as a storage error rather than silently reseeded.
