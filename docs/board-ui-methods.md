<p align="center"><a href="https://github.com/ajax333221/isepic-chess-ui#book-documentation">« Return</a></p>

# Board UI Methods

> **Note:** the board UI methods will automatically start working when **isepic-chess-ui.js** is present, otherwise nothing will happen when they are called.

Boards created by `Ic.initBoard()` have the following available UI methods.

## Quick Reference

| Method                                 | Returns | UI? | Brief                                                      |
| -------------------------------------- | ------- | --- | ---------------------------------------------------------- |
| [`board.refreshUi()`](#boardrefreshui) | -       | ✓   | Refreshes the board UI components and manages animation... |

## Method Details

---

### `board.refreshUi(...)`

> 🔄 **Triggers UI refresh**

Refreshes the board UI components and manages animations, sounds, and highlights.

This method will:

- Refresh the HTML of all the components (if any) to reflect the internal state of the board.
- Finish ongoing piece animations.
- Cancel ongoing piece dragging.
- Unselect and unhighlight squares.
- Start the current animation (if any).
- Highlight squares (if any).

If `animationType` is a **falsy-value**, no animation will happen.

If `animationType` is a **positive number**, the board will be refreshed with an animation as if the last move was played.

If `animationType` is a **negative number**, the board will be refreshed with an animation as if the next move was reverted.

If `playSounds` is a **truthy-value**, a sound might be played depending on multiple factors (if sound effects are not disabled in the configuration or by the browser). The sounds might get suppressed by browsers if the method was not fired from a click or keypress.

<details>
<summary><strong>Parameters</strong></summary>

- `animationType` `(Number)` — _optional_
- `playSounds` `(Boolean)` — _optional_

</details>

**Returns:** None

**Examples:**

```javascript
board.refreshUi();
board.refreshUi(0);
board.refreshUi(1);
board.refreshUi(-1);
board.refreshUi(1, true);
board.refreshUi(-1, false);
```

<p align="center"><a href="https://github.com/ajax333221/isepic-chess-ui#book-documentation">« Return</a></p>
