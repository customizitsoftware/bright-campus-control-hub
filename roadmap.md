# SchoolOS first slice

## Current request
- [x] Restore compilation; automatic route-tree regeneration and harness build/typecheck are clean.
- [x] Protect the existing console, load real workspace and school selector, and display server access modes.
- [x] Reflect profile completion on the dashboard and remove obsolete shell/setup pending notices.
- [x] Run 13 regression tests; verify login, payment-return, auth redirect and signed-out console redirect on desktop/mobile.
- [ ] Verify pricing and registration content: blocked by external Supabase `permission denied for function is_platform_admin`; database permissions are outside this request.
- [ ] Verify signed-in workspace and setup with a real account: external unmanaged connection has no available authenticated browser session.

## Earlier scope (deferred; not part of the current two-item request)
- [ ] Typed existing-backend access and authentication; protected school and platform routes.
- [ ] Public data-driven pricing and registration/payment-return wizard.
- [ ] School membership shell, access-mode banners, and entitlement hook.
- [ ] School-admin subscription billing and separate platform console.
- [ ] Tests, public-flow checks, and verification limitations documented.