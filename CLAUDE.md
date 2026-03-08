# Project Standards: Isepic Chess UI

## Build & Development

- **Commands:** `npm run prettier`

## Code Style & Rules

- **Internal Variables:** `camelCase` (e.g., `default_elm`).
- **Function Parameters:** `snake_case` (e.g., `chess_font`).
- **Private Module Members:** Prefix with underscore `_` (e.g., `_CFG`, `_refreshTable`).
- **Global Constants:** `UPPER_SNAKE_CASE` (e.g., `_ALERT_ERROR`).
- **Flow Control (Pseudo-Single Return):** Use labeled blocks `block: { ... }` with `break block;` to exit specific logic segments early. This is a project-specific pattern to avoid deeply nested `if` statements while maintaining a single exit point at the end of the function. Do not refactor these into standard `if/else` or multiple `return` statements.
- **Legacy Compatibility:** Maintain compatibility with the current codebase; use `var` for module-scoped variables and jQuery for DOM manipulation.
- **Module Pattern:** Maintain the IIFE structure `(function (windw, $, Ic) { ... })`.
- **DOM Access:** Use jQuery for selection. IDs must use `ic_ui_` prefix.

## CSS Guidelines

- **Selectors:** Use ID selectors for unique components to ensure high specificity.
- **Classes:** Always prefix with `ic_` (e.g., `.ic_piece_holder`).
