# Project Standards: Isepic Chess UI

## Build & Development

- **Commands:** `npm run prettier`

## Naming Conventions

- **Internal Variables:** `camelCase` (e.g., `default_elm`).
- **Function Parameters:** `snake_case` (e.g., `chess_font`).
- **Private Module Members:** Prefix with underscore `_` (e.g., `_CFG`, `_refreshTable`).
- **Global Constants:** `UPPER_SNAKE_CASE` (e.g., `_ALERT_ERROR`).

## Architecture Patterns

- **Module Pattern:** Maintain the IIFE structure `(function (windw, $, Ic) { ... })`.
- **Flow Control:** Prefer labeled blocks `block: { ... }` to exit logic early using `break block;`.
- **DOM Access:** Use jQuery for selection. IDs must use `ic_ui_` prefix.

## CSS Guidelines

- **Selectors:** Use ID selectors for unique components to ensure high specificity.
- **Classes:** Always prefix with `ic_` (e.g., `.ic_piece_holder`).
