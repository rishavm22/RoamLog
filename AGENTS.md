# RoamLog — Agent Collaboration Guidelines (`AGENTS.md`)

This document defines expectations, task workflows, and guardrails for automated coding agents operating in the **RoamLog** repository.

---

## 🛡️ Non-Negotiable Guardrails

1. **Branding Integrity**:
   - The application is **RoamLog**.
   - Do NOT introduce any reference to legacy naming (e.g. `TravelMemory`).
2. **Platform & Shell Compatibility**:
   - The operating environment is **Windows with PowerShell**.
   - Do not use Linux-specific bash pipes or commands (`ls -la`, `grep`, `cat` unless supported aliases).
   - When listing or searching files with PowerShell, **always ignore `node_modules`** to avoid blocking background tasks or timing out:
     ```powershell
     Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch "node_modules|\.git|build|dist" }
     ```
3. **Database & Credential Safety**:
   - Never commit plaintext MongoDB credentials or expose `.env` contents.
   - Any modifications to `backend/.env` or `frontend/.env` must respect format constraints (e.g. percent-encoding special characters in connection strings).

---

## 🛠️ Workflows

### 1. Modifying the Backend
- File entry point: `backend/index.js`
- Schema changes: `backend/models/trip.model.js`
- Route handlers: `backend/controllers/trip.controller.js`
- Route definitions: `backend/routes/trip.routes.js`
- Always verify code syntax with `node -c <file>` after editing JavaScript files in `backend/`.

### 2. Modifying the Frontend
- Entry point: `frontend/src/index.js` & `frontend/src/App.js`
- Pages: `frontend/src/components/pages/`
- Reusable UI: `frontend/src/components/UIC/`
- API URL resolution: `frontend/src/url.js`
- Always verify that production builds succeed by running:
  ```powershell
  cd frontend; npm run build
  ```

### 3. Adding New Journey Attributes
When adding new fields to a journey:
1. Update `backend/models/trip.model.js` with field name, type, and defaults.
2. Update `backend/controllers/trip.controller.js` if custom sanitization/validation is required.
3. Update `frontend/src/components/pages/AddExperience.js` to include the form input and state handler.
4. Update `frontend/src/components/pages/ExperienceDetails.js` and card components (`Card.js`, `FeaturedCard.js`) to display the new information.
5. Update docs in `README.md`, `GEMINI.md`, and `backend/GEMINI.md`.

---

## 🧪 Testing and Verification Checklist

Before completing any task, ensure:
- [ ] No syntax errors in backend scripts (`node -c <file>`).
- [ ] Frontend compiles cleanly (`npm run build` inside `frontend/`).
- [ ] No regression of form validation logic (dates, costs, required inputs).
- [ ] Zero remnant mentions of `TravelMemory`.
