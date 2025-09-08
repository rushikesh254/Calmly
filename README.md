## Calmly – Codebase Overview & Developer Guide

Human‑readable refactor of the existing Next.js application preserving UI, routes, imports, and runtime behavior while improving clarity, resilience, and accessibility.

### Stack
- Next.js (App Router) + React (client components)
- Tailwind CSS utility styling
- JWT auth (tokens stored in localStorage: `accessToken` / fallback `token`)
- Cloudinary signed uploads for video resources

### High‑Level Structure
```
client/
	app/               # App Router entrypoints & route segments
	components/        # Reusable UI + dashboard feature components
	lib/               # fetch helpers, utilities
	ui/                # Small primitive components (buttons, inputs, etc.)
server/              # (Placeholder / future backend integration)
```

### Refactor Goals Achieved
1. Preserve UI design & visual classes 1:1.
2. Remove `alert`, `confirm`, `window.location.reload` in favor of inline, accessible patterns.
3. Add consistent dialog semantics (`role="dialog"`, `aria-modal`, labelled headings, focus return).
4. Inline feedback via aria live regions (`aria-live="polite"` or role `alert`).
5. Defensive fetch patterns: graceful failures; silent logging only where safe.
6. Clear state naming & comments; eliminated opaque variables.

### Accessibility Patterns
| Concern | Pattern |
| ------- | ------- |
| Modal/Dialog | Container: `role="dialog" aria-modal="true" aria-labelledby="<title-id>`; focus moved to first interactive control, restored on close. |
| Status Messages | Hidden live region + visible banner (`role=alert` for errors, `role=status` for success). |
| Toggle Buttons | `aria-pressed` for category / filter selections. |
| Navigation | `aria-current="page"` on active admin nav links; skip link in admin layout. |
| Confirmation | Custom confirmation dialog replaces `window.confirm`. |

### Auth Token Helper (pattern)
Every secure fetch attempts: `localStorage.getItem('accessToken') || localStorage.getItem('token')` when `window` is defined. Failure to find token results in inline error feedback instead of hard navigation.

### Resource Upload Flow (Video)
1. Request signed upload metadata from backend (`/api/sign-upload`).
2. POST file directly to Cloudinary (timestamp, signature, api_key, folder).
3. Persist resulting `secure_url` plus resource metadata to `/api/resources`.

### Dialog Focus Management
Lightweight approach: store `document.activeElement` before opening; after close, restore focus if still mounted. Avoids external dependencies & maintains minimal surface.

### Files With Notable Patterns
| File | Purpose |
| ---- | ------- |
| `client/app/admin/components/mh-admin/Resources.jsx` | Resource creation with accessible feedback + auto-dismiss success. |
| `client/app/admin/components/mh-admin/ViewResources.jsx` | Resource listing, filtering, deletion confirm & article reader modal. |
| `client/components/dashboard/attendee/Journal.jsx` | CRUD with custom delete confirmation dialog & error banner. |
| `client/components/dashboard/mhp/MHPSessionCard.jsx` | Session state transitions & recommendation editor (inline validation). |
| `client/app/admin/components/general-admin/SessionsInformation.jsx` | Admin sessions with details dialog. |

### Adding a New Modal
1. Track `open` state + `previousFocusRef`.
2. On open: capture `document.activeElement`; focus close button (or first focusable).
3. Provide heading with id + map to dialog via `aria-labelledby`.
4. Provide a visible close button with `aria-label` text.
5. On unmount or close: restore previous focus.

### Error Handling Conventions
- Network errors: caught and set into local error state; user is informed within component boundary.
- JSON parse guarded by `response.ok` checks; defensive optional chaining when reading error objects.
- Silent console logging only in admin / maintenance views where user feedback remains minimal.

### Development
Install deps (root + client if isolated packaging was used initially). Presently, primary `package.json` lives at repo root and another inside `client/` (if used for modularization). Ensure you run installs where necessary.

```powershell
# From repository root
npm install

# If client has its own dependencies
cd client
npm install
```

Run dev server (Next.js in `client/`):
```powershell
cd client
npm run dev
```

### Linting / Formatting
An `eslint.config.mjs` is present under `client/`. Run:
```powershell
cd client
npm run lint
```

### Building
```powershell
cd client
npm run build
```

### Testing (Manual Focus Areas)
| Feature | Manual Check |
| ------- | ------------ |
| Resource creation (article & video) | Message banner appears; success auto-dismisses; no layout shift. |
| Resource deletion | Confirmation dialog traps initial focus; ESC or close restores prior trigger focus. |
| Journal delete | Custom dialog appears; cancel restores focus to Delete button. |
| MHP Recommendation | Empty submit triggers inline validation (no alert). |
| Sessions / Profiles dialogs | All have labelled headings & close button with `aria-label`. |

### Future Improvements
- Extract small `Dialog` & `LiveMessage` helpers to reduce repetition.
- Add unit tests (React Testing Library) for dialog open/close focus behavior.
- Centralize auth token retrieval to a single utility.
- Consider server actions / RSC data loaders where supported to reduce client fetch duplication.

### Contributing Guidelines (Lightweight)
1. Preserve existing class names unless intentionally changing UI.
2. Prefer functional, accessible replacements over browser primitives (no `alert` / `confirm`).
3. Keep new state keys explicit (`isLoadingDelete`, `feedback`, etc.).
4. Provide a short comment when adding non-obvious logic (especially around focus management or retries).

### License
Current repository did not include a license file. Add one (MIT, Apache 2.0, etc.) if open sourcing.

---
Refactor complete: parity maintained, readability & accessibility upgraded. For questions or further enhancements, review the patterns above.

