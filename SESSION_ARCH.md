🍪 Short-Lived Cookie Session Spec
1. Authentication Flow

On successful login:

Backend generates a session token (opaque ID or JWT).

Backend sets the token in a cookie via Set-Cookie.

Frontend does not handle token storage directly.

2. Cookie Configuration

HttpOnly → prevents JavaScript from accessing the token.

Secure → only transmitted over HTTPS.

SameSite=Strict (or Lax if login redirects need cross-site support).

Max-Age=5h (absolute session lifetime).

Example header:

Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=18000

3. Session Behavior

Session cookie is automatically sent with every request to the backend.

Session persists across tabs and browser restarts until expiry (5h max).

User must re-authenticate after expiry.

4. Backend Responsibilities

Validate the session_id on every request.

Enforce absolute expiry (5h).

Invalidate session on logout (Set-Cookie: session_id=; Max-Age=0).

Optional: maintain a session store (DB or cache) if using opaque tokens.

5. Security Considerations

All endpoints must require HTTPS.

Monitor for session hijacking (e.g., same session used from multiple IPs).

CSRF mitigation:

Prefer SameSite=Strict or Lax.

Optionally use a CSRF token for state-changing requests.

Keep cookies as short-lived as possible (≤5h in this design).