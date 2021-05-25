<p align="center"><a href="https://github.com/ajax333221/isepic-chess-ui#book-documentation">« Return</a></p>

<h1 align="center">Board Ui methods</h1>

> **Note:** the board UI methods will automatically start working when **isepic-chess-ui.js** is present, otherwise nothing will happen when they are called.

Boards created by `Ic.initBoard()` have the following available UI methods:

<ul>
<li>board.refreshUi()</li>
</ul>

#### Table `board.<UImethods>(...)`:

Function | Parameters | Return | UI refresh? | Description
-------- | ---------- | ------ | ----------- | -----------
**refreshUi**(<br>*animationType*,<br>*playSounds*<br>) | <ul><li>:eight_pointed_black_star:animationType (Number)</li><li>:eight_pointed_black_star:playSounds (Boolean)</li></ul><hr>:eight_pointed_black_star:Optional Parameter | - | Yes | This method will:<ul><li>Refresh the HTML of all the components (if any) to reflect the internal state of the board.</li><li>Finish ongoing piece animations.</li><li>Cancel ongoing piece dragging.</li><li>Unselect and unhighlight squares.</li><li>Start the current animation (if any).</li><li>Highlight squares (if any).</li></ul>If `animationType` is a **falsy-value**, no animation will happen.<br><br>If `animationType` is a **positive number**, the board will be refreshed with an animation as if the last move was played.<br><br>If `animationType` is a **negative number**, the board will be refreshed with an animation as if the next move was reverted.<br><br>If `playSounds` is a **truthy-value**, a sound might be played depending on multiple factors (if sound effects are not disabled in the configuration or by the browser). The sounds might get supressed by browers if the method was not fired from a click or keypress.<hr>Examples:<ul><li>`board.refreshUi()`</li><li>`board.refreshUi(0)`</li><li>`board.refreshUi(1)`</li><li>`board.refreshUi(-1)`</li><li>`board.refreshUi(1, true)`</li><li>`board.refreshUi(-1, false)`</li></ul>

<p align="center"><a href="https://github.com/ajax333221/isepic-chess-ui#book-documentation">« Return</a></p>
