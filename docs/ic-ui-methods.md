<p align="center"><a href="https://github.com/ajax333221/isepic-chess-ui?tab=readme-ov-file#book-documentation">« Return</a></p>

# IcUi Methods

Isepic Chess UI library `isepic-chess-ui.js` has the following available methods.

## Quick Reference

| Method | Returns | UI? | Brief |
|--------|---------|-----|-------|
| [`IcUi.setCfg()`](#icuisetcfg) | `Boolean` | ✓ | Overwrites a configuration option with a new value. |
| [`IcUi.pushAlert()`](#icuipushalert) | - | - | Pushes an alert directly to #ic_ui_push_alerts_top and ... |
| [`IcUi.drawCircle()`](#icuidrawcircle) | - | - | Draws a circular highlight on a specific square. |
| [`IcUi.drawArrow()`](#icuidrawarrow) | - | - | Draws a directional arrow between two squares. |
| [`IcUi.clearCircle()`](#icuiclearcircle) | - | - | Removes a specific circular highlight if it exists. |
| [`IcUi.clearArrow()`](#icuicleararrow) | - | - | Removes a specific arrow between two squares if it exis... |
| [`IcUi.clearMarkers()`](#icuiclearmarkers) | - | - | Clears all markers (both arrows and circles) from the b... |

## Method Details

---

### `IcUi.setCfg(...)`

> 🔄 **Triggers UI refresh**

Overwrites a configuration option with a new value.

Valid options are:
- **chessFont** - Default: `"merida"` (String)
- **chessTheme** - Default: `"wood"` (String)
- **boardLabels** - Default: `true` (Boolean)
- **boardInteractions** - Default: `true` (Boolean)
- **soundEffects** - Default: `true` (Boolean)
- **pieceAnimations** - Default: `true` (Boolean)
- **pieceDragging** - Default: `true` (Boolean)
- **highlightChecks** - Default: `true` (Boolean)
- **highlightLastMove** - Default: `true` (Boolean)
- **highlightLegalMoves** - Default: `true` (Boolean)
- **highlightSelected** - Default: `true` (Boolean)
- **scrollNavigation** - Default: `true` (Boolean)
- **interactivePromotion** - Default: `true` (Boolean)
- **arrowKeysNavigation** - Default: `false` (Boolean)
- **moveTooltip** - Default: `false` (Boolean)
- **moveTooltipSize** - Default: `250` (Number)
- **animationTime** - Default: `300` (Number)
- **draggingTime** - Default: `50` (Number)
- **scrollingTime** - Default: `60` (Number)
- **pushAlertsTime** - Default: `5000` (Number)

<details>
<summary><strong>Parameters</strong></summary>

- `option` `(String)`
- `value` `(mixed types)`

</details>

**Returns:**

- `Boolean`

**Examples:**

```javascript
IcUi.setCfg("arrowKeysNavigation", true)
IcUi.setCfg("soundEffects", false)
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

- `message` `(String)` — *optional*
- `className` `(String)` — *optional*

</details>

**Returns:** None

**Examples:**

```javascript
IcUi.pushAlert("Simple alert")
IcUi.pushAlert("[Header]: simple alert with header")
IcUi.pushAlert("Alert with light style", "light")
IcUi.pushAlert("Alert with dark style", "dark")
IcUi.pushAlert("Alert with success style", "success")
IcUi.pushAlert("Alert with warning style", "warning")
IcUi.pushAlert("Alert with error style", "error")
```

---

### `IcUi.drawCircle(...)`

Draws a circular highlight on a specific square.

The Boolean option `isToggle` defaults to `false` when not set to a Boolean value of `true`.

Accepted values for `color` are the strings `"red"`, `"green"`, `"blue"`, `"yellow"` and any valid Hex code (e.g., `"#f0d9b5"`). The default value of `"green"` will be used for incorrect values.

<details>
<summary><strong>Parameters</strong></summary>

- `qos`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`
- `color` `(String)` — *optional*
- `isToggle` `(Boolean)` — *optional*

</details>

**Returns:** None

**Examples:**

```javascript
IcUi.drawCircle("e4")
IcUi.drawCircle([0, 0])
IcUi.drawCircle("a2", "#9f4ae0")
IcUi.drawCircle("b2", "red", false)
IcUi.drawCircle("c2", "blue", true)
```

---

### `IcUi.drawArrow(...)`

Draws a directional arrow between two squares.

The Boolean option `isToggle` defaults to `false` when not set to a Boolean value of `true`.

Accepted values for `color` are the strings `"red"`, `"green"`, `"blue"`, `"yellow"` and any valid Hex code (e.g., `"#f0d9b5"`). The default value of `"green"` will be used for incorrect values.

<details>
<summary><strong>Parameters</strong></summary>

- `from_qos`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`
- `to_qos`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`
- `color` `(String)` — *optional*
- `isToggle` `(Boolean)` — *optional*

</details>

**Returns:** None

**Examples:**

```javascript
IcUi.drawArrow("g1", "f3")
IcUi.drawArrow([6, 4], [4, 4], "blue")
IcUi.drawArrow("a2", "a4", "#9f4ae0")
IcUi.drawArrow("b2", "b4", "red", false)
IcUi.drawArrow("c2", "c4", "blue", true)
```

---

### `IcUi.clearCircle(...)`

Removes a specific circular highlight if it exists.

<details>
<summary><strong>Parameters</strong></summary>

- `qos`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`

</details>

**Returns:** None

**Examples:**

```javascript
IcUi.clearCircle("e4")
IcUi.clearCircle([0, 0])
```

---

### `IcUi.clearArrow(...)`

Removes a specific arrow between two squares if it exists.

<details>
<summary><strong>Parameters</strong></summary>

- `from_qos`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`
- `to_qos`
  - **squareBos** `(String)`
  - **squarePos** `(Array)`
  - **square** `(Object)`

</details>

**Returns:** None

**Examples:**

```javascript
IcUi.clearArrow("g1", "f3")
IcUi.clearArrow([6, 4], [4, 4])
```

---

### `IcUi.clearMarkers()`

Clears all markers (both arrows and circles) from the board.

> [!NOTE]
> Markers are also automatically cleared whenever a board animation occurs (navigating moves or playing a move).

**Parameters:** None

**Returns:** None

**Examples:**

```javascript
IcUi.clearMarkers()
```


<p align="center"><a href="https://github.com/ajax333221/isepic-chess-ui?tab=readme-ov-file#book-documentation">« Return</a></p>
