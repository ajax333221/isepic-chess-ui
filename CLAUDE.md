# Project Standards: Isepic Chess UI

## Build & Development

- **Commands:** `npm run prettier`

## Code Style & Rules

- **Functions:** Use `camelCase` (e.g., `tooltipSizeHelper`).
- **Internal Variables:** Use `snake_case` (e.g., `default_elm`, `max_size`).
- **Function Parameters:** Use `snake_case` (e.g., `chess_font`, `new_size`).
- **Private Module Members:** Prefix with underscore `_` (e.g., `_CFG`, `_refreshTable`).
- **Global Constants:** `UPPER_SNAKE_CASE` (e.g., `_ALERT_ERROR`).
- **Flow Control (Pseudo-Single Return):** Use labeled blocks `block: { ... }` with `break block;` to exit specific logic segments early. This is a project-specific pattern to avoid deeply nested `if` statements while maintaining a single exit point at the end of the function. Do not refactor these into standard `if/else` or multiple `return` statements.
- **Module Pattern:** Maintain the IIFE structure `(function (windw, Ic) { ... })`.
- **Legacy Compatibility:** Use modern Vanilla JS (ES6+); Use `var` only if strictly necessary for scope, otherwise prefer `let/const`.
- **DOM Access:** Use `document.querySelector` and `document.getElementById`. Use native Web APIs for event listeners (`addEventListener`).
- **Zero Dependency:** No new npm packages. Use native Web APIs only.

## CSS Guidelines

- **Selectors:** Use ID selectors for unique components to ensure high specificity.
- **Classes:** Always prefix with `ic_` (e.g., `.ic_piece_holder`).
