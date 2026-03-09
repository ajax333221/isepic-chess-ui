<p align="center"><a href="https://github.com/ajax333221/isepic-chess-ui?tab=readme-ov-file#book-documentation">« Return</a></p>

# IcUi Methods

Isepic Chess UI library `isepic-chess-ui.js` has the following available methods.

## Quick Reference

| Method                               | Returns   | UI? | Brief                                                      |
| ------------------------------------ | --------- | --- | ---------------------------------------------------------- |
| [`IcUi.setCfg()`](#icuisetcfg)       | `Boolean` | ✓   | Overwrites a configuration option with a new value.        |
| [`IcUi.pushAlert()`](#icuipushalert) | -         | -   | Pushes an alert directly to #ic_ui_push_alerts_top and ... |

## Method Details

---

### `IcUi.setCfg(...)`

> 🔄 **Triggers UI refresh**

Overwrites a configuration option with a new value.

Valid options are:

- **chessFont** — Default: `"merida"` (String)
- **chessTheme** — Default: `"wood"` (String)
- **boardLabels** — Default: `true` (Boolean)
- **boardInteractions** — Default: `true` (Boolean)
- **soundEffects** — Default: `true` (Boolean)
- **pieceAnimations** — Default: `true` (Boolean)
- **pieceDragging** — Default: `true` (Boolean)
- **highlightChecks** — Default: `true` (Boolean)
- **highlightLastMove** — Default: `true` (Boolean)
- **highlightLegalMoves** — Default: `true` (Boolean)
- **highlightSelected** — Default: `true` (Boolean)
- **scrollNavigation** — Default: `true` (Boolean)
- **interactivePromotion** — Default: `true` (Boolean)
- **arrowKeysNavigation** — Default: `false` (Boolean)
- **moveTooltip** — Default: `false` (Boolean)
- **moveTooltipSize** — Default: `250` (Number)
- **animationTime** — Default: `300` (Number)
- **draggingTime** — Default: `50` (Number)
- **scrollingTime** — Default: `60` (Number)
- **pushAlertsTime** — Default: `5000` (Number)

<details>
<summary><strong>Parameters</strong></summary>

- `option` `(String)`
- `value` `(mixed types)`

</details>

**Returns:**

- `Boolean`

**Examples:**

```javascript
IcUi.setCfg('arrowKeysNavigation', true);
IcUi.setCfg('soundEffects', false);
```

---

### `IcUi.pushAlert(...)`

Pushes an alert directly to **#ic_ui_push_alerts_top** and **#ic_ui_push_alerts_bottom** components.

Valid options for **className** are:

- `"light"` (default)
- `"dark"`
- `"success"`
- `"warning"`
- `"error"`

> [!TIP]
> To both push the alert to the UI and to the console (`console.log()`, `console.warn()` or `console.error()` depending on the **className**) you can use `Ic.utilityMisc.consoleLog(...)` instead, just make sure **silent mode** is not on (you can disable it with `Ic.setSilentMode(false)`).

<details>
<summary><strong>Parameters</strong></summary>

- `message` `(String)` — _optional_
- `className` `(String)` — _optional_

</details>

**Returns:** None

**Examples:**

```javascript
IcUi.pushAlert('Simple alert');
IcUi.pushAlert('[Header]: simple alert with header');
IcUi.pushAlert('Alert with light style', 'light');
IcUi.pushAlert('Alert with dark style', 'dark');
IcUi.pushAlert('Alert with success style', 'success');
IcUi.pushAlert('Alert with warning style', 'warning');
IcUi.pushAlert('Alert with error style', 'error');
```

<p align="center"><a href="https://github.com/ajax333221/isepic-chess-ui?tab=readme-ov-file#book-documentation">« Return</a></p>
