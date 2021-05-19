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
**refreshUi**(<br>*animationType*<br>) | <ul><li>:eight_pointed_black_star:animationType (Number)</li></ul><hr>:eight_pointed_black_star:Optional Parameter | - | Yes | This method will:<ul><li>Refresh the HTML of all the components (if any) to reflect the internal state of the board.</li><li>Update the **data-boardname** attribute of the board component (if any) with the **board name** of the board calling the method.</li><li>Finish any ongoing piece animations.</li><li>Cancel any ongoing piece dragging.</li><li>Start the current animation (if any).</li></ul>If `animationType` is a **falsy-value**, no animation will happen.<br><br>If `animationType` is a **positive number**, the board will be refreshed with an animation as if the last move was played.<br><br>If `animationType` is a **negative number**, the board will be refreshed with an animation as if the next move was reverted.<hr>Examples:<ul><li>`board.refreshUi(0)`</li><li>`board.refreshUi(1)`</li><li>`board.refreshUi(-1)`</li></ul>

<p align="center"><a href="https://github.com/ajax333221/isepic-chess-ui#book-documentation">« Return</a></p>
